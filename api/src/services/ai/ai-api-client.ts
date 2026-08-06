import jwt from "jsonwebtoken";
import { Readable } from "stream";

const DEFAULT_AI_API_URL = "http://localhost:8000";

export class AiConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiConfigurationError";
  }
}

export class AiApiError extends Error {
  readonly status: number;
  readonly responseBody: unknown;

  constructor(
    status: number,
    responseBody: unknown,
    message: string,
  ) {
    super(message);
    this.name = "AiApiError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

type RequestOptions = {
  subject: string;
  body: unknown;
  accept: "application/json" | "text/event-stream";
};

/**
 * Point d'entrée unique vers le service IA.
 *
 * La résolution de la configuration, l'authentification et la traduction des
 * erreurs HTTP restent ainsi hors des contrôleurs métier.
 */
export class AiApiClient {
  private readonly baseUrl: string;
  private readonly authSecret: string | undefined;

  constructor(
    baseUrl = process.env.DOCKER_IA_API_BASE_URL || DEFAULT_AI_API_URL,
    authSecret = process.env.DOCKER_IA_AUTH_SECRET,
  ) {
    this.baseUrl = baseUrl;
    this.authSecret = authSecret;
  }

  async postJson<T>(
    path: string,
    options: Omit<RequestOptions, "accept">,
  ): Promise<T> {
    const response = await this.post(path, {
      ...options,
      accept: "application/json",
    });
    const responseBody = (await response.json()) as T;

    if (!response.ok) {
      throw new AiApiError(
        response.status,
        responseBody,
        `Erreur API IA: ${response.statusText}`,
      );
    }

    return responseBody;
  }

  async postStream(
    path: string,
    options: Omit<RequestOptions, "accept"> & {
      accept: RequestOptions["accept"];
    },
  ): Promise<Readable> {
    const response = await this.post(path, options);

    if (!response.ok) {
      const responseBody = await this.readErrorBody(response);
      throw new AiApiError(
        response.status,
        responseBody,
        `Erreur API IA: ${response.statusText}`,
      );
    }

    if (!response.body) {
      throw new AiApiError(
        502,
        null,
        "Le service IA n'a retourné aucun flux.",
      );
    }

    return Readable.fromWeb(response.body);
  }

  private async post(path: string, options: RequestOptions) {
    if (!this.authSecret) {
      throw new AiConfigurationError(
        "Le secret JWT pour le service IA n'est pas configuré.",
      );
    }

    const token = jwt.sign(
      {
        sub: options.subject,
        userRoles: [{ role: "admin" }],
      },
      this.authSecret,
    );

    return fetch(this.resolveUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: options.accept,
      },
      body: JSON.stringify(options.body),
    });
  }

  private resolveUrl(path: string) {
    return `${this.baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  }

  private async readErrorBody(response: globalThis.Response) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return response.json();
    }

    return response.text();
  }
}

export const aiApiClient = new AiApiClient();
