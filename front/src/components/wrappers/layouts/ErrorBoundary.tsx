import { Component, ReactNode } from "react";
import { AppErrorPage } from "./RouterErrorBoundary";

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.error) {
      return <AppErrorPage error={this.state.error} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
