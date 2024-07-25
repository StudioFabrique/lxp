pipeline {
    agent any
    
   tools {
        nodejs 'nodejs21'
    }
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        SONAR_TOKEN = credentials('sonar-token') 
        SONAR_HOST_URL = 'http://51.15.183.215:9000/' 
    }
    

    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'cicd', credentialsId: 'cyril-token-lxp', url: 'https://github.com/StudioFabrique/lxp.git'
            }
        }
        

        
          stage('Trivy FS Scan') {
            steps {
               sh 'trivy filesystem --format table -o fs-report.html .'
            }
        }
        
          stage('SoanrQube') {
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
        
        
/*          stage('SoanrQube') {
            steps {
                sh '${SCANNER_HOME}/bin/sonar-scanner -Dsonar.projectKey=Campground -Dsonar.projectName=Campground'
            }
        }*/
        
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

        stage('Load Credentials') {
            steps {
                withCredentials([file(credentialsId: 'lxp-env-file', variable: 'ENV_FILE')]) {
                    sh 'echo $ENV_FILE > .env'
                    sh 'export $(grep -v ^# .env | xargs)'
                }
            }
        }
        
          stage('Docker Deploy to dev') {
            steps {
               script {
                   withDockerRegistry(credentialsId: 'docker-registry', toolName: 'docker') {
                        sh 'docker compose up -d'
                    }
               }
            }
        }
        
    }
}