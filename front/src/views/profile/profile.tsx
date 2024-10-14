import { MouseEvent, Ref, useEffect, useRef, useState } from "react";
import Information from "../../components/user-profile/information/information";
import Parcours from "../../components/user-profile/parcours";
import Awards from "../../components/user-profile/awards/awards";
import Account from "../../components/user-profile/account/account";
import Can from "../../components/UI/can/can.component";
import { useLocation } from "react-router-dom";
import Settings from "../../components/profile-home/settings";
import Calendrier from "../../components/user-profile/calendrier";

enum Tab {
  Info,
  Calendar,
  Evals,
  Awards,
  Account,
  Preferences,
}

const Profile = () => {
  const { state } = useLocation();

  const { pathname } = useLocation();

  const currentRoute = pathname.split("/").slice(1) ?? [];

  const [currentTab, setCurrentTab] = useState<Tab>(Tab.Info);

  const formRef: Ref<HTMLFormElement> = useRef(null);

  const tabsWithForms = [Tab.Info, Tab.Account].includes(currentTab);

  const buttonClassName = (tab: Tab) =>
    `btn ${currentTab === tab && "btn-secondary"}`;

  const Render = () => {
    switch (currentTab) {
      case Tab.Info:
        return (
          <Information
            formRef={formRef}
            style={{ showStudentElements: currentRoute[0] === "student" }}
          />
        );
      case Tab.Calendar:
        return <Calendrier />;
      case Tab.Evals:
        return <Parcours />;
      case Tab.Awards:
        return <Awards />;
      case Tab.Account:
        return <Account formRef={formRef} />;
      case Tab.Preferences:
        return <Settings />;
    }
  };

  const handleChangeTab = (event: MouseEvent<HTMLButtonElement>) => {
    const value: keyof typeof Tab = event.currentTarget
      .value as keyof typeof Tab;
    if (!(value in Tab)) return;
    const enumValue = Tab[value];
    setCurrentTab(enumValue);
  };

  useEffect(() => {
    if (state?.refreshId) {
      state?.tab && setCurrentTab(state?.tab ?? "Info");
    }
  }, [state?.refreshId, state?.tab, state?.editMode]);

  return (
    <div className="flex flex-col gap-5 p-10">
      <h2 className="font-bold text-xl">Mon profil</h2>
      <div className="flex flex-col xl:flex-row justify-between gap-5">
        <div className="flex flex-col lg:flex-row gap-5">
          <button
            type="button"
            className={buttonClassName(Tab.Info)}
            value="Info"
            onClick={handleChangeTab}
          >
            Information
          </button>
          {currentRoute[0] === "student" && (
            <>
              <Can object="parcours" action="read">
                <button
                  type="button"
                  className={buttonClassName(Tab.Calendar)}
                  value="Calendar"
                  onClick={handleChangeTab}
                >
                  Calendrier
                </button>
              </Can>
              <Can object="parcours" action="read">
                <button
                  type="button"
                  className={buttonClassName(Tab.Evals)}
                  value="Evals"
                  onClick={handleChangeTab}
                >
                  Parcours
                </button>
              </Can>
              <Can object="bonusSkill" action="read">
                <button
                  className={buttonClassName(Tab.Awards)}
                  value="Awards"
                  onClick={handleChangeTab}
                >
                  {"Badge & Compétences"}
                </button>
              </Can>
            </>
          )}
          <button
            type="button"
            className={buttonClassName(Tab.Account)}
            value="Account"
            onClick={handleChangeTab}
          >
            Compte
          </button>
          <button
            className={buttonClassName(Tab.Preferences)}
            value="Preferences"
            onClick={handleChangeTab}
          >
            Préférences
          </button>
        </div>
        {tabsWithForms && (
          <Can object="default" action="update">
            <button
              type="button"
              className="btn btn-sm justify-self-end"
              onClick={() => formRef.current?.requestSubmit()}
            >
              Soumettre les changements
            </button>
          </Can>
        )}
      </div>
      <Render />
      {tabsWithForms && (
        <div className="flex justify-end">
          <Can object="default" action="update">
            <button
              type="button"
              className="btn btn-sm justify-self-end"
              onClick={() => formRef.current?.requestSubmit()}
            >
              Soumettre les changements
            </button>
          </Can>
        </div>
      )}
    </div>
  );
};

export default Profile;
