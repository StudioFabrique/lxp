# Sauvegarder et restaurer ANDRIA

Les scripts utilisent Restic pour sauvegarder :

- PostgreSQL ;
- MongoDB ;
- le dossier `uploads`.

La base IA, le cache des modèles et les journaux ne sont pas sauvegardés. Le
service IA reconstruit sa base à partir des données du LXP.

## Choisir les destinations

Vous pouvez activer une ou plusieurs destinations :

| Destination | Variable d’activation | Emplacement |
| --- | --- | --- |
| Disque du serveur | `BACKUP_LOCAL_ENABLED` | `BACKUP_LOCAL_REPOSITORY` |
| Autre volume | `BACKUP_EXTERNAL_VOLUME_ENABLED` | `BACKUP_EXTERNAL_VOLUME_REPOSITORY` |
| Stockage S3 | `BACKUP_S3_ENABLED` | `BACKUP_S3_REPOSITORY` |

Les trois variables d’activation valent `false` par défaut. Une destination
active qui échoue fait échouer toute la sauvegarde.

Une copie sur le disque du serveur protège d’une suppression accidentelle.
Elle ne protège pas d’une panne ou de la perte du serveur. Ajoutez une copie
sur un autre volume ou sur S3.

La page [Variables d’environnement](variables-environnement.md#sauvegarde-et-restauration)
liste toutes les variables Restic et S3.

## Préparer une cible

1. Créez le dossier ou le bucket de chaque destination.
2. Donnez au démon Docker le droit d’écrire dans les dossiers locaux.
3. Placez les variables dans `/backup` en développement ou dans
   `<préfixe>/backup` en production.
4. Définissez `BACKUP_RESTIC_PASSWORD`.
5. Passez la variable `BACKUP_*_ENABLED` de chaque destination prête à `true`.

Placez `BACKUP_LOCAL_REPOSITORY` hors de `DEPLOY_PATH`. Le dépôt sur volume
externe doit utiliser un autre système de fichiers.

Conservez une copie de `BACKUP_RESTIC_PASSWORD` dans un autre coffre. Sans ce
mot de passe, Restic ne peut pas lire les sauvegardes.

## Lancer une sauvegarde

Depuis un agent qui a chargé les variables Infisical de la cible :

```bash
BACKUP_REASON=manual ./deployment/backup.sh
```

Les valeurs acceptées pour `BACKUP_REASON` sont :

- `manual` ;
- `scheduled` ;
- `pre-deploy` ;
- `post-deploy`.

Chaque déploiement crée une sauvegarde avant les migrations et une autre après
le démarrage. Sur une cible vide, la première sauvegarde accepte l’absence des
bases. Le pipeline crée le premier snapshot après le déploiement.

## Planifier les sauvegardes avec Jenkins

Créez un job par cible avec `deployment/backup.Jenkinsfile`. Lancez une première
sauvegarde manuelle avec les bons paramètres :

- préfixe Infisical ;
- nom de la stack ;
- chemin de déploiement.

Après cette première sauvegarde, Jenkins lance le job toutes les six heures.
Le paramètre `OPERATION` propose quatre actions :

| Action | Effet |
| --- | --- |
| `backup` | Crée un snapshot sur toutes les destinations actives. |
| `list-backup` | Affiche les snapshots dans la console Jenkins. |
| `verify-backup` | Contrôle le dernier snapshot de chaque destination active. |
| `stop-backup` | Retire la planification sans supprimer les snapshots. |

`stop-backup` arrête seulement le job planifié. Les sauvegardes placées avant
et après un déploiement restent actives.

Restic conserve les snapshots des sept derniers jours, huit sauvegardes
hebdomadaires et douze sauvegardes mensuelles.

## Contrôler une sauvegarde

Le contrôle lit tout le dépôt, vérifie les sommes des fichiers, puis restaure
PostgreSQL et MongoDB dans des conteneurs temporaires.

Contrôler le dernier snapshot S3 :

```bash
RESTORE_SOURCE=s3 RESTORE_SNAPSHOT=latest \
  ./deployment/restore.sh verify
```

Contrôler un snapshot local précis :

```bash
RESTORE_SOURCE=local RESTORE_SNAPSHOT=<id-restic> \
  ./deployment/restore.sh verify
```

Les valeurs de `RESTORE_SOURCE` sont `local`, `external-volume` et `s3`.

Lancez un contrôle après un changement majeur de PostgreSQL, MongoDB ou Restic.

## Restaurer une instance

> Cette commande remplace PostgreSQL, MongoDB et `uploads`. Vérifiez le nom de
> la stack et l’identifiant du snapshot avant de continuer.

La restauration demande un identifiant Restic précis. Elle refuse `latest`.
`RESTORE_CONFIRM` doit contenir le nom exact de la stack :

```bash
RESTORE_SOURCE=s3 \
RESTORE_SNAPSHOT=<id-restic> \
RESTORE_CONFIRM="$LXP_DEPLOYMENT_NAME" \
  ./deployment/restore.sh restore
```

Le script effectue d’abord le contrôle complet du snapshot. Il arrête ensuite
l’application, remplace les données, prépare le service IA si besoin et
redémarre l’application.

Si une erreur survient après l’arrêt, le script garde l’application arrêtée.
Vous évitez ainsi de servir des données incomplètes.

## Éviter deux opérations en même temps

Les scripts de déploiement, de sauvegarde et de restauration utilisent le même
verrou Docker : `<nom-de-stack>-backup-lock`.

Après un arrêt brutal de l’agent, vérifiez qu’aucune opération ne tourne. Vous
pouvez ensuite retirer un verrou resté présent :

```bash
docker rm -f <nom-de-stack>-backup-lock
```
