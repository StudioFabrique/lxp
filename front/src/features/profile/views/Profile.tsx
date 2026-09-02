import { MouseEvent, Ref, useEffect, useRef, useState } from "react";
import InformationAndSettings from "../components/information/information-and-settings";
import Awards from "../components/awards/awards";
import Account from "../components/account/account";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import { useLocation } from "react-router";
import Header from "../../../components/headers/Header";
import Journal from "../components/journal/journal";
import TeacherCalendar from "../components/teacher-calendar";

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
      "data-value",
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
        return <TeacherCalendar />;
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
      if (state?.tab) setCurrentTab(state.tab);
    }
  }, [state?.refreshId, state?.tab, state?.editMode]);

  return (
    <div className="w-full flex flex-col gap-6">
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

        <a
          role="tab"
          className={`tab ${currentTab === Tab.Calendar ? "tab-active" : ""}`}
          data-value="Calendar"
          onClick={handleChangeTab}
        >
          Calendrier
        </a>

        {currentRoute[0] === "student" && (
          <>
            <PermissionGuard object="parcours" action="read">
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
            </PermissionGuard>

            <PermissionGuard object="bonusSkill" action="read">
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
            </PermissionGuard>
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
    </div>
  );
};

export default Profile;
