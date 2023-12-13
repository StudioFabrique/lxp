import { FC, useEffect, useState } from "react";
import Information from "../../components/user-profile/information/information";
import Calendar from "../../components/user-profile/calendar";
import Evaluations from "../../components/user-profile/evaluations";
import Awards from "../../components/user-profile/awards/awards";
import Account from "../../components/user-profile/account";
import User from "../../utils/interfaces/user";
import useHttp from "../../hooks/use-http";
import Loader from "../../components/UI/loader";
import EditIcon from "../../components/UI/svg/edit-icon";

type Tab = "Info" | "Calendar" | "Evals" | "Awards" | "Account";

const UserProfile = () => {
  const { sendRequest, isLoading } = useHttp(true);

  const { sendRequest: sendRequestInTab, isLoading: isLoadingInTab } =
    useHttp(true);

  const [currentTab, setCurrentTab] = useState<Tab>("Info");

  const [userData, setUserData] = useState<User>();

  const [editMode, setEditMode] = useState<boolean>(false);

  const [requestReady, setRequestReady] = useState<boolean>(false);

  const Render = () => {
    switch (currentTab) {
      case "Info":
        return (
          <Information
            userData={userData}
            editMode={editMode}
            requestReady={requestReady}
            setRequestReady={setRequestReady}
            sendRequestInTab={sendRequestInTab}
          />
        );
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
            onClick={() => setRequestReady(true)}
          >
            Soumettre les changements
          </button>
        )}
        {(withEditButton || editMode) && (
          <button
            type="button"
            className="btn btn-sm justify-self-end w-10 h-5 p-0"
            onClick={() => setEditMode((editMode) => !editMode)}
          >
            {editMode ? "annuler" : <EditIcon />}
          </button>
        )}
      </div>
    );

  useEffect(() => {
    console.log("requete init envoyé");

    const applyData = (data: { message: string; data: User }) => {
      setUserData(data.data);
    };

    sendRequest({ path: "/user/connected" }, applyData);
  }, [sendRequest]);

  useEffect(() => {
    setRequestReady(false);
  }, [currentTab]);

  return (
    <div className="flex flex-col gap-5 p-10">
      <h2 className="font-bold text-xl">Mon profil</h2>
      <div className="flex justify-between">
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
        <SubmitButtonsSet withEditButton />
      </div>
      {isLoading ? <Loader /> : <Render />}
      <SubmitButtonsSet />
    </div>
  );
};

export default UserProfile;
