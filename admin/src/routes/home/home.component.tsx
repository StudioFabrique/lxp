import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/context.store";
import UserList from "../../components/user-list/user-list";
import useHttp from "../../hooks/use-http";
import usePagination from "../../hooks/use-pagination";
import Pagination from "../../components/UI/pagination/pagination";

const Home = () => {
  const { logout } = useContext(Context);
  const [userList, setUserList] = useState<Array<any>>([]);
  const [role, setRole] = useState("student");
  const { isLoading, error, sendRequest } = useHttp();
  const { page, perPage, totalPages, setTotalPages, initPagination, setPage } =
    usePagination();

  useEffect(() => {
    const applyData = (data: any) => {
      console.log(data);
      console.log(data);
      setTotalPages(data.total);
      setUserList(data.users);
    };
    sendRequest(
      {
        path: `/user/${role}?page=${page}&limit=${perPage}`,
      },
      applyData
    );
  }, [sendRequest, page, perPage, setTotalPages, role]);

  return (
    <>
      <div className="home bg-red h-screen w-screen flex flex-col">
        Hey je suis la page Home <br />
        <button onClick={logout}>logout</button>
        <div className="tabs">
          <p className="tab tab-lifted">Admins</p>
          <p className="tab tab-lifted tab-active">Formateurs</p>
          <p className="tab tab-lifted">Apprenants</p>
        </div>
        <div className="w-full mt-8 flex justify-center">
          <p>{error}</p>
        </div>
        {userList.length !== 0 ? <UserList userList={userList} /> : null}
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </>
  );
};

export default Home;
