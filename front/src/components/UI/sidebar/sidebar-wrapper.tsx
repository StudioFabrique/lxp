import { ReactNode, useContext, useEffect, useState } from "react";
import { Context } from "../../../store/context.store";
import SidebarBottom from "./sidebar-bottom";
import { COMPANY_LOGO, COMPANY_LOGO_COLOR } from "../../../config/urls";

const SidebarWrapper = ({
  children,
  interfaceType,
}: {
  children: ReactNode;
  interfaceType: string;
}) => {
  const { theme } = useContext(Context);

  const [logoExists, setExists] = useState(true);
  const [loading, setLoading] = useState(true);

  const [logoBgColor, setBgColor] = useState<string>();

  const showLogo = (logoExists || loading) && COMPANY_LOGO;

  useEffect(() => {
    if (!COMPANY_LOGO) {
      setExists(false);
      setLoading(false);
      return;
    }

    if (!COMPANY_LOGO_COLOR) {
      setExists(false);
      setLoading(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setExists(true);
      setLoading(false);
    };
    img.onerror = () => {
      setExists(false);
      setLoading(false);
    };
    img.src = COMPANY_LOGO;

    fetch(COMPANY_LOGO_COLOR).then(async (response) =>
      setBgColor(await response.text())
    );
  }, []);

  return (
    <nav
      className={`h-full xl:w-[20rem] max-sm:w-[10rem] flex flex-col justify-between gap-y-4 px-2 py-4 rounded-xl gap-2 ${
        theme === "dark" ? "text-white bg-slate-500" : "text-white bg-slate-800"
      }`}
    >
      <div>
        {showLogo && (
          <img
            className="self-start h-[50px] w-[50px] rounded-full border-slate-700 border-1 object-contain p-1 m-2 mb-3 bg-white"
            src={COMPANY_LOGO}
            style={{ backgroundColor: logoBgColor }}
            alt="Company logo"
          />
        )}
        {children}
      </div>
      <SidebarBottom interfaceType={interfaceType} />
    </nav>
  );
};

export default SidebarWrapper;
