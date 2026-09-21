import InstancePictureUpload from "../instance-picture-upload";
import ThemeSelect from "../theme-select";
import RoleRankGuard from "../../../../components/guards/RoleRankGuard";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import { useContext } from "react";
import { ThemeContext } from "../../../../store/ThemeProvider";

const ThemeSelectSettings = () => {
  const { chooseTheme, availableLightThemes, availableDarkThemes } = useContext(ThemeContext);

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
          <BoxWrapper>
            <ThemeSelect
              label="Thème clair"
              themesList={availableLightThemes}
              onThemeChange={handleThemeChange}
            />
          </BoxWrapper>
          <BoxWrapper>
            <ThemeSelect
              label="Thème sombre"
              themesList={availableDarkThemes}
              onThemeChange={handleThemeChange}
            />
          </BoxWrapper>
        </div>

        <div>
          <RoleRankGuard ranks={[0, 1]}>
      <InstancePictureUpload />
          </RoleRankGuard>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelectSettings;
