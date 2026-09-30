import { describe, expect, it } from "vitest";
import { informationSchema } from "../../features/profile/schemas/info-schema";
import { passwordSchema } from "../../features/profile/schemas/password-schema";
import { loginSchema } from "../../features/auth/auth.schema";
import { gradingFormSchema } from "../../features/module-preview/assignment.schema";
import { videoSchema, imageSchema } from "../../features/lesson/media.schema";
import { documentsSchema } from "../../features/lesson/document.schema";
import { csvUsersSchema } from "../../features/user/csv-user.schema";
import { onboardingStepSchema } from "../../features/learning-profile/onboarding.schema";
import { dateRangeSchema } from "../../components/UI/dates-selecter/dates.schema";
import { activityVideoSize } from "../../config/images-sizes";

const user = { firstname: " Ada ", lastname: "Lovelace", email: " ada@example.fr " };
describe("validation des formulaires", () => {
  it("normalise les textes et refuse un champ facultatif invalide", () => {
    expect(informationSchema.parse(user)).toMatchObject({ firstname: "Ada", email: "ada@example.fr" });
    expect(informationSchema.safeParse({ ...user, firstname: "   " }).success).toBe(false);
    expect(informationSchema.safeParse({ ...user, postCode: "7500A" }).success).toBe(false);
    expect(informationSchema.safeParse({ ...user, phoneNumber: "+33 6 12 34 56 78" }).success).toBe(true);
  });
  it("conserve le mot de passe de connexion et vérifie la confirmation du nouveau", () => {
    expect(loginSchema.parse({ email: user.email, password: " ancien " }).password).toBe(" ancien ");
    const password = { oldPass: "legacy", newPass: "NewPassword!123", confirmNewPass: "NewPassword!123" };
    expect(passwordSchema.safeParse(password).success).toBe(true);
    expect(passwordSchema.safeParse({ ...password, confirmNewPass: "different" }).success).toBe(false);
  });
  it("borne la note libre et chaque critère au moment de l'envoi", () => {
    const values = { scores: {}, freeGrade: 21, feedback: "" };
    expect(gradingFormSchema(20, []).safeParse(values).success).toBe(false);
    expect(gradingFormSchema(20, []).safeParse({ ...values, freeGrade: -1 }).success).toBe(false);
    expect(gradingFormSchema(20, [{ id: 1, weight: 5 }]).safeParse({ ...values, scores: { "1": 6 } }).success).toBe(false);
  });
  it("refuse une vidéo trop grande même si elle contourne le composant de sélection", () => {
    const file = new File(["video"], "movie.mp4", { type: "video/mp4" });
    Object.defineProperty(file, "size", { value: activityVideoSize + 1 });
    expect(videoSchema.safeParse({ title: "Vidéo", description: "", origin: "file", url: "", file }).success).toBe(false);
    expect(videoSchema.safeParse({ title: "Vidéo", description: "", origin: "web", url: "javascript:alert(1)", file: null }).success).toBe(false);
    expect(imageSchema.safeParse({ title: "Image", description: "", file: null, selectedImage: null }).success).toBe(false);
  });
  it("refuse toute une liste de documents si un nom est vide ou un fichier est dupliqué", () => {
    const file = new File(["pdf"], "document.pdf", { type: "application/pdf" });
    const document = { name: "Document", file, hasError: false };
    expect(documentsSchema.safeParse({ files: [document, { ...document, name: "   " }] }).success).toBe(false);
    expect(documentsSchema.safeParse({ files: [document, document] }).success).toBe(false);
    expect(documentsSchema.safeParse({ files: [] }).success).toBe(false);
  });
  it("refuse les lignes CSV invalides et les dates impossibles", () => {
    expect(csvUsersSchema.safeParse({ users: [{ ...user, email: "invalid" }] }).success).toBe(false);
    expect(csvUsersSchema.safeParse({ users: [{ ...user, birthDate: "31/02/2000" }] }).success).toBe(false);
    expect(csvUsersSchema.parse({ users: [{ ...user, birthDate: "29/02/2000" }] }).users[0].birthDate?.getDate()).toBe(29);
    expect(dateRangeSchema.safeParse({ startDate: "2026-02-30", endDate: "2026-03-02" }).success).toBe(false);
  });
  it("valide seulement les réponses demandées à l'étape d'onboarding", () => {
    const draft = { pace: null, preferences: [], levels: {}, hobbies: [], links: [] };
    expect(onboardingStepSchema("theme").safeParse(draft).success).toBe(true);
    expect(onboardingStepSchema("learning").safeParse(draft).success).toBe(false);
    expect(onboardingStepSchema("module", 12).safeParse(draft).success).toBe(false);
    expect(onboardingStepSchema("module", 12).safeParse({ ...draft, levels: { "12": "beginner" } }).success).toBe(true);
  });
});
