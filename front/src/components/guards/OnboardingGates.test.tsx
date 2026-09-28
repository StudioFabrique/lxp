import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "../../store/AuthProvider";
import { DEFAULT_DEMO_CONFIG, DemoContext } from "../../store/DemoContext";
import { learningProfileApi } from "../../features/learning-profile/learning-profile.api";
import { staffOnboardingApi } from "../../features/auth/api/staff-onboarding.api";
import { dashboardIAApi } from "../../features/dashboard-ia/api/dashboardIA.api";
import StudentOnboardingGate from "./StudentOnboardingGate";
import StaffOnboardingGate from "./StaffOnboardingGate";

vi.mock("../../features/learning-profile/learning-profile.api", () => ({
  learningProfileKey: ["learning-profile"],
  learningProfileApi: { get: vi.fn() },
}));
vi.mock("../../features/auth/api/staff-onboarding.api", () => ({
  staffOnboardingApi: { get: vi.fn() },
}));
vi.mock("../../features/dashboard-ia/api/dashboardIA.api", () => ({
  dashboardIAApi: { queries: { getDropoutPreferences: vi.fn() } },
}));

const getLearningContext = vi.mocked(learningProfileApi.get);
const getStaffStatus = vi.mocked(staffOnboardingApi.get);
const getTeacherStatus = vi.mocked(dashboardIAApi.queries.getDropoutPreferences);

describe("onboarding gates before the application layouts", () => {
  let container: HTMLDivElement;
  let root: Root;
  let queryClient: QueryClient;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    getLearningContext.mockReset();
    getStaffStatus.mockReset();
    getTeacherStatus.mockReset();
  });

  afterEach(() => {
    act(() => root.unmount());
    queryClient.clear();
    container.remove();
  });

  const renderGate = async (kind: "student" | "staff", rank: number, demoMode = false) => {
    const Gate = kind === "student" ? StudentOnboardingGate : StaffOnboardingGate;
    const path = kind === "student" ? "/student/dashboard" : "/admin/dashboard";
    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <AuthContext value={{ isAppInitialized: true, isLoggedIn: true, user: { roles: [{ rank }] } } as never}>
            <DemoContext value={{ ...DEFAULT_DEMO_CONFIG, demoMode, isConfigLoaded: true }}>
              <MemoryRouter initialEntries={[path]}>
                <Routes>
                  <Route element={<Gate />}>
                    <Route path={path} element={<p>layout-avec-sidebar</p>} />
                  </Route>
                  <Route path="/student/onboarding" element={<p>onboarding-apprenant</p>} />
                  <Route path="/staff/onboarding" element={<p>onboarding-personnel</p>} />
                </Routes>
              </MemoryRouter>
            </DemoContext>
          </AuthContext>
        </QueryClientProvider>,
      );
    });
  };

  it("attend la décision apprenant avant de monter la sidebar puis redirige", async () => {
    let resolve!: (value: Awaited<ReturnType<typeof learningProfileApi.get>>) => void;
    getLearningContext.mockReturnValue(new Promise((done) => { resolve = done; }));
    await renderGate("student", 3);
    expect(container.textContent).not.toContain("layout-avec-sidebar");

    await act(async () => resolve({ onboardingRequired: true, shouldAutoRedirect: true } as never));
    await vi.waitFor(() => expect(container.textContent).toContain("onboarding-apprenant"));
    expect(container.textContent).not.toContain("layout-avec-sidebar");
  });

  it("laisse passer un questionnaire déjà commencé", async () => {
    getLearningContext.mockResolvedValue({ onboardingRequired: true, shouldAutoRedirect: false } as never);
    await renderGate("student", 3);
    await vi.waitFor(() => expect(container.textContent).toContain("layout-avec-sidebar"));
  });

  it("laisse passer l'apprenant de démonstration sans requête", async () => {
    await renderGate("student", 3, true);
    expect(container.textContent).toContain("layout-avec-sidebar");
    expect(getLearningContext).not.toHaveBeenCalled();
  });

  it.each([
    [1, getStaffStatus, "required"],
    [2, getTeacherStatus, "onboardingRequired"],
  ] as const)("attend la décision du personnel de rang %i avant la sidebar", async (rank, getStatus, flag) => {
    let resolve!: (value: never) => void;
    getStatus.mockReturnValue(new Promise((done) => { resolve = done; }) as never);
    await renderGate("staff", rank);
    expect(container.textContent).not.toContain("layout-avec-sidebar");

    await act(async () => resolve({ [flag]: true } as never));
    await vi.waitFor(() => expect(container.textContent).toContain("onboarding-personnel"));
    expect(container.textContent).not.toContain("layout-avec-sidebar");
  });

  it("monte le layout du personnel après un accueil terminé", async () => {
    getStaffStatus.mockResolvedValue({ required: false } as never);
    await renderGate("staff", 1);
    await vi.waitFor(() => expect(container.textContent).toContain("layout-avec-sidebar"));
  });
});
