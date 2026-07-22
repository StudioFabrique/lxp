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

                        echo "📡 Relancement des conteneurs..."
                        docker compose down --remove-orphans || true
                        docker compose rm -f || true
                        docker compose pull
                        docker compose up -d

                        echo "📌 Migrations Prisma..."
                        docker compose exec -T -w /app/api app npx prisma migrate deploy

                        echo "🔑 Génération de la clé d'activation du premier administrateur..."
                        docker compose exec -T app npm run generate-activation-key

                        echo "🔧 Notification des triggers pour le serveur IA..."
                        docker compose exec -T app npm run notify-triggers

                        echo "🧹 Nettoyage..."
                        docker image prune -f
                        docker logout
                    '''
                }
            }
        }
    }
}
