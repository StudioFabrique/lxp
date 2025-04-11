type Props = {
  children: React.ReactNode;
};

export default function TableRowWrapper({ children }: Props) {
  return (
    <tr className="min-w-full bg-secondary/10 hover:bg-secondary/20 hover:text-base-content">
      {children}
    </tr>
  );
}
