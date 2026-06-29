# LXP

# Code de la plateforme ANDRIA

## Prérequis

- Dernière version LTS de **node js** et de **npm**
- **nodemon** installé globalement avec npm (Cette librairie sert pour le hot reloading.), si ce n'est pas le cas, utiliser la commande :  
```bash 
npm i -g nodemon
```

- **docker** et **docker compose**

## Initialisation du projet

### Script automatisé

- Utiliser la commande suivante pour initialiser le projet
```bash 
./init-scripts/init.sh
```

Si le script ne fonctionne pas à cause des droits d'execution, utiliser
```bash 
sudo chmod +x ./init-scripts/init.sh
```

### Que fait ce script ?

Afin de démarrer dans un environnement de développement propre, un script executable initialise le projet complet de tel façon à l'utiliser directement et exploiter des données prêtes à l'emploi.

Le script execute les commandes suivantes dans l'ordre :
- Installation générale des librairies et des dépendances du front et api avec npm
- Copier les variables d'environnement env.example dans les .env
- Démarrage des containers docker PostgreSQL et MongoDB
- Migrations bdd et generation du code des modèles prisma
- Récupération données fictives via dump bdd Postgres et Mongodb
- Déplacement des activités types texte vers le répertoire

### Démarrage du serveur

Une fois que le script init.sh a terminé son initialisation, le serveur peut être lancé depuis la racine du projet avec la commande
```bash
npm run dev
```

### Nettoyage des données

- Utiliser la commande suivante pour nettoyer toutes les données du projet et des containers docker
```bash 
./init/clean-project-data.sh
```

Si le script ne fonctionne pas à cause des droits d'execution, utiliser
```bash 
sudo chmod +x ./init-scripts/clean-project-data.sh
```

### Identifiants de connexion

#### Admin
email : admin@studio.eco

mot de passe : Abcdef@123456

#### Etudiant

email : apprenant@studio.eco

mot de passe : Abcdef@123456

## Script automatisé de dump - Sauvegarder les données actuelles des bdd sur le repo

- Utiliser la commande suivante pour réaliser deux dumps
```bash 
./init-scripts/dump-data.sh
```

Si le script ne fonctionne pas à cause des droits d'execution, utiliser
```bash 
sudo chmod +x ./init-scripts/dump-data.sh
```

## Documentation de l'architecture

### Ports ouverts par défaut en mode dev

api => port **3000**

front => port **5173**

BDD PostgreSQL => port **5500**

BDD MongoDB => port **27000**

### Endpoint accessible publiquement en mode DEV pour récupérer les activités

http://localhost:3000/activities/{id_activité}

---

## Spécifications du projet

### Les objectifs du projet

- Améliorer l'efficacité de l'apprentissage : En offrant un contenu de qualité et en permettant aux utilisateurs de personnaliser leur expérience d'apprentissage.

- Augmenter l'engagement des utilisateurs : En offrant des opportunités d'interaction et de collaboration avec du contenu et d'autres utilisateurs.

- Améliorer la gestion de l'apprentissage : Ce projet LXP peut également viser à améliorer la gestion de l'apprentissage au sein de l'organisation en offrant un outil centralisé pour la gestion de l'apprentissage. L'outil MAHADA IA vient en appui/complémentaire pour mieux gérer l'évolution des apprenants

- Améliorer la satisfaction des utilisateurs : En offrant une expérience d'apprentissage agréable et en répondant aux besoins en apprentissage des utilisateurs.
- Augmenter l'adoption de la plateforme : en offrant un contenu de qualité et en promouvant l'utilisation de la plateforme auprès des utilisateurs.
- Favoriser la collaboration et le partage d'informations : En utilisant des outils de collaboration et de partage de contenu.
- Améliorer la gestion des compétences : en créant des outils de suivi et de développement des compétences des utilisateurs.
- Favoriser l'apprentissage continu : Encourager l'apprentissage continu en offrant un accès facile à du contenu d'apprentissage et en permettant aux utilisateurs de suivre leur progrès d'apprentissage. - [  
   Canvas improvements](app://obsidian.md/index.html#canvas-improvements) — Canvas settings, readonly mode, global search results, and more.
- [Bugfixes](app://obsidian.md/index.html#bugfixes) — fixes for Export to PDF, mermaid graph colors, and list numbering.

### Caractéristiques de LXP

- Personnalisation : une LXP doit permettre aux utilisateurs de personnaliser leur expérience d'apprentissage en fonction de leurs intérêts et de leurs objectifs d'apprentissage.

- Recommandations de contenu : une LXP doit être capable de recommander du contenu en fonction de l'historique d'apprentissage et des préférences de l'utilisateur.

- Interactivité : une LXP doit offrir des opportunités d'interaction avec du contenu et d'autres utilisateurs, par exemple en permettant aux utilisateurs de poser des questions ou de participer à des discussions.

- Accessibilité : une LXP doit être accessible sur différents appareils et doit être facile à utiliser pour tous les utilisateurs, y compris ceux qui ont des besoins spéciaux.

- Suivi de l'apprentissage : une LXP doit permettre aux utilisateurs de suivre leurs progrès d'apprentissage et de définir des objectifs d'apprentissage à atteindre.

- Intégration de contenu : une LXP doit être capable d'intégrer du contenu provenant de différentes sources, comme des cours en ligne, des articles, des vidéos, etc.

- Fonctionnalités de collaboration : une LXP doit permettre aux utilisateurs de travailler ensemble et de partager du contenu et des idées

- Gamification : Pour rendre l'apprentissage plus engageant et amusant. Cela peut inclure des points, des badges, des niveaux, des challenges, etc. Par exemple: un badge pour chaque compétence validée.

- Analyse de l'apprentissage : Des fonctionnalités d'analyse d'apprentissage qui permettent aux utilisateurs et aux administrateurs de suivre les progrès de l'apprentissage et de mieux comprendre les forces et les faiblesses des utilisateurs.

- Outils de création de contenu : Ces outils permettent aux utilisateurs de créer du contenu personnalisé pour leur propre apprentissage ou pour partager avec d'autres utilisateurs.

- Support de la formation en direct : Par exemple en permettant aux formateurs de diffuser du contenu en direct et de répondre aux questions des utilisateurs en temps réel.

- Support de la formation mobile : certaines LXP offrent un support de la formation mobile, permettant aux utilisateurs d'accéder au contenu et aux outils d'apprentissage depuis n'importe quel appareil mobile.

- Fonctionnalités de gestion de projet : Pour permettre aux utilisateurs de planifier et de suivre l'avancement de leur apprentissage.
- Support de la formation en groupe : certaines LXP offrent un support de la formation en groupe, permettant aux utilisateurs de travailler ensemble et de partager du contenu et des idées.
- Fonctionnalités de social learning : communiquer et collaborer avec d'autres utilisateurs et de partager du contenu et des idées.
- Fonctionnalités de certification : Ces fonctionnalités permettent aux utilisateurs de démontrer leurs compétences et leur expertise dans un domaine particulier.
- Fonctionnalités de gestion de contenu : Les LXP offrent des fonctionnalités de gestion de contenu qui permettent aux administrateurs de créer, de publier et de mettre à jour du contenu d'apprentissage.

- Chat-bots: Cette LXP doit fournir des chat-bots basés sur l'IA qui seront disponibles pour les utilisateurs 24h/24 et 7j/7. Les chat-bots peuvent aider les utilisateurs dans leur tâche actuelle et faire des recommandations intelligentes. Les utilisateurs interagissent avec les chat-bots en tapant des messages dans une zone de discussion textuelle.

- Intégration des applications tierces: Slack, Discord, Github, etc..

# Migration

Créer le fichier de migration :

- npx prisma migrate dev --create-only --name nom_migration
- npx prisma migrate deploy

Si problème de synchronisation entre le modèle et la base de données :

- npx prisma migrate resolve --applied "nom_complet_de_la_derniere_migration"
- npx prisma migrate dev --create-only --name empty-migration

- exécuter les deux commandes pour créer le fichier de migration
