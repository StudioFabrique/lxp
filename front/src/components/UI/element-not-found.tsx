/**
 * ElementNotFound - A component to display when no data is found
 *
 * This component renders a consistent styled container with a message
 * when no elements/data are available to display.
 *
 * @param {Object} props - Component props
 * @param {string} [props.message="Aucun objet trouvé"] - The message to display when no elements are found
 *
 * @example
 * ```tsx
 * <ElementNotFound message="No courses found" />
 * ```
 */
type Props = {
  message?: string;
};

function ElementNotFound({ message = "Aucun objet trouvé" }: Props) {
  return (
    <div className="w-full flex items-center justify-center border-dashed border border-secondary/100 rounded-lg p-4">
      <p>{message}</p>
    </div>
  );
}

export default ElementNotFound;
