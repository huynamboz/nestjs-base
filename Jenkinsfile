pipeline {
    agent { label 'docker-agent' }
    triggers {
        githubPush()
    }
    stages {

        stage('Checkout') {
            steps {
                git branch: 'backend', url: 'https://github.com/ASasori/Photobooth.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    echo Building Docker image for backend...
                    docker compose --env-file .env build
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    echo Deploying...
                    docker compose --env-file .env down
                    docker compose --env-file .env up -d
                '''
            }
        }
    }

    post {
        success { echo "Deploy DONE!" }
        failure { echo "Deploy FAILED!" }
    }
}
