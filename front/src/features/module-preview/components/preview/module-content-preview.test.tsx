import { act, type ComponentProps, type PropsWithChildren } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import ModuleContentPreview from "./module-content-preview";

vi.mock("./lesson-reader-and-editor", () => ({
  default: ({ fadeScrollButtonsOnly = false, hideScrollButtons = false, children }: PropsWithChildren<{ fadeScrollButtonsOnly?: boolean; hideScrollButtons?: boolean }>) => (
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

it.each([true, false])("garde les flèches visibles pendant la navigation et le scroll (admin : %s)", (canNavigateAsAdmin) => {
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
  const reader = scrollContainer.querySelector("[data-buttons-hidden]");
  expect(buttonsHidden()).toBe("false");
  act(() => findButton("Activité suivante").click());
  if (canNavigateAsAdmin) expect(dispatch).toHaveBeenCalledWith({ type: "go_to_next_activity" });
  else expect(nextStudentActivity).toHaveBeenCalledOnce();

  store.isActivityContentLoading = true;
  render();
  expect(scrollContainer.querySelector("[data-buttons-hidden]")).toBe(reader);
  expect(buttonsHidden()).toBe("false");

  store.isActivityContentLoading = false;
  store.state.selectedActivity = { ...store.state.selectedActivity!, id: 2 };
  render();
  expect(scrollContainer.querySelector("[data-buttons-hidden]")).toBe(reader);
  act(() => scrollContainer.dispatchEvent(new Event("scroll")));
  act(() => vi.advanceTimersByTime(2000));
  expect(buttonsHidden()).toBe("false");
  expect(fadeOnly()).toBe("false");

  act(() => findButton("Activité précédente").click());
  expect(dispatch).toHaveBeenCalledWith({ type: "go_to_previous_activity" });
  expect(scrollContainer.querySelector("[data-buttons-hidden]")).toBe(reader);
  expect(buttonsHidden()).toBe("false");
});
