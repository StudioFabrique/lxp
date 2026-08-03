import { sign } from "jsonwebtoken";

export type ImportedCourseArchive = {
  courseSlug: string;
  body: ReadableStream<Uint8Array> | null;
};

export default async function importCourseMbz(
  file: Express.Multer.File,
): Promise<ImportedCourseArchive> {
  const secret = process.env.DOCKER_IA_AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "Internal server error : Le secret JWT pour le docker IA n'est pas configuré",
    );
  }

  const formData = new FormData();
  formData.append(
    "file",
    new Blob([file.buffer], { type: file.mimetype }),
    file.originalname,
  );
  const token = sign(
    { sub: "student", userRoles: [{ role: "admin" }] },
    secret,
  );
  const baseUrl = process.env.DOCKER_IA_API_BASE_URL;
  const ingestResponse = await fetch(`${baseUrl}/ingest`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!ingestResponse.ok) {
    throw new Error(`Erreur API IA (/ingest): ${await ingestResponse.text()}`);
  }

  const data = (await ingestResponse.json()) as { course_slug: string };
  const zipResponse = await fetch(`${baseUrl}/export/${data.course_slug}.zip`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!zipResponse.ok) {
    throw new Error(
      `Impossible de récupérer le ZIP exporté pour le slug : ${data.course_slug}`,
    );
  }
  return { courseSlug: data.course_slug, body: zipResponse.body };
}
