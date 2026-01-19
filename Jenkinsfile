pipeline {
    agent any

    environment {
        // Your Docker Hub Image Name
        IMAGE_NAME = 'sudharshan59/weather-app'
        // The ID of the credential you created in Jenkins
        // IMPORTANT: Make sure this ID matches what you created!
        REGISTRY_CRED = 'docker-hub-login' 
    }

    stages {
        stage('Build Image') {
            steps {
                script {
                    echo 'Building Docker Image...'
                    // Build the image using the current build number
                    sh "docker build -t $IMAGE_NAME:$BUILD_NUMBER ."
                }
            }
        }

        stage('Push to Hub') {
            steps {
                script {
                    echo 'Pushing to Docker Hub...'
                    // Login to Docker Hub using the credentials
                    withCredentials([usernamePassword(credentialsId: REGISTRY_CRED, passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                        sh "echo $PASS | docker login -u $USER --password-stdin"
                    }
                    // Push the numbered version
                    sh "docker push $IMAGE_NAME:$BUILD_NUMBER"
                    
                    // Tag it as 'latest' and push that too
                    sh "docker tag $IMAGE_NAME:$BUILD_NUMBER $IMAGE_NAME:latest"
                    sh "docker push $IMAGE_NAME:latest"
                }
            }
        }
    }
    
    post {
        always {
            // Clean up space by deleting the image from the Jenkins server
            sh "docker rmi $IMAGE_NAME:$BUILD_NUMBER || true"
            sh "docker rmi $IMAGE_NAME:latest || true"
        }
    }
}
