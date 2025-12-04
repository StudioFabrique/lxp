pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22'
    }

    environment {
        SCANNER_HOME = tool 'SonarQube Scanner'
    }

    stages {
        stage("Checkout") {
            steps {
                checkout scm
                script {
                    def branchName = env.GIT_BRANCH?.split('/')?.last()
                    echo "Checked out branch: ${branchName}"
                }
            }
        }

        stage("Build App") {
            steps {
                withCredentials([
                    file(credentialsId: 'FNP_FRONT_ENV', variable: 'FRONT_ENV_FILE'),
                    file(credentialsId: 'FNP_ENV', variable: 'API_ENV_FILE'),
                    string(credentialsId: 'FNP_TARGET', variable: 'TARGET'),
                ]) {
                    sh '''
                        echo "🔧 Setting frontend environment variables from $FRONT_ENV_FILE..."
                        chmod -R 777 ./front/ || true
                        cp $FRONT_ENV_FILE ./front/.env

                        echo "🔧 Setting backend environment variables from $API_ENV_FILE..."
                        chmod -R 777 ./api/ || true
                        cp $API_ENV_FILE ./api/.env

                        echo "✅ Frontend .env and backend .env copied."

                        npm run install
                        npm run generate
                        npm run deploy
                        rm -rf ./api/dist/generated || true
                        mkdir -p ./api/dist
                        cp -r ./api/generated ./api/dist/generated
                    '''
                }
            }
        }

        /* stage('Tests backend') {
            steps {
                sh 'npm -g i dotenv-cli'
                sh 'mkdir api/uploads || true'
                sh 'npm run test'
            }
            post {
                always {
                    sh 'docker volume prune --all --force || true'
                }
            }
        }*/

        /*
        stage("Sonar Qube") {
            steps {
                withCredentials([
                    string(credentialsId: "SONAR-JENKINS-TOKEN", variable: "SONAR_TOKEN"),
                    string(credentialsId: "SONAR_QUBE_HOST", variable: "SONAR_QUBE_HOST")
                ]) {
                    sh '''
                        ${SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=lxp  \
                        -Dsonar.projectName=lxp \
                        -Dsonar.host.url=$SONAR_QUBE_HOST \
                        -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }
        */

        stage("Deploying to FNP") {
            steps {
                withCredentials([
                    file(credentialsId: 'FNP_ENV', variable: 'ENV_FILE'),
                    string(credentialsId: 'FNP_HOST', variable: 'HOST'),
                    string(credentialsId: 'FNP_USER', variable: 'USER'),
                    string(credentialsId: 'FNP_PORT', variable: 'PORT'),
                    string(credentialsId: 'FNP_TARGET', variable: 'TARGET'),
                    sshUserPrivateKey(credentialsId: 'FNP_SSH', keyFileVariable: 'SSH_CRED')
                ]) {
                    sh '''
                        echo "🔧 Setting environment variables from $ENV_FILE..."
                        echo FNP_HOST=$HOST
                        echo FNP_USER=$USER
                        echo FNP_PORT=$PORT
                        echo FNP_TARGET=$TARGET

                        echo "ls -la"
                        ls -la ./api/dist || true

                        chmod -R 777 ./api/ || true

                        # Inject .env in workspace
                        cp $ENV_FILE ./api/dist/.env

                        echo "📡 Deploying to Demo..."
                        echo "🔎 Pinging $HOST..."

                        ping -c 4 $HOST
                    '''

                    sh '''
                        scp -o StrictHostKeyChecking=no -i $SSH_CRED -P $PORT -r ./api/dist $USER@$HOST:/home/$USER/$TARGET/
                    '''

                    sh '''
                        scp -o StrictHostKeyChecking=no -i $SSH_CRED -P $PORT -r ./api/prisma $USER@$HOST:/home/$USER/$TARGET/
                    '''

                    sh '''
                        scp -o StrictHostKeyChecking=no -i $SSH_CRED -P $PORT -r ./api/prisma.config.ts $USER@$HOST:/home/$USER/$TARGET/
                    '''

                    sh '''
                        scp -o StrictHostKeyChecking=no -i $SSH_CRED -P $PORT -r ./api/package.json $USER@$HOST:/home/$USER/$TARGET/
                    '''

                    sh '''
                        scp -o StrictHostKeyChecking=no -i $SSH_CRED -P $PORT -r ./api/package-lock.json $USER@$HOST:/home/$USER/$TARGET/
                    '''

                    sh '''
                        scp -o StrictHostKeyChecking=no -i $SSH_CRED -P $PORT docker-compose.yml $USER@$HOST:/home/$USER/$TARGET/dist/
                    '''

                    sh '''
                        ssh -o StrictHostKeyChecking=no -i $SSH_CRED -p $PORT $USER@$HOST "cd /home/$USER/$TARGET/ && npm ci"
                    '''

                    sh '''
                        ssh -o StrictHostKeyChecking=no -i $SSH_CRED -p $PORT $USER@$HOST "cd /home/$USER/$TARGET/dist/ && docker network create lxp_network || true"
                    '''

                    sh '''
                        ssh -o StrictHostKeyChecking=no -i $SSH_CRED -p $PORT $USER@$HOST "cd /home/$USER/$TARGET/dist/ && docker compose down || true && docker compose up -d"
                    '''
                }
            }
        }

        stage('Run Prisma migrations (DDL)') {
            steps {
                withCredentials([
                    string(credentialsId: 'FNP_MIGRATOR_PG_URL', variable: 'MIGRATOR_PG_URL'),
                    string(credentialsId: 'FNP_HOST', variable: 'HOST'),
                    string(credentialsId: 'FNP_USER', variable: 'USER'),
                    string(credentialsId: 'FNP_PORT', variable: 'PORT'),
                    string(credentialsId: 'FNP_TARGET', variable: 'TARGET'),
                    sshUserPrivateKey(credentialsId: 'FNP_SSH', keyFileVariable: 'SSH_CRED')
                ]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no -i ${SSH_CRED} -p ${PORT} ${USER}@${HOST} 'set -eu
                            cd /home/${USER}/${TARGET}

                            echo "📌 Running Prisma migrations from: \$(pwd)"

                            # Migration avec user DDL (least privilege respecté)
                            npx prisma migrate deploy
                        '
                    """
                }
            }
        }

        stage("Generate Prisma Client") {
            steps {
                withCredentials([
                    string(credentialsId: 'FNP_HOST', variable: 'HOST'),
                    string(credentialsId: 'FNP_USER', variable: 'USER'),
                    string(credentialsId: 'FNP_PORT', variable: 'PORT'),
                    string(credentialsId: 'FNP_TARGET', variable: 'TARGET'),
                    sshUserPrivateKey(credentialsId: 'FNP_SSH', keyFileVariable: 'SSH_CRED')
                ]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no -i ${SSH_CRED} -p ${PORT} ${USER}@${HOST} 'set -eu
                            cd /home/${USER}/${TARGET}

                            echo "🔄 Regenerating Prisma Client with correct configuration..."
                            npx prisma generate

                            echo "✅ Prisma Client regenerated successfully"
                        '
                    """
                }
            }
        }

        stage("Starting app") {
            steps {
                withCredentials([
                    file(credentialsId: 'FNP_ENV', variable: 'ENV_FILE'),
                    string(credentialsId: 'FNP_HOST', variable: 'HOST'),
                    string(credentialsId: 'FNP_USER', variable: 'USER'),
                    string(credentialsId: 'FNP_PORT', variable: 'PORT'),
                    string(credentialsId: 'FNP_TARGET', variable: 'TARGET'),
                    sshUserPrivateKey(credentialsId: 'FNP_SSH', keyFileVariable: 'SSH_CRED')
                ]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no -i $SSH_CRED -p $PORT $USER@$HOST "cd /home/$USER/$TARGET/dist/ && docker image prune -f"
                    '''

                    sh '''
                        ssh -o StrictHostKeyChecking=no -i $SSH_CRED -p $PORT $USER@$HOST "pm2 restart /home/$USER/$TARGET/dist/src/server.js || pm2 start /home/$USER/$TARGET/dist/src/server.js --name lxp-server"
                    '''

                    echo "✅ Deployment to DEMO completed successfully!"
                }
            }
        }
    }
}
