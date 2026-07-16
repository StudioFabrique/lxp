import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";

import { queryClient } from "./lib/react-query";
import { router } from "./App.router";

import { ThemeProvider } from "./store/ThemeProvider";
import { AuthProvider } from "./store/AuthProvider";
import ErrorBoundary from "./components/wrappers/layouts/ErrorBoundary";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <ErrorBoundary>
              <RouterProvider router={router} />
            </ErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
