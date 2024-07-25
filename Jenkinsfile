pipeline {
    agent any

    environment {
        NODE_VERSION = '20.x'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from the Git repository
                git 'https://github.com/StudioFabrique/lxp.git'
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
                withCredentials([string(credentialsId: 'SECRET_MESSAGE', variable: 'MY_SECRET_TEXT')]) {
                    echo MY_SECRET_TEXT
                    // Build the application (if required)
                    sh 'npm run build'
                }
            }
        }
    }
}