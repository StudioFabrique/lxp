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
                    string(credentialsId: "APP_HOST", variable: 'HOST'),
                    string(credentialsId: "APP_USER", variable: 'USER'),
                    string(credentialsId: "APP_PORT", variable: 'PORT'),
                    string(credentialsId: "APP_TARGET", variable: 'TARGET'),
                    sshUserPrivateKey(credentialsId: "APP_SSH", keyFileVariable: 'SSH_CRED'),
                    usernamePassword(credentialsId: 'DOCKER_REGISTRY', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')
                ]) {
                    sh '''
                        echo "🔧 Configuration SSH pour $HOST..."
                        mkdir -p ~/.ssh

                        echo "Host deploy-target
                        HostName $HOST
                        User $USER
                        Port $PORT
                        IdentityFile \\"$SSH_CRED\\"
                        StrictHostKeyChecking no" > ~/.ssh/config

                        echo "📁 Préparation des dossiers..."
                        ssh deploy-target "mkdir -p /home/$USER/$TARGET/data /home/$USER/$TARGET/uploads /home/$USER/$TARGET/logs"

                        # Envoi du Caddyfile sur le serveur distant
                        scp ./reverse-proxy-files/Caddyfile deploy-target:/home/$USER/$TARGET/Caddyfile

                        # Configuration du .env local
                        rm -f .env
                        cp "$ENV_FILE" .env
                        
                        chmod 600 .env

                        export DOCKER_HOST="ssh://deploy-target"

                        echo "🔐 Connexion Docker Hub & Récupération de l'image unique..."
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                        echo "📡 Relancement des conteneurs..."
                        docker compose down --remove-orphans || true
                        docker compose pull
                        docker compose up -d

                        echo "📌 Migrations Prisma..."
                        docker exec -w /app/api lxp npx prisma migrate deploy

                        echo "🧹 Nettoyage..."
                        docker image prune -f
                        docker logout
                    '''
                }
            }
        }
    }
}
