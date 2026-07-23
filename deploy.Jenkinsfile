pipeline {
    agent any

    stages {
        stage("Checkout Templates") {
            steps {
                checkout scm
            }
        }

        stage('Deploy and Migrate') {
            steps {
                withCredentials([
                    file(credentialsId: "APP_ENV", variable: 'ENV_FILE'),
                    string(credentialsId: "APP_SSH_HOST", variable: 'SSH_HOST'),
                    string(credentialsId: "SSH_USER", variable: 'SSH_USER'),
                    string(credentialsId: "SSH_PORT", variable: 'SSH_PORT'),
                    string(credentialsId: "SSH_TARGET", variable: 'SSH_TARGET'),
                    sshUserPrivateKey(credentialsId: "SSH_CREDENTIALS", keyFileVariable: 'SSH_CREDENTIALS'),
                    usernamePassword(credentialsId: 'DOCKER_REGISTRY', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')
                ]) {
                    sh '''
                        echo "🔧 Configuration SSH pour $SSH_HOST..."
                        mkdir -p ~/.ssh

                        echo "Host deploy-target
                        HostName $SSH_HOST
                        User $SSH_USER
                        Port $SSH_PORT
                        IdentityFile \\"$SSH_CREDENTIALS\\"
                        StrictHostKeyChecking no" > ~/.ssh/config

                        echo "📁 Préparation des dossiers et synchronisation intelligente des cours..."
                        ssh deploy-target "mkdir -p /home/$SSH_USER/$SSH_TARGET/data /home/$SSH_USER/$SSH_TARGET/uploads /home/$SSH_USER/$SSH_TARGET/logs"
                        rsync -avz api/uploads/ deploy-target:/home/$SSH_USER/$SSH_TARGET/uploads/

                        # Configuration du .env local
                        rm -f .env
                        cp "$ENV_FILE" .env

                        chmod 600 .env

                        export DOCKER_HOST="ssh://deploy-target"

                        echo "🔐 Connexion Docker Hub..."
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                        echo "📥 Récupération des images..."
                        docker compose pull

                        echo "🗄️ Démarrage des bases..."
                        docker compose up -d db-pg db-ai db-mongo

                        echo "⏳ Attente des bases..."
                        until docker compose exec -T db-pg \
                            pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"
                        do
                            sleep 2
                        done

                        until docker compose exec -T db-ai \
                            pg_isready -U "$ANDRIA_POSTGRES_USER" -d "$ANDRIA_POSTGRES_DB"
                        do
                            sleep 2
                        done

                        echo "📌 Migration Prisma..."
                        docker compose run --rm -w /app/api app npx prisma migrate deploy

                        echo "🔔 Installation des triggers ANDRIA..."
                        docker compose exec -T db-pg sh -c \
                            'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
                            < api/src/scripts/andria_notify_triggers.sql

                        echo "🧠 Provisionnement de la base IA..."
                        docker compose run --rm ai python -m app.db_provision

                        echo "🚀 Démarrage des applications..."
                        docker compose up -d app ai

                        echo "🔑 Génération de la clé d’activation..."
                        docker compose exec -T app npm run generate-activation-key

                        echo "📋 État des services..."
                        docker compose ps

                        echo "🧹 Nettoyage..."
                        docker image prune -f
                        docker logout
                    '''
                }
            }
        }
    }
}
