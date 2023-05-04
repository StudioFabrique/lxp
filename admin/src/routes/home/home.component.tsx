import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/context.store";
import UserList from "../../components/user-list/user-list";
import useHttp from "../../hooks/use-http";
import usePagination from "../../hooks/use-pagination";
import Pagination from "../../components/UI/pagination/pagination";

const Home = () => {
  const { logout } = useContext(Context);
  const [userList, setUserList] = useState<Array<any>>([]);
  const [role, setRole] = useState("admin");
  const { isLoading, error, sendRequest } = useHttp();
  const { page, perPage, totalPages, setTotalPages, initPagination, setPage } =
    usePagination();

  useEffect(() => {
    const applyData = (data: any) => {
      let index = (page - 1) * perPage + 1;
      data.users.forEach((item: any) => {
        item.index = index++ + ".";
        item.createdAt =
          item?.createdAt && new Date(item.createdAt).toLocaleDateString();
        item.updatedAt =
          item?.updatedAt && new Date(item.updatedAt).toLocaleDateString();
      });
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

  const handleTabClick = (newRole: string) => {
    initPagination();
    setRole(newRole);
  };

  return (
    <div className="home bg-red h-screen w-screen flex flex-col items-center">
      <p>Hey je suis la page Home</p>
      <button onClick={logout}>logout</button>
      <div className="mt-8">
        <div className="tabs">
          <p
            className={
              role === "admin" ? "tab tab-lifted tab-active" : "tab tab-lifted"
            }
            onClick={() => handleTabClick("admin")}
          >
            Admins
          </p>
          <p
            className={
              role === "teacher"
                ? "tab tab-lifted tab-active"
                : "tab tab-lifted"
            }
            onClick={() => handleTabClick("teacher")}
          >
            Formateurs
          </p>
          <p
            className={
              role === "student"
                ? "tab tab-lifted tab-active"
                : "tab tab-lifted"
            }
            onClick={() => handleTabClick("student")}
          >
            Apprenants
          </p>
        </div>
        {userList ? <UserList userList={userList} /> : null}
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        <div className="w-full mt-8 flex justify-center">
          <p>{error}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
