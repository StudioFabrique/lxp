pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    parameters {
        string(name: 'INFISICAL_CREDENTIAL_ID', defaultValue: 'INFISICAL_LXP', trim: true, description: 'Credential Jenkins portant le Client ID et le Client Secret de la Machine Identity de cette instance')
        string(name: 'INFISICAL_PROJECT_ID', defaultValue: '', trim: true, description: 'Project ID du projet LXP dans Infisical')
        string(name: 'INFISICAL_ENVIRONMENT', defaultValue: 'prod', trim: true, description: 'Slug Infisical : dev, staging ou prod')
        string(name: 'INFISICAL_PATH_PREFIX', defaultValue: '', trim: true, description: 'Vide pour la cible principale ; /demo pour la démonstration dans dev')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and publish image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: params.INFISICAL_CREDENTIAL_ID,
                        usernameVariable: 'INFISICAL_UNIVERSAL_AUTH_CLIENT_ID',
                        passwordVariable: 'INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET'
                    )
                ]) {
                    sh '''
                        set -eu
                        export INFISICAL_SECRET_PATHS=/ci
                        export PIPELINE_LXP_IMAGE=studiostep/lxp
                        export PIPELINE_LXP_IMAGE_TAG="$GIT_COMMIT"
                        export PIPELINE_LXP_IMAGE_ALIAS_TAG=latest
                        ./deployment/with-infisical.sh ./deployment/build.sh
                    '''
                }
            }
        }
    }
}
