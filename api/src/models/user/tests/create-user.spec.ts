import { jest } from "@jest/globals";

const findUser = jest.fn<() => Promise<null>>();
const findRole = jest.fn<() => Promise<{ rank: number; label: string } | null>>();
const createMongoUser = jest.fn<() => Promise<{ _id: string; email: string }>>();
const createStudent = jest.fn<() => Promise<unknown>>();
const createAdmin = jest.fn<() => Promise<unknown>>();
const createContact = jest.fn<() => Promise<unknown>>();

jest.unstable_mockModule("../../../utils/interfaces/db/user.ts", () => ({
  default: { findOne: findUser, create: createMongoUser },
}));
jest.unstable_mockModule("../../../utils/interfaces/db/role.ts", () => ({
  default: { findOne: findRole },
}));
jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: { orm: { public: {
    Student: { create: createStudent },
    Admin: { create: createAdmin },
    Contact: { create: createContact },
  } } },
}));
jest.unstable_mockModule("../../../helpers/activation-token.ts", () => ({ activationToken: jest.fn() }));
jest.unstable_mockModule("../../../services/mailer.ts", () => ({ sendPasswordEmail: jest.fn() }));
jest.unstable_mockModule("../../../config/mailer-disabled.ts", () => ({ mailerDisabled: true }));
jest.unstable_mockModule("../../../config/dev-account-password.ts", () => ({
  devAccountPasswordHash: async () => "test-password-hash",
}));

const { default: createUser } = await import("../create-user.ts");
const user = {
  email: "student@example.com", firstname: "Marie", lastname: "Martin", invitationSent: false,
};

describe("création d'un utilisateur depuis un groupe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    findUser.mockResolvedValue(null);
    createMongoUser.mockResolvedValue({ _id: "new-user", email: user.email });
  });

  it.each([1, 2, 4])("rejette le rang %i avant toute écriture", async (rank) => {
    findRole.mockResolvedValue({ rank, label: "Autre rôle" });
    await expect(createUser(user, "role-id", 0, { studentOnly: true })).rejects.toMatchObject({ statusCode: 400 });
    expect(createMongoUser).not.toHaveBeenCalled();
    expect(createStudent).not.toHaveBeenCalled();
    expect(createAdmin).not.toHaveBeenCalled();
    expect(createContact).not.toHaveBeenCalled();
  });

  it("crée un apprenant et sa référence SQL", async () => {
    findRole.mockResolvedValue({ rank: 3, label: "Apprenant personnalisé" });
    await expect(createUser(user, "role-id", 1, { studentOnly: true })).resolves.toMatchObject({ role: 3 });
    expect(createMongoUser).toHaveBeenCalledTimes(1);
    expect(createStudent).toHaveBeenCalledWith({ idMdb: "new-user" });
    expect(createAdmin).not.toHaveBeenCalled();
  });

  it("préserve la création générale d'un membre de l'équipe pédagogique", async () => {
    findRole.mockResolvedValue({ rank: 2, label: "Équipe pédagogique" });
    await expect(createUser(user, "role-id", 1)).resolves.toMatchObject({ role: 2 });
    expect(createAdmin).toHaveBeenCalledTimes(1);
    expect(createContact).toHaveBeenCalledTimes(1);
  });

  it("préserve le contrôle du rang de l'appelant et des références invalides", async () => {
    findRole.mockResolvedValue({ rank: 3, label: "Apprenant" });
    await expect(createUser(user, "role-id", 3, { studentOnly: true })).rejects.toMatchObject({ statusCode: 403 });
    findRole.mockResolvedValue(null);
    await expect(createUser(user, "missing-role", 1, { studentOnly: true })).rejects.toMatchObject({ statusCode: 404 });
    expect(createMongoUser).not.toHaveBeenCalled();
  });
});
