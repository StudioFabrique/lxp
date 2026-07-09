type Props = {
  children: React.ReactNode;
};

function TableWrapper({ children }: Props) {
  return (
    <table className="min-w-full text-xs xl:text-sm table border-separate border-spacing-y-2">
      {children}
    </table>
  );
}

export default TableWrapper;
