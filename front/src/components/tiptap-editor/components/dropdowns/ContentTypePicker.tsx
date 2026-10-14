import { ChevronDown, LoaderCircle } from "lucide-react";
import { PropsWithChildren, useMemo } from "react";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { ToolbarButton } from "../ui/Toolbar";
import { Surface } from "../ui/Surface";
import { DropdownButton, DropdownCategoryTitle } from "../ui/Dropdown";
import { type ContentTypeIconName } from "./ContentTypePicker.types";
import { PickerIcon } from "./PickerIcon";

export type ContentTypePickerOption = {
  label: string;
  id: string;
  type: "option";
  disabled: () => boolean;
  isActive: () => boolean;
  onClick: () => void;
  icon: ContentTypeIconName;
};

export type ContentTypePickerCategory = {
  label: string;
  id: string;
  type: "category";
};

export type ContentPickerOptions = Array<
  ContentTypePickerOption | ContentTypePickerCategory
>;

export type ContentTypePickerProps = {
  options: ContentPickerOptions;
  fixedIcon?: ContentTypeIconName;
  isLoading?: boolean;
};

const isOption = (
  option: ContentTypePickerOption | ContentTypePickerCategory,
): option is ContentTypePickerOption => option.type === "option";

const isCategory = (
  option: ContentTypePickerOption | ContentTypePickerCategory,
): option is ContentTypePickerCategory => option.type === "category";

export const ContentTypePicker = ({
  options,
  fixedIcon,
  isLoading,
  children,
}: PropsWithChildren<ContentTypePickerProps>) => {
  const activeItem = useMemo(
    () =>
      options.find(
        (option): option is ContentTypePickerOption =>
          isOption(option) && option.isActive(),
      ),
    [options],
  );

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <ToolbarButton
          active={activeItem?.id !== "paragraph" && !!activeItem?.type}
        >
          {isLoading ? (
            <LoaderCircle
              aria-hidden="true"
              className="h-4 w-4 animate-spin"
              strokeWidth={2}
            />
          ) : (
            <>
              <PickerIcon
                className="text-base-content/60"
                name={activeItem?.icon || fixedIcon || "Pilcrow"}
              />
              <ChevronDown
                aria-hidden="true"
                className="h-2 w-2 text-base-content/40"
                strokeWidth={2}
              />
            </>
          )}
        </ToolbarButton>
      </Dropdown.Trigger>
      <Dropdown.Content asChild>
        <Surface
          className="flex flex-col gap-1 px-2 py-3 mt-4 bg-base-100"
        >
          {options.map((option) => {
            if (isOption(option)) {
              return (
                <DropdownButton
                  key={option.id}
                  onClick={option.onClick}
                  isActive={option.isActive()}
                >
                  <PickerIcon
                    name={option.icon}
                    className="mr-1"
                  />
                  <span className="select-none">
                    {option.label}
                  </span>
                </DropdownButton>
              );
            } else if (isCategory(option)) {
              return (
                <div className="mt-2 first:mt-0" key={option.id}>
                  <DropdownCategoryTitle key={option.id}>
                    {option.label}
                  </DropdownCategoryTitle>
                </div>
              );
            }
          })}
          {children}
        </Surface>
      </Dropdown.Content>
    </Dropdown.Root>
  );
};
