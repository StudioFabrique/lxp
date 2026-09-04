pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
        timeout(time: 90, unit: 'MINUTES')
    }

    parameters {
        string(name: 'INFISICAL_CREDENTIAL_ID', defaultValue: 'INFISICAL_CREDENTIALS', trim: true, description: 'Credential Universal Auth visible par le job.')
        choice(name: 'INFISICAL_DOMAIN', choices: ['https://eu.infisical.com', 'https://app.infisical.com'], description: 'Region Infisical.')
        string(name: 'INFISICAL_PROJECT_ID', defaultValue: '7f01d005-b9ab-4c92-bbad-3d6e8798c347', trim: true, description: 'Project ID LXP.')
        string(name: 'INFISICAL_PATH_PREFIX', defaultValue: "${params.INFISICAL_PATH_PREFIX ?: ''}", trim: true, description: 'Obligatoire en prod : /<instance> ; sélectionne les dossiers ci, runtime et backup de la cible.')
        string(name: 'DEPLOY_PATH', defaultValue: "${params.DEPLOY_PATH ?: ''}", trim: true, description: 'Vide pour deduire le chemin du foyer distant.')
        string(name: 'LXP_DEPLOYMENT_NAME', defaultValue: "${params.LXP_DEPLOYMENT_NAME ?: 'lxp'}", trim: true, description: 'Nom exact de la stack Docker.')
        string(name: 'BACKUP_CRON', defaultValue: "${params.BACKUP_CRON ?: 'H H/6 * * *'}", trim: true, description: 'Frequence des sauvegardes planifiees, au format cron Jenkins.')
        choice(name: 'OPERATION', choices: ['backup', 'list-backup', 'verify-backup', 'stop-backup'], description: 'Le cron utilise backup ; les autres operations sont declenchables manuellement.')
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
            when {
                not {
                    equals expected: 'stop-backup', actual: params.OPERATION
                }
            }
            steps {
                checkout scm
            }
        }

        stage('Disable scheduled backups') {
            when {
                equals expected: 'stop-backup', actual: params.OPERATION
            }
            steps {
                echo 'Desactivation des prochains passages cron...'
                script {
                    properties([pipelineTriggers([])])
                }
                echo 'Planification desactivee. Le job reste disponible manuellement et les snapshots existants sont conserves.'
            }
        }

        stage('Backup operation') {
            when {
                not {
                    equals expected: 'stop-backup', actual: params.OPERATION
                }
            }
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
                            list-backup)
                                INFISICAL_SECRET_PATHS="/ci /runtime /backup" ./deployment/with-infisical.sh ./deployment/list-backups.sh
                                ;;
                            verify-backup)
                                INFISICAL_SECRET_PATHS="/ci /runtime /backup" ./deployment/with-infisical.sh ./deployment/restore.sh verify-enabled
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

        stage('Enable scheduled backups') {
            when {
                equals expected: 'backup', actual: params.OPERATION
            }
            steps {
                script {
                    if (!params.BACKUP_CRON?.trim()) {
                        error('BACKUP_CRON doit contenir une expression cron Jenkins.')
                    }
                    def backupCron = params.BACKUP_CRON.trim()
                    properties([
                        pipelineTriggers([
                            cron(backupCron)
                        ])
                    ])
                    echo "Planification des sauvegardes activee avec la frequence ${backupCron}."
                }
            }
        }
    }
}
