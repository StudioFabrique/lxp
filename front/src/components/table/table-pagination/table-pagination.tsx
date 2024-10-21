import { ChevronLeft, ChevronRight } from "lucide-react";

const TablePagination = () => {
  return (
    <div className="flex gap-5 rounded-lg justify-end w-full bg-primary p-1 text-base-100">
      <div className="join">
        <button className="join-item btn btn-sm btn-ghost">
          <ChevronLeft />
        </button>
        <button className="join-item btn btn-sm btn-ghost">22 sur 50</button>
        <button className="join-item btn btn-sm btn-ghost">
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
