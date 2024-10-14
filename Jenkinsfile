pipeline {
    agent any

   tools {
        nodejs 'nodejs20'
    }
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        SONAR_TOKEN = credentials('sonar-token')
        SONAR_HOST_URL = 'http://51.15.183.215:9000/'
    }

    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'stage', credentialsId: 'cyril-token-lxp', url: 'https://github.com/StudioFabrique/lxp.git'
            }
        }



       / stage('Trivy FS Scan') {
            steps {
               sh 'trivy filesystem --format table -o fs-report.html .'
            }
        }

      stage('SonarQube') {
            steps {
                sh """
                    ${SCANNER_HOME}/bin/sonar-scanner \
                    -Dsonar.projectKey=lxp  \
                    -Dsonar.projectName=lxp \
                    -Dsonar.host.url=${SONAR_HOST_URL} \
                    -Dsonar.login=${SONAR_TOKEN}
                """
            }
        }

         stage('SoanrQube') {
            steps {
                sh '${SCANNER_HOME}/bin/sonar-scanner -Dsonar.projectKey=Campground -Dsonar.projectName=Campground'
            }
        }

        stage('Tests backend') {
            steps {
                sh 'npm i --save-dev @types/node'
                sh 'npm -g i dotenv-cli'
                sh 'mkdir api/src/uploads || true'
                sh 'npm run test'
            }
        }

          stage('Docker build & tag') {
            steps {
               script {
                   withDockerRegistry(credentialsId: 'docker-registry', toolName: 'docker') {
                        sh 'docker build -t studiostep/lxp:latest .'
                    }
               }
            }
        }

          stage('Trivy Image scan') {
            steps {
                sh 'trivy image --format table -o fs-report.html studiostep/lxp:latest'
            }
        }

          stage('Docker Push image') {
            steps {
               script {
                   withDockerRegistry(credentialsId: 'docker-registry', toolName: 'docker') {
                        sh 'docker push studiostep/lxp:latest'
                    }
               }
            }
        }

        stage('Docker Deploy to dev') {
            steps {
                withCredentials([file(credentialsId: 'lxp-env-file', variable: 'ENV_FILE')]) {
                    script {
                        // Read the contents of the environment file
                        def envContent = readFile("${ENV_FILE}")
                        // Write the contents to .env file in the workspace
                        writeFile file: '.env', text: envContent
                    }
                }
               script {
                   withDockerRegistry(credentialsId: 'docker-registry', toolName: 'docker') {
                        sh 'docker compose down'
                        sh 'docker network rm lxp_network || true'
                        sh 'docker image rm lxp:latest || true'
                        sh 'docker network create lxp_network'
                        sh 'docker compose up -d'
                    }
               }
            }
        }

    }
}
