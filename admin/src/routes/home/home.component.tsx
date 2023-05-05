import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/context.store";
import UserList from "../../components/user-list/user-list";
import useHttp from "../../hooks/use-http";
import usePagination from "../../hooks/use-pagination";
import Pagination from "../../components/UI/pagination/pagination";

const Home = () => {
  const { logout } = useContext(Context);

  return (
    <div className="home bg-red h-screen w-screen flex flex-col items-center">
      <p>Hey je suis la page Home</p>
      <button onClick={logout}>logout</button>      
       <UserList  />
    </div>
  );
};

export default Home;
