import { act, createContext } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import type Role from "../../../utils/interfaces/role";
import { useUserRoleOptions } from "./useUserRoleOptions";

vi.mock("../../../store/AuthProvider", () => ({
  AuthContext: createContext({ user: { roles: [{ rank: 1 }] } }),
}));

const roles: Role[] = [
  { _id: "admin", role: "admin", label: "Administrateur", rank: 1, protection: 2 },
  { _id: "teacher", role: "teacher", label: "Équipe pédagogique", rank: 2, protection: 2 },
  { _id: "student", role: "student", label: "Apprenant", rank: 3, protection: 2 },
  { _id: "custom-student", role: "custom-student", label: "Apprenant personnalisé", rank: 3, protection: 0 },
  { _id: "visitor", role: "visitor", label: "Visiteur", rank: 4, protection: 2 },
];

describe("useUserRoleOptions", () => {
  let root: Root;
  let container: HTMLDivElement;
  let queryClient: QueryClient;

  afterEach(() => {
    act(() => root?.unmount());
    container?.remove();
    queryClient?.clear();
  });

  const getRoles = (requiredRank?: number): Role[] => {
    let result: Role[] = [];
    const Probe = () => {
      result = useUserRoleOptions(requiredRank).roles;
      return null;
    };
    queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } });
    queryClient.setQueryData(["permission-roles"], { data: roles });
    container = document.createElement("div");
    act(() => {
      root = createRoot(container);
      root.render(<QueryClientProvider client={queryClient}><Probe /></QueryClientProvider>);
    });
    return result;
  };

  it("conserve uniquement les rôles de rang inférieur à celui de l'appelant", () => {
    expect(getRoles().map((role) => role._id)).toEqual(["teacher", "student", "custom-student", "visitor"]);
  });

  it("limite le contexte groupe aux modèles apprenants, y compris personnalisés", () => {
    expect(getRoles(3).map((role) => role._id)).toEqual(["student", "custom-student"]);
  });
});
