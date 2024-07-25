pipeline {
    agent any

    environment {
        NODE_VERSION = '20.x'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from the Git repository
                git branch: 'cicd', credentialsId: 'cyril-token-lxp', url: 'https://github.com/CyrilPonsan/simple-node-js-react-npm-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install npm dependencies
                sh 'npm run install'
            }
        }

        stage('Load Environment Variables') {
            steps {
                withCredentials([file(credentialsId: 'env-file', variable: 'ENV_FILE')]) {
                    sh 'cp $ENV_FILE /home/cponsan/lxp/api/.env'
                }
            }
        }

        stage('Build') {
            steps {
                echo 'All good !'
            }
        }
    }
}