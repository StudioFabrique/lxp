/**
 * Wrapper component for consistent layout and styling
 * @param children - Props containing children elements
 * @returns JSX.Element
 */

export default function ViewWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="p-8 w-full xl:w-9/12 mx-auto">{children}</div>;
}
