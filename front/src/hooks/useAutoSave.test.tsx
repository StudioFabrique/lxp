import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useForm } from "react-hook-form";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import useAutoSave from "./useAutoSave";
import { autoSaveBlurDelay } from "../config/auto-submit-timer";

let root: Root;
let container: HTMLDivElement;
function Harness({
  save,
  enabled = true,
}: {
  save: () => Promise<void>;
  enabled?: boolean;
}) {
  const form = useForm({ defaultValues: { title: "initial" } });
  useAutoSave(form.watch, save, enabled);
  return (
    <>
      <button
        onClick={() =>
          form.setValue("title", `${form.getValues("title")} changed`)
        }
      >
        Edit
      </button>
      <button onClick={() => form.reset({ title: "loaded" })}>Load</button>
    </>
  );
}
function render(save: () => Promise<void>, enabled = true) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(<Harness save={save} enabled={enabled} />));
}
const tick = () =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(autoSaveBlurDelay);
  });
const blur = () =>
  act(() => {
    document.dispatchEvent(new Event("focusout", { bubbles: true }));
  });
const click = (index = 0) =>
  act(() => container.querySelectorAll("button")[index].click());
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  vi.useRealTimers();
});

it("n'enregistre qu'après la perte de focus, sans enregistrer le chargement initial", async () => {
  const save = vi.fn().mockResolvedValue(undefined);
  render(save);
  click(1);
  blur();
  await tick();
  expect(save).not.toHaveBeenCalled();
  click();
  await tick();
  expect(save).not.toHaveBeenCalled();
  blur();
  await tick();
  expect(save).toHaveBeenCalledTimes(1);
});

it("attend le délai après la perte de focus avant d'enregistrer", async () => {
  const save = vi.fn().mockResolvedValue(undefined);
  render(save);
  click();
  blur();
  await act(async () => {
    await vi.advanceTimersByTimeAsync(autoSaveBlurDelay - 100);
  });
  expect(save).not.toHaveBeenCalled();
  await act(async () => {
    await vi.advanceTimersByTimeAsync(100);
  });
  expect(save).toHaveBeenCalledTimes(1);
});

it("réessaie à la perte de focus suivante après un échec de sauvegarde", async () => {
  const save = vi
    .fn()
    .mockRejectedValueOnce(new Error("network"))
    .mockResolvedValue(undefined);
  render(save);
  click();
  blur();
  await tick();
  expect(save).toHaveBeenCalledTimes(1);
  blur();
  await tick();
  expect(save).toHaveBeenCalledTimes(2);
});

it("attend la requête en cours puis sauvegarde les modifications intervenues pendant celle-ci", async () => {
  let finish!: () => void;
  const pending = new Promise<void>((resolve) => {
    finish = resolve;
  });
  const save = vi
    .fn()
    .mockReturnValueOnce(pending)
    .mockResolvedValue(undefined);
  render(save);
  click();
  blur();
  await tick();
  click();
  blur();
  await tick();
  expect(save).toHaveBeenCalledTimes(1);
  await act(async () => {
    finish();
    await pending;
  });
  blur();
  await tick();
  expect(save).toHaveBeenCalledTimes(2);
});

it("enregistre immédiatement une modification en attente à la fermeture de l'écran", async () => {
  const save = vi.fn().mockResolvedValue(undefined);
  render(save);
  click();
  blur();
  act(() => root.unmount());
  expect(save).toHaveBeenCalledTimes(1);
  root = createRoot(container);
});

it("ne sauvegarde pas un écran désactivé", async () => {
  const save = vi.fn().mockResolvedValue(undefined);
  render(save, false);
  click();
  blur();
  await tick();
  expect(save).not.toHaveBeenCalled();
});
