type Props = {
  children: React.ReactNode;
};

function TableWrapper({ children }: Props) {
  return (
    <TableOverflowContainer>
      <table className="min-w-full text-xs xl:text-sm table border-separate border-spacing-y-5">
        {children}
      </table>
    </TableOverflowContainer>
  );
}

export default TableWrapper;
import TableOverflowContainer from "../table/TableOverflowContainer";
