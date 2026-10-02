import Header from "../../../components/headers/Header";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import { ReadCalendarBrowser } from "./ReadCalendarBrowser";

export default function CalendarHome() {
  return (
    <PageWrapper>
      <Header
        title="Calendrier"
        description="Consultez les cours, les devoirs et les modules d’un parcours."
      />
      <ReadCalendarBrowser />
    </PageWrapper>
  );
}

export { ReadCalendarBrowser } from "./ReadCalendarBrowser";
