import React, { useContext } from "react";
import { Context } from "../../store/context.store";
import LoginForm from "./login-form.component";

const Login = () => {
  const { isLoading, error, login } = useContext(Context);

  const handleSubmit = (email: string, password: string) => {
    login(email, password);
  };
  return (
    <div className="w-screen h-screen flex justify-center lg:justify-between bg-gradient-to-b from-primary to-secondary">
      <div className="w-5/6 lg:w-3/6 h-full flex flex-col justify-around items-center md:items-start bg-base-100 font-extrabold text-primary md:pl-16">
        <div>
          <h1 className="tracking-widest text-9xl">LXP</h1>
          <h2 className="text-sm md:text-xl font-normal">
            LEARNING EXPERIENCE PLATFORM
          </h2>
        </div>
        <LoginForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
        <div className="font-normal">Besoin d'aide ?</div>
      </div>
      <div className="hidden lg:block w-3/6 h-full relative">
        <div className="w-2/6 h-full bg-base-100 rounded-tr-3xl" />
        <div className="sm:hidden md:block w-full h-full absolute top-0 left-0 md:bg-bgLoginPage bg-no-repeat z-10" />
      </div>
    </div>
  );
};

export default Login;
