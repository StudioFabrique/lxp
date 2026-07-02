/**
 * TableWrapper - A component that wraps tables with consistent styling
 *
 * This component provides a standardized appearance for tables across the application.
 * It applies consistent minimum width, text sizing, and spacing between rows.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to render inside the table (typically thead and tbody elements)
 *
 * @example
 * ```tsx
 * <TableWrapper>
 *   <thead>
 *     <tr>
 *       <th>Header 1</th>
 *       <th>Header 2</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Cell 1</td>
 *       <td>Cell 2</td>
 *     </tr>
 *   </tbody>
 * </TableWrapper>
 * ```
 */
type Props = {
  children: React.ReactNode;
};

function TableWrapper({ children }: Props) {
  // Render a table with consistent styling:
  // - Full width container
  // - Responsive text size (smaller on mobile, larger on xl screens)
  // - Border-separate with consistent row spacing for better readability
  return (
    <table className="min-w-full text-xs xl:text-sm table border-separate border-spacing-y-2">
      {children}
    </table>
  );
}

export default TableWrapper;
