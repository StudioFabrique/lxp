type Props = {
  options: { value: string; label: string }[];
  onChange: (sort: "createdAt" | "size" | "used") => void;
};

/**
 * A select component for filtering media content
 *
 * @component
 * @param {Object} props - Component props
 * @param {(value: string) => void} props.onChange - Callback function triggered when selection changes
 *
 * @example
 * ```tsx
 * <MediaFilterSelect onChange={(value) => console.log(value)} />
 * ```
 */
function MediaFilterSelect({ options, onChange }: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.currentTarget.value);
    onChange(event.currentTarget.value as "createdAt" | "size" | "used");
  };

  return (
    <select
      className="select select-primary select-sm focus:outline-none"
      onChange={handleChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default MediaFilterSelect;
