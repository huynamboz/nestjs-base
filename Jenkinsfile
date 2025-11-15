pipeline {
    agent any

    stages {
        
        stage('Checkout') {
            steps {
                git branch: 'backend', url: 'https://github.com/ASasori/Photobooth.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "Building Docker image for backend..."
                    docker compose build
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    echo "Stopping old containers..."
                    docker compose down

                    echo "Starting new containers..."
                    docker compose up -d
                '''
            }
        }
    }

    post {
        success {
            echo "Backend Deploy Successful!"
        }
        failure {
            echo "Backend Deploy Failed!"
        }
    }
}
