import {
  PropsWithChildren,
  ReactNode,
  Suspense,
  useEffect,
  useState,
} from "react";
import Loader from "./loader";
import Sidebar from "./sidebar/sidebar";

type Props = {
  logoUrl: string;
  loader?: ReactNode;
  contentWidth?: string;
  sidebar?: ReactNode;
};

const AppLayout = ({
  logoUrl,
  children,
  loader = <Loader />,
  contentWidth = "80%",
  sidebar = <Sidebar />,
}: PropsWithChildren<Props>) => {
  const [logoExists, setExists] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!logoUrl) {
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
    img.src = logoUrl;
  }, [logoUrl]);

  return (
    <div className="flex flex-col gap-2">
      {(logoExists || loading) && logoUrl && (
        <img
          className="self-start max-h-[6vh] object-contain rounded-lg border-slate-700 border-1 p-0.5"
          src={logoUrl}
          alt="Company logo"
        />
      )}
      <div className="flex gap-2 h-[91vh]">
        {sidebar}
        <div className="overflow-scroll w-full">
          <Suspense fallback={loader}>
            <div className="flex justify-center">
              <div style={{ width: contentWidth }}>{children}</div>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
