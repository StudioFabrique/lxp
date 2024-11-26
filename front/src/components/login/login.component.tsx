/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react";

import { Context } from "../../store/context.store";
import LoginForm from "./login-form.component";
import bgSide from "../../assets/images/BG-side.png";
import logo from "../../assets/images/andria-2.png";
import axios from "axios";
import { BASE_URL } from "../../config/urls";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { error, setUser, setError, logout } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = async (email: string, password: string) => {
    setError("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login/`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      navigate("/" + response.data.roles[0].role);

      setUser(response.data);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Identifiant ou mot de passe incorrect");
        setIsLoading(false);
        if (err.response?.status === 403) {
          logout();
        }
      } else setError("Problème serveur, réessayez plus tard svp");
    }
  };

  const handleSubmit = (email: string, password: string) => {
    login(email, password);
  };
  return (
    <div className="w-full h-screen flex flex-row justify-between items font-inter text-pink bg-gradient-to-b from-[#76284e] to-[#202237]">
      <div className="w-[73.5%] flex flex-col text-pink-900 justify-between bg-white rounded-r-[50px] p-20 pl-15 max-sm:p-2">
        <div className="text-[14pt] font-bold flex flex-col">
          <img className="w-48 h-auto" src={logo} alt="logo lxp" />
        </div>
        <LoginForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
        <div className="flex flex-row gap-x-2">
          {/* <img className="h-8" src="connexion/info.svg" alt="" /> */}
          <button className="text-[10pt]">Besoin d'aide?</button>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 max-w-[47%] max-md:max-w-[80%] max-md:-right-[20%] max-sm:-right-[19%] max-sm:max-w-[80%] pointer-events-none">
        <img src={bgSide} alt="décoration" />
      </div>
    </div>
  );
};

export default Login;
