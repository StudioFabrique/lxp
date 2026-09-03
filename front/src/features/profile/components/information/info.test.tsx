import { act, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useForm } from "react-hook-form";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AuthContext } from "../../../../store/AuthProvider";
import Info from "./info";

vi.mock(
  "../../../../components/UI/image-file-upload/image-file-upload",
  () => ({ default: () => <div /> }),
);

const TestInfo = () => {
  const {
    register,
    formState: { errors },
  } = useForm();
  const [temporaryAvatar, setTemporaryAvatar] = useState<{
    file: File | null;
    url: string | null;
  }>({ file: null, url: null });

  return (
    <AuthContext
      value={
        {
          user: {
            roles: [
              {
                _id: "role-id",
                role: "admin",
                label: "administrateur",
                rank: 1,
                protection: 2,
              },
            ],
          },
        } as never
      }
    >
      <Info
        formProps={{ register, errors }}
        temporaryAvatar={temporaryAvatar}
        setTemporaryAvatar={setTemporaryAvatar}
      />
    </AuthContext>
  );
};

describe("Info", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => root?.unmount());
    container.remove();
  });

  it("affiche le rôle actuel de l'utilisateur sans permettre sa modification", () => {
    act(() => {
      root = createRoot(container);
      root.render(<TestInfo />);
    });

    const roleInput = container.querySelector<HTMLInputElement>(
      "#current-role",
    );

    expect(roleInput?.value).toBe("administrateur");
    expect(roleInput?.disabled).toBe(true);
  });
});
