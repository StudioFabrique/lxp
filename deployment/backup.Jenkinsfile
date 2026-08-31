pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
        timeout(time: 90, unit: 'MINUTES')
    }

    // Ce job planifie ne couvre que les cibles de production. En dev, les
    // Jenkinsfile de deploiement lancent eux-memes les sauvegardes.
    triggers {
        cron('H H/6 * * *')
    }

    parameters {
        string(name: 'INFISICAL_CREDENTIAL_ID', defaultValue: 'INFISICAL_CREDENTIALS', trim: true, description: 'Credential Universal Auth visible par le job.')
        choice(name: 'INFISICAL_DOMAIN', choices: ['https://eu.infisical.com', 'https://app.infisical.com'], description: 'Region Infisical.')
        string(name: 'INFISICAL_PROJECT_ID', defaultValue: '7f01d005-b9ab-4c92-bbad-3d6e8798c347', trim: true, description: 'Project ID LXP.')
        string(name: 'INFISICAL_PATH_PREFIX', defaultValue: "${params.INFISICAL_PATH_PREFIX ?: ''}", trim: true, description: 'Obligatoire en prod : /demo ou /clients/<slug> ; sélectionne notamment <préfixe>/backup.')
        string(name: 'DEPLOY_PATH', defaultValue: "${params.DEPLOY_PATH ?: ''}", trim: true, description: 'Vide pour deduire le chemin du foyer distant.')
        string(name: 'LXP_DEPLOYMENT_NAME', defaultValue: "${params.LXP_DEPLOYMENT_NAME ?: 'lxp'}", trim: true, description: 'Nom exact de la stack Docker.')
        choice(name: 'OPERATION', choices: ['backup', 'verify-s3', 'verify-local'], description: 'Le cron utilise backup ; les controles sont declenchables manuellement.')
    }

    environment {
        INFISICAL_DOMAIN      = "${params.INFISICAL_DOMAIN}"
        INFISICAL_PROJECT_ID  = "${params.INFISICAL_PROJECT_ID}"
        INFISICAL_ENVIRONMENT = 'prod'
        INFISICAL_PATH_PREFIX = "${params.INFISICAL_PATH_PREFIX}"

        PIPELINE_DEPLOY_PATH         = "${params.DEPLOY_PATH}"
        PIPELINE_LXP_DEPLOYMENT_NAME = "${params.LXP_DEPLOYMENT_NAME}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backup or verify') {
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
                        case "${OPERATION}" in
                            backup)
                                INFISICAL_SECRET_PATHS="/ci /runtime /backup" BACKUP_REQUIRE_ENABLED=true BACKUP_REASON=scheduled ./deployment/with-infisical.sh ./deployment/backup.sh
                                ;;
                            verify-s3)
                                INFISICAL_SECRET_PATHS="/ci /runtime /backup" RESTORE_SOURCE=s3 ./deployment/with-infisical.sh ./deployment/restore.sh verify
                                ;;
                            verify-local)
                                INFISICAL_SECRET_PATHS="/ci /runtime /backup" RESTORE_SOURCE=local ./deployment/with-infisical.sh ./deployment/restore.sh verify
                                ;;
                            *)
                                echo "Operation inconnue : ${OPERATION}" >&2
                                exit 2
                                ;;
                        esac
                    '''
                }
            }
        }
    }
}
