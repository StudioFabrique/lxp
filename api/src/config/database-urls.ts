type DatabaseEnvironment = NodeJS.ProcessEnv;

const encode = (value: string) => encodeURIComponent(value);

const buildPostgresUrl = (
  username: string,
  password: string,
  host: string,
  port: string,
  database: string,
) =>
  `postgresql://${encode(username)}:${encode(password)}@${host}:${port}/${encode(database)}`;

const buildMongoUrl = (
  username: string,
  password: string,
  host: string,
  port: string,
  database: string,
) =>
  `mongodb://${encode(username)}:${encode(password)}@${host}:${port}/${encode(database)}?authSource=admin`;

/**
 * Complète les URL attendues par Prisma et Mongoose à partir des seuls
 * identifiants présents dans le .env. Le code accepte encore une URL explicite
 * pour assurer la compatibilité avec les configurations existantes.
 */
export const ensureDatabaseUrls = (environment: DatabaseEnvironment) => {
  if (
    !environment.DATABASE_URL &&
    environment.POSTGRES_USER &&
    environment.POSTGRES_PASSWORD
  ) {
    environment.DATABASE_URL = buildPostgresUrl(
      environment.POSTGRES_USER,
      environment.POSTGRES_PASSWORD,
      environment.POSTGRES_HOST || "localhost",
      environment.POSTGRES_PORT || "5500",
      environment.POSTGRES_DB || "lxp",
    );
  }

  if (
    !environment.MONGO_LOCAL_URL &&
    environment.MONGO_ADMIN_USERNAME &&
    environment.MONGO_ADMIN_PASSWORD
  ) {
    environment.MONGO_LOCAL_URL = buildMongoUrl(
      environment.MONGO_ADMIN_USERNAME,
      environment.MONGO_ADMIN_PASSWORD,
      environment.MONGO_HOST || "localhost",
      environment.MONGO_PORT || "27000",
      environment.MONGO_DATABASE || "lxp",
    );
  }
};
