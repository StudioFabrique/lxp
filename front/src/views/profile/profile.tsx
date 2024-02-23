import { Ref, useEffect, useRef, useState } from "react";
import Information from "../../components/user-profile/information/information";
import Calendar from "../../components/user-profile/calendar";
import Parcours from "../../components/user-profile/parcours";
import Awards from "../../components/user-profile/awards/awards";
import Account from "../../components/user-profile/account/account";
import Can from "../../components/UI/can/can.component";
import { useLocation } from "react-router-dom";

type Tab = "Info" | "Calendar" | "Evals" | "Awards" | "Account";

const Profile = () => {
  const { state } = useLocation();

  const [currentTab, setCurrentTab] = useState<Tab>("Info");

  const formRef: Ref<HTMLFormElement> = useRef(null);

  const Render = () => {
    switch (currentTab) {
      case "Info":
        return <Information formRef={formRef} />;
      case "Calendar":
        return <Calendar />;
      case "Evals":
        return <Parcours />;
      case "Awards":
        return <Awards />;
      case "Account":
        return <Account formRef={formRef} />;
    }
  };

  const handleChangeTab = (tab: Tab) => {
    setCurrentTab(tab);
  };

  useEffect(() => {
    if (state?.refreshId) {
      state?.tab && handleChangeTab(state?.tab ?? "Info");
    }
  }, [state?.refreshId, state?.tab, state?.editMode]);

  return (
    <div className="flex flex-col gap-5 p-10">
      <h2 className="font-bold text-xl">Mon profil</h2>
      <div className="flex flex-col xl:flex-row justify-between gap-5">
        <div className="flex flex-col lg:flex-row gap-5">
          <button
            type="button"
            className={`btn ${currentTab === "Info" && "btn-secondary"}`}
            value="Info"
            onClick={() => handleChangeTab("Info")}
          >
            Information
          </button>
          <button
            type="button"
            className={`btn ${currentTab === "Calendar" && "btn-secondary"}`}
            value="Calendar"
            onClick={() => handleChangeTab("Calendar")}
          >
            Calendrier
          </button>
          <button
            type="button"
            className={`btn ${currentTab === "Evals" && "btn-secondary"}`}
            value="Evals"
            onClick={() => handleChangeTab("Evals")}
          >
            Parcours
          </button>
          <button
            type="button"
            className={`btn ${currentTab === "Awards" && "btn-secondary"}`}
            value="Awards"
            onClick={() => handleChangeTab("Awards")}
          >
            Badge & Compétences
          </button>
          <button
            type="button"
            className={`btn ${currentTab === "Account" && "btn-secondary"}`}
            value="Account"
            onClick={() => handleChangeTab("Account")}
          >
            Compte
          </button>
        </div>
        <Can object="default" action="update">
          <button
            className="hidden xl:block btn btn-sm justify-self-end"
            onClick={() => formRef.current?.requestSubmit()}
          >
            Soumettre les changements
          </button>
        </Can>
      </div>
      <Render />
      <div className="flex justify-end">
        <Can object="default" action="update">
          <button
            className="btn btn-sm justify-self-end"
            onClick={() => formRef.current?.requestSubmit()}
          >
            Soumettre les changements
          </button>
        </Can>
      </div>
    </div>
  );
};

export default Profile;
