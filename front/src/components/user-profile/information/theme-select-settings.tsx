import CompanyPictureUpload from "../../../components/profile-home/company-picture-upload";
import ThemeSelect from "../../../components/profile-home/theme-select";
import PermissionGuard from "../../guards/PermissionGuard";
import Wrapper from "../../wrappers/BoxWrapper";
import { darkThemes, lightThemes } from "../../../config/themes";
import { useContext } from "react";
import { ThemeContext } from "../../../store/ThemeProvider";

const ThemeSelectSettings = () => {
  const { chooseTheme } = useContext(ThemeContext);

  const handleThemeChange = (newTheme: string, mode: string) => {
    chooseTheme(newTheme, mode);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg">
      <h2 className="text-lg font-semibold">Préférences</h2>

      <div className="grid grid-cols-2 gap-10">
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
          <PermissionGuard action="component" object="company-picture-upload">
            <CompanyPictureUpload />
          </PermissionGuard>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelectSettings;
