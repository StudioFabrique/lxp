import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";

import { queryClient } from "../lib/react-query";
import { router } from "./router";

import { ThemeProvider } from "../store/ThemeProvider";
import { AuthProvider } from "../store/AuthProvider";
import { DemoProvider } from "../store/DemoProvider";
import ErrorBoundary from "../components/wrappers/layouts/ErrorBoundary";
import { Toaster } from "react-hot-toast";
import { AbilityProvider } from "../rbac/AbilityProvider";
import { VisualPreferencesProvider } from "../store/VisualPreferences";
import NavigationFeedback from "../components/navigation/NavigationFeedback";

function App() {
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      document.getElementById("boot-skeleton")?.remove();
      document.getElementById("boot-auth-skeleton")?.remove();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
            border: "1px solid var(--color-base-300)",
            borderRadius: "var(--radius-box)",
            padding: "12px 16px",
            maxWidth: "min(32rem, calc(100vw - 2rem))",
          },
          success: {
            iconTheme: {
              primary: "var(--color-success)",
              secondary: "var(--color-success-content)",
            },
          },
          error: {
            iconTheme: {
              primary: "var(--color-error)",
              secondary: "var(--color-error-content)",
            },
          },
        }}
      />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <VisualPreferencesProvider>
            <DemoProvider>
              <AuthProvider>
                <AbilityProvider>
                  <ErrorBoundary>
                    <NavigationFeedback router={router} />
                    <RouterProvider router={router} />
                  </ErrorBoundary>
                </AbilityProvider>
              </AuthProvider>
            </DemoProvider>
          </VisualPreferencesProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
