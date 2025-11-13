import { icons } from "lucide-react";
import { PropsWithChildren, useMemo } from "react";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { Toolbar } from "../ui/Toolbar";
import { Icon } from "../ui/Icon";
import { Surface } from "../ui/Surface";
import { DropdownButton, DropdownCategoryTitle } from "../ui/Dropdown";

export type ContentTypePickerOption = {
  label: string;
  id: string;
  type: "option";
  disabled: () => boolean;
  isActive: () => boolean;
  onClick: () => void;
  icon: keyof typeof icons;
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
  fixedIcon?: keyof typeof icons;
  isLoading?: boolean;
};

const isOption = (
  option: ContentTypePickerOption | ContentTypePickerCategory
): option is ContentTypePickerOption => option.type === "option";
const isCategory = (
  option: ContentTypePickerOption | ContentTypePickerCategory
): option is ContentTypePickerCategory => option.type === "category";

export const ContentTypePicker = ({
  options,
  fixedIcon,
  isLoading,
  children,
}: PropsWithChildren<ContentTypePickerProps>) => {
  const activeItem = useMemo(
    () =>
      options.find((option) => option.type === "option" && option.isActive()),
    [options]
  );

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Toolbar.Button
          active={activeItem?.id !== "paragraph" && !!activeItem?.type}
        >
          {isLoading ? (
            <Icon name="Loader" className="animate-spin" />
          ) : (
            <>
              <Icon
                className="text-base-content"
                name={
                  (activeItem?.type === "option" && activeItem.icon) ||
                  fixedIcon ||
                  "Pilcrow"
                }
              />
              <Icon name="ChevronDown" className="w-2 h-2 text-base-content" />
            </>
          )}
        </Toolbar.Button>
      </Dropdown.Trigger>
      <Dropdown.Content asChild>
        <Surface className="flex flex-col gap-1 px-2 py-4 my-5">
          {options.map((option) => {
            if (isOption(option)) {
              return (
                <DropdownButton
                  key={option.id}
                  onClick={option.onClick}
                  isActive={option.isActive()}
                >
                  <Icon
                    name={option.icon}
                    className="w-4 h-4 mr-1 text-base-content"
                  />
                  <span className="text-base-content select-none">
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
