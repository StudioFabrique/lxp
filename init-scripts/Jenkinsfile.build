pipeline {
    agent any
    tools { nodejs 'NodeJS-22' }
    stages {
        stage("Checkout") { steps { checkout scm } }
        
        stage('Docker build & push unique image') {
            steps {
                withDockerRegistry(credentialsId: 'DOCKER_REGISTRY', url: 'https://index.docker.io/v1/') {
                    sh "docker build -t studiostep/lxp:latest ."
                    sh "docker push studiostep/lxp:latest"
                }
            }
        }
    }
}
