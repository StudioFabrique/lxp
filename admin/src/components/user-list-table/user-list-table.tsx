import React, { FC } from "react";

const UserListTable: FC<{
  data: any[];
  page: number;
  perPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  onSort: (column: number) => void;
}> = (props) => {
  return <h1>coucou tableau</h1>;
};

export default UserListTable;
