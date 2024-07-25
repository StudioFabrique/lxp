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
                echo "Hello Toto"
                // Install npm dependencies
                sh '''
                    npm run install
                    cd front && npm audit fix
                    cd ../api && npm audit fix
                '''
            }
        }

        stage('Build') {
            steps {
                echo 'All good !'
            }
        }
    }
}