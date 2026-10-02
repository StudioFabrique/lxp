import { act, type ComponentProps, type PropsWithChildren } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import ModuleContentPreview from "./module-content-preview";

vi.mock("./lesson-reader-and-editor", () => ({
  default: ({ fadeScrollButtonsOnly, hideScrollButtons, children }: PropsWithChildren<{ fadeScrollButtonsOnly: boolean; hideScrollButtons: boolean }>) => (
    <div data-fade-only={String(fadeScrollButtonsOnly)} data-buttons-hidden={String(hideScrollButtons)}>{children}</div>
  ),
}));
vi.mock("../../../../components/wrappers/FadeWrapper", () => ({
  default: ({ children }: PropsWithChildren) => <>{children}</>,
}));

let root: Root | undefined;
afterEach(() => {
  act(() => root?.unmount());
  root = undefined;
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

it.each([true, false])("limite le fondu à la navigation suivante (admin : %s)", (canNavigateAsAdmin) => {
  vi.useFakeTimers();
  vi.stubGlobal("ResizeObserver", class {
    observe = vi.fn();
    disconnect = vi.fn();
  });
  const scrollContainer = document.createElement("main");
  scrollContainer.id = "main-scroll-container";
  document.body.append(scrollContainer);
  root = createRoot(scrollContainer);
  const dispatch = vi.fn();
  const nextStudentActivity = vi.fn();
  const store = {
    state: {
      mode: "read", modalVisibility: "none",
      selectedLesson: { activities: [{ id: 1 }, { id: 2 }] },
      selectedActivity: { id: 1, type: "text", title: "Activité" },
    },
    computed: { isFirstActivitySelected: false, isLastActivitySelected: false },
    lessonActions: {}, activityActions: {}, dispatch,
    isActivityContentLoading: false,
  } as unknown as ComponentProps<typeof ModuleContentPreview>["store"];
  const smartQuizState = {
    handleNextActivity: nextStudentActivity,
  } as unknown as ComponentProps<typeof ModuleContentPreview>["smartQuizState"];
  const render = () => act(() => root?.render(
    <ModuleContentPreview store={store} smartQuizState={smartQuizState}
      quizState={{} as ComponentProps<typeof ModuleContentPreview>["quizState"]}
      canNavigateAsAdmin={canNavigateAsAdmin} />,
  ));
  const findButton = (label: string) => Array.from(scrollContainer.querySelectorAll("button"))
    .find(button => button.textContent?.includes(label))!;
  const fadeOnly = () => scrollContainer.querySelector("[data-fade-only]")?.getAttribute("data-fade-only");
  const buttonsHidden = () => scrollContainer.querySelector("[data-buttons-hidden]")?.getAttribute("data-buttons-hidden");

  render();
  expect(fadeOnly()).toBe("false");
  expect(buttonsHidden()).toBe("false");
  act(() => findButton("Activité suivante").click());
  expect(fadeOnly()).toBe("true");
  expect(buttonsHidden()).toBe("true");
  if (canNavigateAsAdmin) expect(dispatch).toHaveBeenCalledWith({ type: "go_to_next_activity" });
  else expect(nextStudentActivity).toHaveBeenCalledOnce();

  store.isActivityContentLoading = true;
  render();
  act(() => vi.advanceTimersByTime(2000));
  store.isActivityContentLoading = false;
  store.state.selectedActivity = { ...store.state.selectedActivity!, id: 2 };
  render();
  expect(fadeOnly()).toBe("true");
  expect(buttonsHidden()).toBe("true");
  act(() => scrollContainer.dispatchEvent(new Event("scroll")));
  act(() => vi.advanceTimersByTime(199));
  expect(fadeOnly()).toBe("true");
  expect(buttonsHidden()).toBe("true");
  // Traverser plusieurs seuils pendant la remontée ne réaffiche pas les boutons.
  act(() => scrollContainer.dispatchEvent(new Event("scroll")));
  act(() => vi.advanceTimersByTime(199));
  expect(buttonsHidden()).toBe("true");
  act(() => vi.advanceTimersByTime(1));
  expect(buttonsHidden()).toBe("false");
  expect(fadeOnly()).toBe("true");
  act(() => vi.advanceTimersByTime(250));
  expect(fadeOnly()).toBe("false");

  act(() => findButton("Activité suivante").click());
  expect(fadeOnly()).toBe("true");
  act(() => findButton("Activité précédente").click());
  expect(fadeOnly()).toBe("false");
  expect(buttonsHidden()).toBe("false");
});
