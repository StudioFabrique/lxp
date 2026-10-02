import { useRouteError } from "react-router";
import { AppErrorPage } from "./AppErrorPage";

const RouterErrorBoundary = () => <AppErrorPage error={useRouteError()} />;

export default RouterErrorBoundary;
export { AppErrorPage } from "./AppErrorPage";
