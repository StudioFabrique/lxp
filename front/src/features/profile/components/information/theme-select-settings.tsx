import CompanyPictureUpload from "../company-picture-upload";
import ThemeSelect from "../theme-select";
import RoleRankGuard from "../../../../components/guards/RoleRankGuard";
import Wrapper from "../../../../components/wrappers/BoxWrapper";
import { darkThemes, lightThemes } from "../../../../config/themes";
import { useContext } from "react";
import { ThemeContext } from "../../../../store/ThemeProvider";

const ThemeSelectSettings = () => {
  const { chooseTheme } = useContext(ThemeContext);

  const handleThemeChange = (
    newTheme: string,
    mode: "light" | "dark",
  ) => {
    chooseTheme(newTheme, mode);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg">
      <h2 className="text-lg font-semibold">Préférences</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="flex flex-col gap-2">
          <Wrapper>
            <ThemeSelect
              label="Thème clair"
              themesList={lightThemes}
              onThemeChange={handleThemeChange}
            />
          </Wrapper>
          <Wrapper>
            <ThemeSelect
              label="Thème sombre"
              themesList={darkThemes}
              onThemeChange={handleThemeChange}
            />
          </Wrapper>
        </div>

        <div>
          <RoleRankGuard ranks={[1]}>
            <CompanyPictureUpload />
          </RoleRankGuard>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelectSettings;
