import axios from "axios";
import toast from "react-hot-toast";
import { BASE_API_URL } from "../config/urls";

const apiClient = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

let logoutHandler: (() => void) | null = null;
let demoMode = false;
let abilityResyncHandler: ((user: unknown) => void) | null = null;
let refreshPromise: Promise<void> | null = null;
let resyncPromise: Promise<void> | null = null;

export const injectLogout = (handler: () => void) => {
  logoutHandler = handler;
};

export const injectAbilityResync = (handler: (user: unknown) => void) => {
  abilityResyncHandler = handler;
};

/**
 * Signale que l'instance tourne en démonstration.
 *
 * Posé par `DemoProvider`, qui lit la configuration au démarrage : le mode ne
 * peut pas être connu à la construction du bundle, l'image Docker étant
 * partagée par toutes les instances.
 */
export const setDemoMode = (value: boolean) => {
  demoMode = value;
};

/** Code renvoyé par l'API quand elle refuse une écriture en démonstration. */
export const DEMO_READ_ONLY_CODE = "DEMO_READ_ONLY";

const READ_METHODS = new Set(["get", "head", "options"]);

/**
 * Écritures tolérées en démonstration : l'ouverture de session, et les deux
 * lectures que l'API sert en POST. Doit rester aligné sur
 * `api/src/config/demo-read-only-allowlist.ts`.
 */
const DEMO_ALLOWED_WRITES = [/^\/?demo\/session\/?$/, /^\/?user\/group\/?$/];

/**
 * Écritures refusées sans notification.
 *
 * L'ouverture du suivi de consultation et ses battements partent d'eux-mêmes :
 * le premier à l'affichage d'une leçon, les suivants toutes les trente
 * secondes tant qu'elle reste ouverte. Prévenir l'apprenant qu'il vient d'être
 * bloqué n'a aucun sens, il n'a rien demandé — et la notification
 * réapparaîtrait à chaque battement. La requête est arrêtée comme les autres,
 * mais en silence : les appelants absorbent déjà l'échec, le suivi n'étant pas
 * une fonctionnalité dont dépend la lecture.
 *
 * La clôture (`finish`) n'est pas de la partie : elle vient d'un clic sur
 * « Terminer la leçon », qui mérite sa notification.
 */
const DEMO_SILENT_WRITES = [
  /^\/?content-read\/[^/]+\/\d+\/(begin|heartbeat)\/?$/,
];

/** Chemin seul : sans hôte ni chaîne de requête, pour comparer aux motifs. */
const toPath = (url: string) =>
  url.split("?")[0].replace(/^https?:\/\/[^/]+/, "");

const isDemoAllowedWrite = (path: string) =>
  DEMO_ALLOWED_WRITES.some((pattern) => pattern.test(path));

const isDemoSilentWrite = (path: string) =>
  DEMO_SILENT_WRITES.some((pattern) => pattern.test(path));

/**
 * Dernier rempart côté client.
 *
 * Les enveloppes visuelles neutralisent les boutons, mais pas tout : un
 * réordonnancement par glisser-déposer, une sauvegarde automatique ou un dépôt
 * d'image depuis l'éditeur partent sans qu'on ait cliqué sur quoi que ce soit.
 * La requête est donc arrêtée avant l'envoi, ce qui évite au passage un
 * aller-retour inutile vers l'API.
 */
apiClient.interceptors.request.use((request) => {
  if (!demoMode) return request;

  const method = (request.method ?? "get").toLowerCase();
  if (READ_METHODS.has(method)) return request;

  const path = toPath(String(request.url ?? ""));
  if (isDemoAllowedWrite(path)) return request;

  // Un identifiant fixe : une page qui enchaîne plusieurs requêtes bloquées
  // n'empile pas les notifications.
  if (!isDemoSilentWrite(path)) {
    toast("Indisponible en mode démo", { id: "demo-read-only" });
  }

  return Promise.reject(
    Object.assign(new Error("Indisponible en mode démo"), {
      config: request,
      isDemoReadOnly: true,
    }),
  );
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const status = error.response?.status;
    const url = String(request?.url || "");
    const isRefresh = url.includes("/auth/refresh");
    const isLogin = url.includes("/auth/login");

    if (status === 401 && isRefresh) {
      logoutHandler?.();
      return Promise.reject(error);
    }

    if (status === 401 && !isLogin && !request?._retry) {
      request._retry = true;
      refreshPromise ??= axios
        .get(`${BASE_API_URL}/auth/refresh`, { withCredentials: true })
        .then(() => undefined)
        .finally(() => {
          refreshPromise = null;
        });

      try {
        await refreshPromise;
        return apiClient(request);
      } catch (refreshError) {
        logoutHandler?.();
        return Promise.reject(refreshError);
      }
    }

    // Un refus dû à la démonstration n'est pas une désynchronisation de droits :
    // relancer un handshake à chaque écriture bloquée n'apprendrait rien.
    if (error.response?.data?.code === DEMO_READ_ONLY_CODE) {
      if (!isDemoSilentWrite(toPath(url))) {
        toast("Indisponible en mode démo", { id: "demo-read-only" });
      }
      return Promise.reject(error);
    }

    if (status === 403 && !isLogin && !url.includes("/auth/handshake")) {
      resyncPromise ??= axios
        .get(`${BASE_API_URL}/auth/handshake`, { withCredentials: true })
        .then((response) => {
          abilityResyncHandler?.(response.data);
        })
        .catch(() => undefined)
        .finally(() => {
          resyncPromise = null;
        });
      await resyncPromise;
    }

    return Promise.reject(error);
  },
);

export default apiClient;
