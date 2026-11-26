import { jest } from "@jest/globals";

const sendUpdatedUserEmail = jest.fn<(...args: unknown[]) => Promise<void>>();
jest.unstable_mockModule("../../../services/mailer.ts", () => ({
  sendUpdatedUserEmail,
  sendPasswordChangedEmail: jest.fn(),
}));

const { notifyUserUpdated, NOTIFICATION_GROUPING_DELAY_MS } = await import(
  "../notify-user-updated.ts"
);

describe("regroupement des notifications de modification", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    sendUpdatedUserEmail.mockReset().mockResolvedValue(undefined);
  });
  afterEach(() => jest.useRealTimers());

  const base = { email: "a@b.fr", invitationSent: true, modifiedBy: "admin" as const };

  it("envoie un seul message pour des requêtes successives", () => {
    notifyUserUpdated({ ...base, changes: [{ label: "Nom", value: "x" }] });
    notifyUserUpdated({ ...base, changes: [{ label: "Rôle", value: "Admin" }] });
    jest.advanceTimersByTime(NOTIFICATION_GROUPING_DELAY_MS);

    expect(sendUpdatedUserEmail).toHaveBeenCalledTimes(1);
    expect(sendUpdatedUserEmail).toHaveBeenCalledWith(
      "a@b.fr",
      [
        { label: "Nom", value: "x" },
        { label: "Rôle", value: "Admin" },
      ],
      "admin",
    );
  });

  it("garde la dernière valeur d'un même champ", () => {
    notifyUserUpdated({ ...base, changes: [{ label: "Nom", value: "x" }] });
    notifyUserUpdated({ ...base, changes: [{ label: "Nom", value: "y" }] });
    jest.advanceTimersByTime(NOTIFICATION_GROUPING_DELAY_MS);

    expect(sendUpdatedUserEmail.mock.calls[0][1]).toEqual([
      { label: "Nom", value: "y" },
    ]);
  });

  it("ne mélange pas deux comptes", () => {
    notifyUserUpdated({ ...base, changes: [{ label: "Nom", value: "x" }] });
    notifyUserUpdated({
      ...base,
      email: "c@d.fr",
      changes: [{ label: "Nom", value: "z" }],
    });
    jest.advanceTimersByTime(NOTIFICATION_GROUPING_DELAY_MS);

    expect(sendUpdatedUserEmail).toHaveBeenCalledTimes(2);
  });

  it("n'envoie rien sans invitation ou sans modification", () => {
    notifyUserUpdated({
      ...base,
      invitationSent: false,
      changes: [{ label: "Nom", value: "x" }],
    });
    notifyUserUpdated({ ...base, changes: [] });
    jest.advanceTimersByTime(NOTIFICATION_GROUPING_DELAY_MS);

    expect(sendUpdatedUserEmail).not.toHaveBeenCalled();
  });
});
