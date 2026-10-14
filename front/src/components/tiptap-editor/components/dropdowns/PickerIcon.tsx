import { cn } from "../../../../utils/cn";
import { type ContentTypeIconName } from "./ContentTypePicker.types";
import { pickerIcons } from "./ContentTypePicker.utils";

export const PickerIcon = ({
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
      className={cn("h-4 w-4 antialiased", className ?? "")}
      strokeWidth={2}
    />
  );
};
