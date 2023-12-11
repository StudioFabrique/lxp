import { useEffect, useState } from "react";
import Information from "../../components/user-profile/information/information";
import Calendar from "../../components/user-profile/calendar";
import Evaluations from "../../components/user-profile/evaluations";
import Awards from "../../components/user-profile/awards/awards";
import Account from "../../components/user-profile/account";
import User from "../../utils/interfaces/user";
import useHttp from "../../hooks/use-http";
import Loader from "../../components/UI/loader";

const UserProfile = () => {
  type Tab = "Info" | "Calendar" | "Evals" | "Awards" | "Account";
  const { sendRequest, isLoading } = useHttp(true);

  const [currentTab, setCurrentTab] = useState<Tab>("Info");

  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    const applyData = (data: { message: string; data: User }) => {
      setUserData(data.data);
      console.log({ donneesduserveur: data.data });
    };

    sendRequest({ path: "/user/connected" }, applyData);
  }, [sendRequest]);

  const Render = () => {
    switch (currentTab) {
      case "Info":
        return <Information userData={userData} />;
      case "Calendar":
        return <Calendar />;
      case "Evals":
        return <Evaluations />;
      case "Awards":
        return <Awards userData={userData} />;
      case "Account":
        return <Account />;
    }
  };

  return (
    <div className="flex flex-col gap-5 p-10">
      <h2 className="font-bold text-xl">Mon profil</h2>
      <div className="flex gap-5">
        <button
          type="button"
          className="btn"
          value="Info"
          onClick={(e) => setCurrentTab(e.currentTarget.value as Tab)}
        >
          Information
        </button>
        <button
          type="button"
          className="btn"
          value="Calendar"
          onClick={(e) => setCurrentTab(e.currentTarget.value as Tab)}
        >
          Calendrier
        </button>
        <button
          type="button"
          className="btn"
          value="Evals"
          onClick={(e) => setCurrentTab(e.currentTarget.value as Tab)}
        >
          Evaluations
        </button>
        <button
          type="button"
          className="btn"
          value="Awards"
          onClick={(e) => setCurrentTab(e.currentTarget.value as Tab)}
        >
          Badge & Compétences
        </button>
        <button
          type="button"
          className="btn"
          value="Account"
          onClick={(e) => setCurrentTab(e.currentTarget.value as Tab)}
        >
          Compte
        </button>
      </div>
      {isLoading ? <Loader /> : <Render />}
    </div>
  );
};

export default UserProfile;
