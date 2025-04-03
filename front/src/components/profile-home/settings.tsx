import { useContext } from "react";
import { darkThemes, lightThemes } from "../../config/themes";
import Wrapper from "../UI/wrapper/wrapper.component";
import ThemeSelect from "./theme-select";
import { Context } from "../../store/context.store";
import Can from "../UI/can/can.component";
import CompanyPictureUpload from "./company-picture-upload";

export default function Settings() {
  const { chooseTheme } = useContext(Context);

  const handleChange = (newTheme: string, mode: string) => {
    chooseTheme(newTheme, mode);
  };

  return (
    <section className="w-full md:w-3/6 flex flex-col gap-y-4">
      <h2 className="text-lg font-semi-bold">Préférences</h2>
      <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="card-body flex flex-col gap-4 p-6 rounded-lg">
          <Wrapper>
            <ThemeSelect
              label="Thème clair"
              themesList={lightThemes}
              onThemeChange={handleChange}
            />
          </Wrapper>
          <Wrapper>
            <ThemeSelect
              label="Thème sombre"
              themesList={darkThemes}
              onThemeChange={handleChange}
            />
          </Wrapper>
        </div>
      </div>
      <Can action="component" object="company-picture-upload">
        <CompanyPictureUpload />
      </Can>
    </section>
  );
}
