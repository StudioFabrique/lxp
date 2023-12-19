import { FC, Ref, useEffect, useRef, useState } from "react";
import Information from "../../components/user-profile/information/information";
import Calendar from "../../components/user-profile/calendar";
import Evaluations from "../../components/user-profile/evaluations";
import Awards from "../../components/user-profile/awards/awards";
import Account from "../../components/user-profile/account/account";
import useHttp from "../../hooks/use-http";
import Loader from "../../components/UI/loader";
import EditIcon from "../../components/UI/svg/edit-icon";
import Can from "../../components/UI/can/can.component";
import { useLocation } from "react-router-dom";

type Tab = "Info" | "Calendar" | "Evals" | "Awards" | "Account";

const Profile = () => {
  const { state } = useLocation();
  console.log(state);

  const { sendRequest: sendRequestInTab, isLoading: isLoadingInTab } =
    useHttp(true);

  const [currentTab, setCurrentTab] = useState<Tab>("Info");

  const [editMode, setEditMode] = useState<boolean>(false);

  const formRef: Ref<HTMLFormElement> = useRef(null);

  const Render = () => {
    switch (currentTab) {
      case "Info":
        return (
          <Information
            editMode={editMode}
            setEditMode={setEditMode}
            sendRequestInTab={sendRequestInTab}
            formRef={formRef}
          />
        );
      case "Calendar":
        return <Calendar />;
      case "Evals":
        return <Evaluations />;
      case "Awards":
        return <Awards />;
      case "Account":
        return (
          <Account
            editMode={editMode}
            setEditMode={setEditMode}
            sendRequestInTab={sendRequestInTab}
            formRef={formRef}
          />
        );
    }
  };

  const SubmitButtonsSet: FC<{ withEditButton?: boolean }> = ({
    withEditButton,
  }) =>
    isLoadingInTab ? (
      <span>
        <Loader />
      </span>
    ) : (
      <div className="flex gap-2 items-center">
        {editMode && (
          <button
            className="btn btn-sm justify-self-end"
            onClick={() => formRef.current?.requestSubmit()}
          >
            Soumettre les changements
          </button>
        )}
        {(withEditButton || editMode) && (
          <button
            type="button"
            className={`btn btn-sm justify-self-end ${
              editMode ? "w-auto" : "w-10 p-0"
            } h-5`}
            onClick={() => setEditMode((editMode) => !editMode)}
          >
            {editMode ? "annuler" : <EditIcon />}
          </button>
        )}
      </div>
    );

  const handleChangeTab = (tab: Tab) => {
    setEditMode(false);
    setCurrentTab(tab);
  };

  useEffect(() => {
    if (state?.refreshId) {
      state?.tab && handleChangeTab(state?.tab ?? "Info");
      state?.editMode && setEditMode(state?.editMode ?? false);
    }
  }, [state?.refreshId, state?.tab, state?.editMode]);

  return (
    <div className="flex flex-col gap-5 p-10">
      <h2 className="font-bold text-xl">Mon profil</h2>
      <div className="flex flex-col xl:flex-row justify-between gap-5">
        <div className="flex gap-5">
          <button
            type="button"
            className="btn"
            value="Info"
            onClick={() => handleChangeTab("Info")}
          >
            Information
          </button>
          <button
            type="button"
            className="btn"
            value="Calendar"
            onClick={() => handleChangeTab("Calendar")}
          >
            Calendrier
          </button>
          <button
            type="button"
            className="btn"
            value="Evals"
            onClick={() => handleChangeTab("Evals")}
          >
            Evaluations
          </button>
          <button
            type="button"
            className="btn"
            value="Awards"
            onClick={() => handleChangeTab("Awards")}
          >
            Badge & Compétences
          </button>
          <button
            type="button"
            className="btn"
            value="Account"
            onClick={() => handleChangeTab("Account")}
          >
            Compte
          </button>
        </div>
        <Can object="profile" action="update">
          <SubmitButtonsSet withEditButton />
        </Can>
      </div>
      <Render />
      <Can object="profile" action="update">
        <SubmitButtonsSet />
      </Can>
    </div>
  );
};

export default Profile;
