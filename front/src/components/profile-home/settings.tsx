import { useContext } from "react";
import { darkThemes, lightThemes } from "../../config/themes";
import Wrapper from "../UI/wrapper/wrapper.component";
import { Context } from "../../store/context.store";
import ThemeSelect from "./theme-select";

export default function Settings() {
  const { chooseTheme } = useContext(Context);

  const handleChange = (newTheme: string, mode: string) => {
    chooseTheme(newTheme, mode);
  };

  return (
    <section className="flex flex-col gap-y-4">
      <h2 className="text-lg font-semi-bold">Préférences</h2>
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
    </section>
  );
}
