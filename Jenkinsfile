pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        NGINX_SITES_DIR = '/etc/nginx/sites-available'
        NGINX_SITES_ENABLED_DIR = '/etc/nginx/sites-enabled'
        PROJECT_NAME = 'movitrone-server'
        PROJECT_DIR = "/var/www/${PROJECT_NAME}"
        GIT_CREDENTIALS = 'Github'
        EMAIL_NOTIFICATION = 'abdulra7manshaban@gmail.com'
        SITE_DOMAIN = 'v1.foxcloud.site'
        BACKUP_DIR = "/var/backups/${PROJECT_NAME}"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout([$class: 'GitSCM', 
                        branches: [[name: '*/master']],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [], 
                        userRemoteConfigs: [[
                            url: 'https://github.com/Ftl-Erates/Erates-server-express.git',
                            credentialsId: env.GIT_CREDENTIALS
                        ]]
                    ])
                }
            }
        }

        stage('Backup Current Deployment') {
            steps {
                script {
                    try {
                        def backupDirExists = sh(script: "if [ -d ${BACKUP_DIR} ]; then echo 'exists'; fi", returnStdout: true).trim()
                        if (backupDirExists == 'exists') {
                            def timestamp = sh(script: "date +%Y%m%d%H%M%S", returnStdout: true).trim()
                            sh "sudo cp -r ${PROJECT_DIR} ${BACKUP_DIR}/${timestamp}"
                            echo "Backup created at ${BACKUP_DIR}/${timestamp}"
                        } else {
                            echo "Backup directory ${BACKUP_DIR} does not exist. Skipping backup."
                        }
                    } catch (Exception e) {
                        error "Failed to backup current deployment: ${e.message}"
                    }
                }
            }
        }


        stage('Move Project to Nginx Sites') {
            steps {
                script {
                    try {
                        sh "sudo mkdir -p ${PROJECT_DIR}"
                        sh "sudo cp -r ./* ${PROJECT_DIR}"
                        sh "sudo cp .env.prod ${PROJECT_DIR}/.env"
                    } catch (Exception e) {
                        error "Failed to move project to Nginx sites: ${e.message}"
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    dir("${PROJECT_DIR}") {
                        sh 'sudo npm install'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    dir("${PROJECT_DIR}") {
                        sh 'sudo npm run build'
                    }
                }
            }
        }

        stage('Configure Nginx') {
            steps {
                script {
                    try {
                        sh "sudo cp ${PROJECT_DIR}/nginx.conf ${NGINX_SITES_DIR}/${PROJECT_NAME}"
                        sh "sudo ln -sf ${NGINX_SITES_DIR}/${PROJECT_NAME} ${NGINX_SITES_ENABLED_DIR}/${PROJECT_NAME}"
                        sh 'sudo systemctl reload nginx'
                    } catch (Exception e) {
                        error "Failed to configure Nginx: ${e.message}"
                    }
                }
            }
        }

        stage('Obtain SSL Certificates') {
            steps {
                script {
                    sh """
                        sudo certbot --nginx -d ${SITE_DOMAIN} --non-interactive --agree-tos --email ${EMAIL_NOTIFICATION}
                    """
                }
            }
        }

        stage('Deploy with PM2') {
            steps {
                script {
                    dir("${PROJECT_DIR}") {
                        try {
                            sh """
                                sudo pm2 reload ecosystem.config.js --env production
                                sudo pm2 save
                            """
                        } catch (Exception e) {
                            error "Failed to deploy with PM2: ${e.message}"
                            sh "sudo pm2 reload ecosystem.config.js --env production"
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace'
            cleanWs()
        }
        success {
            echo 'Build and Deployment were successful!'
            // Delete the backup if the deployment was successful
            script {
                echo 'Deleting backup since the deployment was successful'
                sh "sudo rm -rf ${BACKUP_DIR}"
            }
        }
        failure {
            echo 'Build or Deployment failed.'
            emailext(
                subject: 'Jenkins Build Failed',
                body: "The build ${env.BUILD_NUMBER} failed at stage: ${currentBuild.currentResult}. Check the Jenkins logs for more details.",
                to: "${env.EMAIL_NOTIFICATION}"
            )
            script {
                echo 'Reverting to previous version'
                sh "sudo rm -rf ${PROJECT_DIR}"
                def lastBackup = sh(script: "ls -t ${BACKUP_DIR} | head -n1", returnStdout: true).trim()
                sh "sudo cp -r ${BACKUP_DIR}/${lastBackup} ${PROJECT_DIR}"
                sh "sudo pm2 reload ecosystem.config.js --env production"
            }
        }
    }
}
