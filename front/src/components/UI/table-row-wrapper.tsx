type Props = {
  children: React.ReactNode;
};

export default function TableRowWrapper({ children }: Props) {
  return (
    <tr className="min-w-full text-base-content group cursor-pointer [&>td]:bg-base-100 [&>td]:px-2 [&>td]:transition-colors hover:[&>td]:bg-base-100/60 [&>td:first-child]:rounded-l-xl [&>td:first-child]:pl-6 [&>td:last-child]:rounded-r-xl [&>td:last-child]:pr-6">
      {children}
    </tr>
  );
}
