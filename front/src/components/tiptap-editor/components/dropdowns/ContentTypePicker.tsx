import {
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Loader,
  Pilcrow,
  Plus,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
  type LucideIcon,
} from "lucide-react";
import { PropsWithChildren, useMemo } from "react";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { Toolbar } from "../ui/Toolbar";
import { Surface } from "../ui/Surface";
import { DropdownButton, DropdownCategoryTitle } from "../ui/Dropdown";

const pickerIcons = {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Pilcrow,
  Plus,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
} satisfies Record<string, LucideIcon>;

type ContentTypeIconName = keyof typeof pickerIcons;

const PickerIcon = ({
  name,
  className,
}: {
  name: ContentTypeIconName;
  className?: string;
}) => {
  const IconComponent = pickerIcons[name];

  return (
    <IconComponent
      aria-hidden="true"
      className={`h-4 w-4 antialiased ${className ?? ""}`}
      strokeWidth={2}
    />
  );
};

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
        <Toolbar.Button
          active={activeItem?.id !== "paragraph" && !!activeItem?.type}
        >
          {isLoading ? (
            <Loader
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
        </Toolbar.Button>
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
