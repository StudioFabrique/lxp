import { ReactNode, useContext, useState, useEffect } from "react";
import { Context } from "../../../store/context.store";
import { COMPANY_LOGO } from "../../../config/urls";
import SidebarBottom from "./sidebar-bottom";

const SidebarWrapper = ({
  children,
  interfaceType,
}: {
  children: ReactNode;
  interfaceType: string;
}) => {
  const { theme } = useContext(Context);
  const [companyLogo, setCompanyLogo] = useState<string | null>(COMPANY_LOGO);

  useEffect(() => {
    // Check if image exists
    const img = new Image();
    img.src = COMPANY_LOGO;

    img.onload = () => {
      setCompanyLogo(COMPANY_LOGO);
    };

    img.onerror = () => {
      setCompanyLogo(null);
    };
  }, []);

  return (
    <nav className="w-24 h-screen fixed p-4 pt-2 z-100 flex flex-col gap-2">
      {companyLogo ? (
        <div className="w-full bg-slate-100 rounded-lg">
          <img
            className="h-full w-full object-contain rounded-lg border-slate-700 border-2 p-1"
            src={companyLogo}
          />
        </div>
      ) : null}
      <div
        className={`flex flex-col justify-between gap-y-4 px-2 pb-4 pt-6 rounded-lg h-full relative ${
          theme === "dark"
            ? "text-white bg-slate-500"
            : "text-white bg-slate-800"
        }`}
      >
        {children}
        <SidebarBottom interfaceType={interfaceType} />
      </div>
    </nav>
  );
};

export default SidebarWrapper;
