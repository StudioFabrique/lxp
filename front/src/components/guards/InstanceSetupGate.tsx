import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { profileApi } from "../../features/profile/api/profile.api";
import { AuthContext } from "../../store/AuthProvider";
import Loader from "../loaders/Loader";

/** Sends only the root account through the one-time instance setup. */
export default function InstanceSetupGate() {
  const { user } = useContext(AuthContext);
  const isRoot = user?.roles?.[0]?.rank === 0;
  const [setupCompleted, setSetupCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    if (!isRoot) return;

    profileApi.queries
      .getInstanceSettings()
      .then((settings) => {
        if (active) setSetupCompleted(settings.setupCompleted);
      })
      // Do not lock the whole administration area during a transient error.
      .catch(() => {
        if (active) setSetupCompleted(true);
      });

    return () => {
      active = false;
    };
  }, [isRoot]);

  if (!isRoot) return <Outlet />;
  if (setupCompleted === null) return <Loader />;
  if (!setupCompleted) return <Navigate replace to="/instance-setup" />;
  return <Outlet />;
}
