import { useCallback, type SetStateAction } from "react";
import {
  useWatch,
  type FieldValues,
  type FieldPath,
  type FieldPathValue,
  type UseFormReturn,
} from "react-hook-form";

/** Connecte un champ contrôlé à RHF, y compris les mises à jour de listes. */
export function useFormField<T extends FieldValues, N extends FieldPath<T>>(
  form: UseFormReturn<T>,
  name: N,
) {
  const value = useWatch({ control: form.control, name });
  const { getValues, setValue } = form;
  const set = useCallback(
    (next: SetStateAction<FieldPathValue<T, N>>) => {
      const updated =
        typeof next === "function"
          ? (next as (current: FieldPathValue<T, N>) => FieldPathValue<T, N>)(
              getValues(name),
            )
          : next;
      setValue(name, updated, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [getValues, setValue, name],
  );
  return [value, set] as const;
}
