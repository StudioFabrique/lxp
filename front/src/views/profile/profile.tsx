import { MouseEvent, Ref, useEffect, useRef, useState } from "react";
import InformationAndSettings from "../../components/user-profile/information/information-and-settings";
import Awards from "../../components/user-profile/awards/awards";
import Account from "../../components/user-profile/account/account";
import Can from "../../components/UI/can/can.component";
import { useLocation } from "react-router-dom";
import Calendrier from "../../components/user-profile/calendrier";
import ViewWrapper from "../../components/UI/wrapper/view-wrapper";
import Header from "../../components/UI/header";
import Journal from "../../components/user-profile/journal/journal";

enum Tab {
  Info,
  Calendar,
  Journal,
  Awards,
  Account,
}

const Profile = () => {
  const { state } = useLocation();
  const { pathname } = useLocation();
  const currentRoute = pathname.split("/").slice(1) ?? [];

  const [currentTab, setCurrentTab] = useState<Tab>(Tab.Info);
  const formRef: Ref<HTMLFormElement> = useRef(null);

  const tabsWithForms = [Tab.Info, Tab.Account].includes(currentTab);

  const handleChangeTab = (event: MouseEvent<HTMLAnchorElement>) => {
    const value = event.currentTarget.getAttribute(
      "data-value"
    ) as keyof typeof Tab;
    if (!(value in Tab)) return;
    setCurrentTab(Tab[value]);
  };

  const RenderTab = () => {
    switch (currentTab) {
      case Tab.Info:
        return (
          <InformationAndSettings
            formRef={formRef}
            style={{ showStudentElements: currentRoute[0] === "student" }}
          />
        );
      case Tab.Calendar:
        return <Calendrier />;
      case Tab.Journal:
        return <Journal />;
      case Tab.Awards:
        return <Awards />;
      case Tab.Account:
        return <Account formRef={formRef} />;
    }
  };

  useEffect(() => {
    if (state?.refreshId) {
      state?.tab && setCurrentTab(state?.tab ?? Tab.Info);
    }
  }, [state?.refreshId, state?.tab, state?.editMode]);

  return (
    <ViewWrapper className="flex flex-col gap-6">
      <Header title="Mon profil" />

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-lift flex-wrap">
        <a
          role="tab"
          className={`tab ${currentTab === Tab.Info ? "tab-active" : ""}`}
          data-value="Info"
          onClick={handleChangeTab}
        >
          Informations
        </a>

        <Can action="component" object="calendar">
          <a
            role="tab"
            className={`tab ${currentTab === Tab.Calendar ? "tab-active" : ""}`}
            data-value="Calendar"
            onClick={handleChangeTab}
          >
            Calendrier
          </a>
        </Can>

        {currentRoute[0] === "student" && (
          <>
            <Can object="parcours" action="read">
              <a
                role="tab"
                className={`tab ${
                  currentTab === Tab.Journal ? "tab-active" : ""
                }`}
                data-value="Journal"
                onClick={handleChangeTab}
              >
                Journal
              </a>
            </Can>

            <Can object="bonusSkill" action="read">
              <a
                role="tab"
                className={`tab ${
                  currentTab === Tab.Awards ? "tab-active" : ""
                }`}
                data-value="Awards"
                onClick={handleChangeTab}
              >
                Badge & Compétences
              </a>
            </Can>
          </>
        )}

        <a
          role="tab"
          className={`tab ${currentTab === Tab.Account ? "tab-active" : ""}`}
          data-value="Account"
          onClick={handleChangeTab}
        >
          Compte
        </a>
      </div>

      {/* Contenu du tab selectionné */}
      <div className="mt-4">
        <RenderTab />
      </div>

      {/* Bouton de soumission */}
      {tabsWithForms && (
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="btn btn-sm btn-primary text-base-100"
            onClick={() => formRef.current?.requestSubmit()}
          >
            Sauvegarder
          </button>
        </div>
      )}
    </ViewWrapper>
  );
};

export default Profile;
