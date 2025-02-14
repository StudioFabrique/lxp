type Props = {
  onChange: (value: string) => void;
};

const options = [
  { value: "createdAt", label: "Date de création" },
  { value: "size", label: "Taille" },
  { value: "updatedAt", label: "Dernières modification" },
];

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
function MediaFilterSelect({ onChange }: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.currentTarget.value);
    onChange(event.currentTarget.value);
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
