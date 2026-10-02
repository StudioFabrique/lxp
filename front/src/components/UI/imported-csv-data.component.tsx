import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { requiredText } from "../../utils/validation/fields";
import { showFormErrors } from "../form/form-errors";
import { useFormField } from "../form/useFormField";
import DrawerFormButtons from "./drawer-form-buttons/drawer-form-buttons.component";
import SortColumnIcon from "./sort-column-icon/sort-column-icon";

type Row = { description: string };
type Props<T extends Row> = {
  data: T[];
  label: string;
  field: "description";
  onCloseDrawer: () => void;
  onPostData: (selected: T[]) => void;
};
export default function ImportedCSVData<T extends Row>({
  data,
  label,
  field,
  onCloseDrawer,
  onPostData,
}: Props<T>) {
  const schema = useMemo(
    () =>
      z
        .object({
          selected: z
            .array(z.number().int().nonnegative())
            .min(1, "Sélectionnez au moins une ligne."),
        })
        .superRefine(({ selected }, context) =>
          selected.forEach((index) => {
            const result = requiredText(
              "La description est obligatoire.",
            ).safeParse(data[index]?.description);
            if (!result.success)
              context.addIssue({
                code: "custom",
                path: ["selected"],
                message: `Ligne ${index + 1} : ${result.error.issues[0].message}`,
              });
          }),
        ),
    [data],
  );
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { selected: [] as number[] },
  });
  const [selected, setSelected] = useFormField(form, "selected");
  const [direction, setDirection] = useState(true);
  const allChecked = data.length > 0 && selected.length === data.length;
  const { reset } = form;
  useEffect(() => {
    reset({ selected: [] });
  }, [data, reset]);
  const rows = data
    .map((item, index) => ({ item, index }))
    .sort(
      (a, b) =>
        (direction ? 1 : -1) *
        a.item.description.localeCompare(b.item.description),
    );
  const submit = form.handleSubmit(({ selected }) => {
    onPostData(
      selected.map((index) => ({
        ...data[index],
        description: data[index].description.trim(),
      })),
    );
    reset();
  }, showFormErrors);
  const cancel = () => {
    reset();
    onCloseDrawer();
  };
  if (!data.length) return null;
  return (
    <>
      <p className="mt-4">Choisissez les {label} à importer</p>
      <form className="max-w-[40rem]" onSubmit={submit}>
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  aria-label="Tout sélectionner"
                  className="checkbox checkbox-sm checkbox-primary"
                  type="checkbox"
                  checked={allChecked}
                  onChange={() =>
                    setSelected(allChecked ? [] : data.map((_, index) => index))
                  }
                />
              </th>
              <th>
                <button
                  type="button"
                  className="flex items-center gap-x-2 capitalize"
                  onClick={() => setDirection((value) => !value)}
                >
                  {label}
                  <SortColumnIcon
                    fieldSort={field}
                    column={field}
                    direction={direction}
                  />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ item, index }) => (
              <tr
                key={index}
                className="hover:bg-secondary/20 hover:text-base-content"
              >
                <td>
                  <input
                    aria-label={`Sélectionner ${item.description}`}
                    className="checkbox checkbox-sm checkbox-primary"
                    type="checkbox"
                    checked={selected.includes(index)}
                    onChange={() =>
                      setSelected((current) =>
                        current.includes(index)
                          ? current.filter((value) => value !== index)
                          : [...current, index],
                      )
                    }
                  />
                </td>
                <td className="capitalize truncate">
                  <p className="max-w-[30rem] text-ellipsis">{item[field]}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <DrawerFormButtons onCancel={cancel} />
      </form>
    </>
  );
}
