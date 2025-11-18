/**
 * ListHeader - A container component for list pages with consistent styling
 *
 * This component provides a standardized layout container for list views,
 * with appropriate padding, width constraints and centering.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to render inside the container
 *
 * @example
 * ```tsx
 * <ListHeader>
 *   <h1>My List Title</h1>
 *   <div>List content goes here...</div>
 * </ListHeader>
 * ```
 */
type Props = {
  children: React.ReactNode;
};

function ListHeader({ children }: Props) {
  // Render a main container with responsive width (full on mobile, 9/12 on xl screens)
  // Adds consistent padding and spacing between child elements
  return (
    <main className="w-full flex flex-col items-center px-4 py-8 gap-8">
      {children}
    </main>
  );
}

export default ListHeader;
