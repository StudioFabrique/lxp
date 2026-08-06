# Déploiement Jenkins avec Caddy et le challenge DNS OVH

Cette méthode déploie la même stack applicative que le mode direct situé dans
`deployment/direct`, mais elle ne publie pas directement le conteneur `app` sur
le port 80. Caddy reçoit les connexions HTTP et HTTPS, obtient un certificat
pour le domaine exact de l'instance au moyen du challenge DNS-01 OVH, puis
transmet les requêtes à `app` sur le réseau Docker.

Elle utilise les fichiers suivants :

- [`deployment/caddy/Jenkinsfile`](../deployment/caddy/Jenkinsfile) ;
- [`deployment/caddy/compose.yml`](../deployment/caddy/compose.yml) ;
- [`deployment/caddy/Dockerfile`](../deployment/caddy/Dockerfile) ;
- [`deployment/caddy/Caddyfile`](../deployment/caddy/Caddyfile).

Le déploiement HTTP direct reste disponible avec
[`deployment/direct/Jenkinsfile`](../deployment/direct/Jenkinsfile) et
[`deployment/direct/compose.yml`](../deployment/direct/compose.yml).

## 1. Préparer le DNS et le VPS

Créer un enregistrement `A` pour le domaine exact de l'instance vers son IP
publique. Pour la première instance Caddy :

```text
testcaddy.lxp.andria.ovh  A  <IP_PUBLIQUE_DU_VPS>
```

Le domaine fourni à Caddy ne contient ni protocole, ni chemin, ni wildcard. Le
pipeline refusera par exemple `https://testcaddy.lxp.andria.ovh` et
`*.lxp.andria.ovh`.

Autoriser vers le VPS :

- TCP 80 pour la redirection HTTP vers HTTPS ;
- TCP 443 pour HTTPS ;
- UDP 443 pour HTTP/3, si le réseau Proxmox et le pare-feu l'autorisent.

Le compte de déploiement et l'agent Jenkins ont les mêmes prérequis que pour le
déploiement historique. La construction de Caddy nécessite aussi un accès
Internet sortant depuis le moteur Docker distant afin que `xcaddy` télécharge le
module `github.com/caddy-dns/ovh`.

## 2. Configurer les credentials Jenkins

Conserver les credentials du déploiement historique et ajouter les credentials
de type **Secret text** suivants dans le dossier Jenkins de l'environnement :

| ID Jenkins              | Exemple ou contenu                         |
| ----------------------- | ------------------------------------------ |
| `APP_DOMAIN`            | `testcaddy.lxp.andria.ovh`                 |
| `OVH_ENDPOINT`          | `ovh-eu`                                   |
| `OVH_APPLICATION_KEY`   | Application Key OVH                        |
| `OVH_APPLICATION_SECRET`| Application Secret OVH                     |
| `OVH_CONSUMER_KEY`      | Consumer Key OVH                           |

`APP_DOMAIN` reste volontairement séparé du fichier secret `APP_ENV`. Les
identifiants OVH ne doivent pas être ajoutés au dépôt ni au fichier applicatif.
Jenkins les injecte uniquement pendant l'exécution du Compose Caddy.

Le Consumer Key OVH doit permettre au module de lire, créer, modifier et
supprimer les enregistrements DNS nécessaires, puis de rafraîchir la zone. Il
est préférable de limiter ces droits à `andria.ovh`.

## 3. Adapter `APP_ENV`

Le format du fichier reste identique au déploiement historique. Pour l'instance
de test, ses URL publiques doivent utiliser le domaine HTTPS :

```dotenv
FRONT_URL=https://testcaddy.lxp.andria.ovh/
LXP_PUBLIC_BASE=https://testcaddy.lxp.andria.ovh
PORT=3000
```

Ne pas ajouter `APP_DOMAIN` ni les clés OVH dans ce fichier.

## 4. Créer le job Jenkins

Dans le dossier Jenkins de l'environnement :

1. créer un job de type **Pipeline** ;
2. sélectionner **Pipeline script from SCM** ;
3. configurer le même dépôt, la même branche et le même credential Git que le
   job historique ;
4. utiliser `deployment/caddy/Jenkinsfile` comme **Script Path** ;
5. enregistrer et lancer le job.

Le pipeline :

1. configure Docker à distance par SSH et synchronise les uploads ;
2. copie `APP_ENV` localement sans y ajouter `APP_DOMAIN` ;
3. récupère les images LXP, IA et bases de données ;
4. construit Caddy 2.11.4 avec le module DNS OVH 1.1.0 ;
5. vérifie la présence du module et valide le Caddyfile ;
6. démarre les bases, exécute les migrations et provisionne l'IA ;
7. démarre `app` et `ai`, puis Caddy ;
8. affiche l'état de la stack et les derniers logs Caddy.

## 5. Vérifier l'émission du certificat

Les derniers logs Caddy affichés par Jenkins doivent montrer la création du
challenge DNS puis l'obtention du certificat. Vérifier ensuite :

```bash
curl -I https://testcaddy.lxp.andria.ovh/login
```

Sur le VPS, les services attendus sont `app`, `ai`, `db-pg`, `db-ai`,
`db-mongo` et `caddy` :

```bash
docker compose -p lxp ps
docker logs --tail=200 lxp-caddy-1
```

Le volume Docker `lxp_caddy_data` contient le compte ACME, le certificat et sa
clé privée. Il doit rester présent entre les mises à jour. `docker compose down`
sans `--volumes` le conserve ; ne pas employer `down --volumes` pour une mise à
jour ordinaire.

Chaque VPS demande un certificat pour son domaine exact. Il ne faut pas changer
le Caddyfile en `*.lxp.andria.ovh` sur chaque VPS : plusieurs instances
demanderaient alors le même certificat wildcard et partageraient un périmètre
de clé privée inutilement large.

## Diagnostic

### Le module OVH est absent

La commande de contrôle du pipeline doit trouver `dns.providers.ovh`. Si la
construction échoue avant cette vérification, contrôler l'accès Internet du
moteur Docker distant et les logs de `xcaddy`.

### Le challenge DNS échoue

Contrôler `OVH_ENDPOINT`, les trois clés OVH et les droits du Consumer Key. Les
logs Caddy indiquent normalement si la création ou la suppression du TXT
`_acme-challenge.testcaddy.lxp.andria.ovh` est refusée.

### Caddy ne peut pas écouter sur 80 ou 443

Vérifier qu'aucun autre conteneur ou service du VPS n'occupe ces ports :

```bash
sudo ss -lntup | grep -E ':(80|443)\b'
```

### Le certificat est obtenu mais le site ne répond pas

Vérifier l'enregistrement `A`, les règles NAT et pare-feu Proxmox, puis les logs
de `app`. Le challenge DNS permet d'obtenir le certificat mais n'ouvre pas les
ports réseau du VPS.
