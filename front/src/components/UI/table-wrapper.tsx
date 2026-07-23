type Props = {
  children: React.ReactNode;
};

function TableWrapper({ children }: Props) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-xs xl:text-sm table border-separate border-spacing-y-5">
        {children}
      </table>
    </div>
  );
}

export default TableWrapper;
