pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
                bat 'npx playwright install --with-deps chromium'
            }
        }

        stage('Run Login & API Tests') {
            steps {
                bat 'npm run test:login'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true
                }
            }
        }

        stage('Run UI Tests') {
            steps {
                bat 'npm run test:ui'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                allure([
                    includeProperties: false,
                    jdk: '',
                    results: [[path: 'allure-results']]
                ])
            }
        }
    }

    post {
        success {
            echo '✅ Regression passed! Login, API & UI all green. Check Allure Dashboard.'
        }
        failure {
            echo '❌ Regression failed! Check Allure Dashboard for details.'
        }
    }
}
