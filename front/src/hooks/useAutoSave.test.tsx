import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useForm } from "react-hook-form";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import useAutoSave from "./useAutoSave";
import { autoSubmitTimer } from "../config/auto-submit-timer";

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
    await vi.advanceTimersByTimeAsync(autoSubmitTimer);
  });
const click = (index = 0) =>
  act(() => container.querySelectorAll("button")[index].click());
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  vi.useRealTimers();
});

it("enregistre la première modification, sans enregistrer le chargement initial", async () => {
  const save = vi.fn().mockResolvedValue(undefined);
  render(save);
  click(1);
  await tick();
  expect(save).not.toHaveBeenCalled();
  click();
  await tick();
  await tick();
  expect(save).toHaveBeenCalledTimes(1);
});

it("réessaie après un échec de sauvegarde", async () => {
  const save = vi
    .fn()
    .mockRejectedValueOnce(new Error("network"))
    .mockResolvedValue(undefined);
  render(save);
  click();
  await tick();
  await tick();
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
  await tick();
  click();
  await tick();
  expect(save).toHaveBeenCalledTimes(1);
  await act(async () => {
    finish();
    await pending;
  });
  await tick();
  await tick();
  expect(save).toHaveBeenCalledTimes(2);
});

it("ne sauvegarde pas un écran désactivé", async () => {
  const save = vi.fn().mockResolvedValue(undefined);
  render(save, false);
  click();
  await tick();
  expect(save).not.toHaveBeenCalled();
});
