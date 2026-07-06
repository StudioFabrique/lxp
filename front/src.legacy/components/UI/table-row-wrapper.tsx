/**
 * TableRowWrapper - A component that wraps table rows with consistent styling
 *
 * This component provides a standardized appearance for table rows with hover effects.
 * It applies background colors and text styling consistently across tables.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to render inside the table row
 *
 * @example
 * ```tsx
 * <TableRowWrapper>
 *   <td>Cell 1</td>
 *   <td>Cell 2</td>
 * </TableRowWrapper>
 * ```
 */
type Props = {
  children: React.ReactNode;
};

export default function TableRowWrapper({ children }: Props) {
  // Render a table row with consistent styling
  // Uses a light secondary color background that darkens on hover
  return (
    <tr className="min-w-full bg-secondary/10 hover:bg-secondary/20 hover:text-base-content">
      {children}
    </tr>
  );
}
