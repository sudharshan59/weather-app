pipeline {
    agent any

    environment {
        // Your Docker Hub Image Name - verified as sudharshan01
        IMAGE_NAME = 'sudharshan01/weather-app'
        // This MUST match the ID in Manage Jenkins > Credentials
        REGISTRY_CRED = 'docker-hub-login' 
    }

    stages {
        stage('Build Image') {
            steps {
                script {
                    echo 'Building Docker Image...'
                    sh "docker build -t $IMAGE_NAME:$BUILD_NUMBER ."
                }
            }
        }

        stage('Test Image') {
            steps {
                script {
                    echo 'Running Testing Layer...'
                    // Verifies the image internal structure before pushing
                    sh "docker run --rm $IMAGE_NAME:$BUILD_NUMBER ls /usr/share/nginx/html/index.html"
                }
            }
        }

        stage('Push to Hub') {
            steps {
                script {
                    echo 'Pushing to Docker Hub...'
                    withCredentials([usernamePassword(credentialsId: REGISTRY_CRED, passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                        // Secure login using backslash escaping for Jenkins
                        sh "echo \$PASS | docker login -u \$USER --password-stdin"
                    }
                    // Push unique build number version
                    sh "docker push $IMAGE_NAME:$BUILD_NUMBER"
                    
                    // Push 'latest' version for deployment
                    sh "docker tag $IMAGE_NAME:$BUILD_NUMBER $IMAGE_NAME:latest"
                    sh "docker push $IMAGE_NAME:latest"
                }
            }
        }

        stage('Deploy Locally') {
            steps {
                script {
                    echo 'Deploying Container Online...'
                    // Clean up old containers to prevent port conflicts
                    sh "docker stop weather-app-live || true"
                    sh "docker rm weather-app-live || true"
                    
                    // Run the app live on port 8081
                    sh "docker run -d --name weather-app-live -p 8081:80 $IMAGE_NAME:latest"
                }
            }
        }
    }
    
    post {
        always {
            // Remove local images to save space in GitHub Codespace
            sh "docker rmi $IMAGE_NAME:$BUILD_NUMBER || true"
            sh "docker rmi $IMAGE_NAME:latest || true"
        }
    }
}
