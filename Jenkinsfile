pipeline {
    agent any

    // Définition des paramètres de lancement
    parameters {
        choice(name: 'TARGET_ENV', choices: ['demo', 'fnp'], description: 'Choisissez l\'environnement de destination')
    }

    tools {
        nodejs 'NodeJS-22'
    }

    stages {
        stage("Checkout") {
            steps {
                checkout scm
                script {
                    echo "🚀 Déploiement ciblé sur l'environnement : ${params.TARGET_ENV.toUpperCase()}"
                }
            }
        }

        stage('Docker build & push app image') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'DOCKER_REGISTRY', url: 'https://index.docker.io/v1/') {
                        sh "docker build -t studiostep/lxp:${params.TARGET_ENV.toLowerCase()}-${env.BUILD_NUMBER} -t studiostep/lxp:${params.TARGET_ENV.toLowerCase()}-latest ."
                        sh "docker push studiostep/lxp:${params.TARGET_ENV.toLowerCase()}-latest"
                    }
                }
            }
        }

        stage("Set Environment Config") {
            steps {
                script {
                    // Routage dynamique des Credentials selon le paramètre choisi
                    if (params.TARGET_ENV == 'demo') {
                        env.CRED_PREFIX = 'DEMO'
                    } else if (params.TARGET_ENV == 'fnp') {
                        env.CRED_PREFIX = 'FNP'
                    } else {
                        error "Environnement inconnu: ${params.TARGET_ENV}"
                    }
                }
            }
        }

        stage('Deploy and Migrate') {
            steps {
                withCredentials([
                    file(credentialsId: "${env.CRED_PREFIX}_ENV", variable: 'ENV_FILE'),
                    string(credentialsId: "${env.CRED_PREFIX}_HOST", variable: 'HOST'),
                    string(credentialsId: "${env.CRED_PREFIX}_USER", variable: 'USER'),
                    string(credentialsId: "${env.CRED_PREFIX}_PORT", variable: 'PORT'),
                    string(credentialsId: "${env.CRED_PREFIX}_TARGET", variable: 'TARGET'),
                    sshUserPrivateKey(credentialsId: "${env.CRED_PREFIX}_SSH", keyFileVariable: 'SSH_CRED'),
                    usernamePassword(credentialsId: 'DOCKER_REGISTRY', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')
                ]) {
                    sh '''
                        echo "🔧 Configuration de l'accès SSH pour l'environnement $TARGET_ENV..."
                        mkdir -p ~/.ssh

                        echo "Host deploy-target" > ~/.ssh/config
                        echo "  HostName $HOST" >> ~/.ssh/config
                        echo "  User $USER" >> ~/.ssh/config
                        echo "  Port $PORT" >> ~/.ssh/config
                        echo "  IdentityFile $SSH_CRED" >> ~/.ssh/config
                        echo "  StrictHostKeyChecking no" >> ~/.ssh/config

                        echo "📁 Préparation des dossiers sur le serveur cible..."
                        ssh deploy-target "mkdir -p /home/$USER/$TARGET/data /home/$USER/$TARGET/uploads /home/$USER/$TARGET/logs"

                        scp Caddyfile deploy-target:/home/$USER/$TARGET/Caddyfile

                        rm -f .env
                        cp $ENV_FILE .env
                        chmod 600 .env

                        echo "" >> .env
                        echo "IMAGE_TAG=${TARGET_ENV}-latest" >> .env

                        # Exporte la variable pour forcer Docker Compose à la lire
                        export IMAGE_TAG="${TARGET_ENV}-latest"

                        export DOCKER_HOST="ssh://deploy-target"

                        echo "🔐 Authentification Docker Hub sur le serveur cible..."
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                        echo "📡 Lancement du déploiement Docker sur $HOST ($TARGET_ENV)..."
                        docker compose down --remove-orphans || true
                        docker compose pull
                        docker compose up -d

                        # 👇 ON DÉPLACE LA MIGRATION PRISMA ICI (avant le logout)
                        echo "📌 Exécution des migrations Prisma sur $TARGET_ENV..."
                        docker exec lxp npx prisma migrate deploy

                        echo "🧹 Nettoyage des anciennes images..."
                        docker image prune -f

                        echo "🔐 Déconnexion Docker du serveur cible..."
                        docker logout
                    '''
                }
            }
        }
    }
}
