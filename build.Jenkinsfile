pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    parameters {
        string(name: 'INFISICAL_CREDENTIAL_ID', defaultValue: 'INFISICAL_CREDENTIALS', trim: true, description: 'Ce job vit hors dossier : il utilise le credential global de ce nom, sauf mention contraire ici.')
        choice(name: 'INFISICAL_DOMAIN', choices: ['https://eu.infisical.com', 'https://app.infisical.com'], description: 'Région Infisical. L\'organisation est sur EU ; l\'instance US ne connaît pas ses identités et répond 401.')
        string(name: 'INFISICAL_PROJECT_ID', defaultValue: '7f01d005-b9ab-4c92-bbad-3d6e8798c347', trim: true, description: 'Project ID du projet LXP. Identifiant public, inutilisable sans les credentials.')
        choice(name: 'INFISICAL_ENVIRONMENT', choices: ['prod', 'dev'], description: 'Environnement Infisical. Les instances déployées par Jenkins vivent dans prod ; dev suit la branche beta.')
        string(name: 'INFISICAL_PATH_PREFIX', defaultValue: '', trim: true, description: 'Chemin dont lire /ci pour le jeton du registre')
    }

    // Voir `deployment/direct/Jenkinsfile` : les paramètres passent par `params`
    // et non par l'environnement du shell, sans quoi le premier build d'un job
    // échoue avant d'avoir rien fait.
    environment {
        INFISICAL_DOMAIN      = "${params.INFISICAL_DOMAIN}"
        INFISICAL_PROJECT_ID  = "${params.INFISICAL_PROJECT_ID}"
        INFISICAL_ENVIRONMENT = "${params.INFISICAL_ENVIRONMENT}"
        INFISICAL_PATH_PREFIX = "${params.INFISICAL_PATH_PREFIX}"

        // Ce job ne construit rien qui tourne : il n'a pas besoin de /runtime.
        INFISICAL_SECRET_PATHS = '/ci'

        PIPELINE_LXP_IMAGE           = 'studiostep/lxp'
        PIPELINE_LXP_IMAGE_ALIAS_TAG = 'latest'
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
                    // `GIT_COMMIT` est posé par `checkout scm`, donc après
                    // l'évaluation du bloc `environment`. Il se lit ici.
                    sh '''
                        set -eu
                        export PIPELINE_LXP_IMAGE_TAG="$GIT_COMMIT"
                        ./deployment/with-infisical.sh ./deployment/build.sh
                    '''
                }
            }
        }
    }
}
