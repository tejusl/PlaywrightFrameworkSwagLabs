pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Install dependencies') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm ci'
                    } else {
                        bat 'npm ci'
                    }
                }
            }
        }

        stage('Install Chromium') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npx playwright install chromium'
                    } else {
                        bat 'npx playwright install chromium'
                    }
                }
            }
        }

        stage('Type check') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm run typecheck'
                    } else {
                        bat 'npm run typecheck'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'saucedemo-standard-user',
                        usernameVariable: 'SWAG_LABS_USERNAME',
                        passwordVariable: 'SWAG_LABS_PASSWORD'
                    ),
                    string(
                        credentialsId: 'saucedemo-locked-out-username',
                        variable: 'SWAG_LABS_LOCKED_OUT_USERNAME'
                    )
                ]) {
                    script {
                        if (isUnix()) {
                            sh 'npm test'
                        } else {
                            bat 'npm test'
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            junit testResults: 'test-results/junit.xml', allowEmptyResults: true
            archiveArtifacts artifacts: 'ci-playwright-report/**, test-results/**', allowEmptyArchive: true
        }
    }
}
