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

        stage('Push to Hub') {
            steps {
                script {
                    echo 'Pushing to Docker Hub...'
                    // This block securely retrieves your username and token
                    withCredentials([usernamePassword(credentialsId: REGISTRY_CRED, passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                        // Added backslashes to $PASS and $USER to fix the security warning and login issues
                        sh "echo \$PASS | docker login -u \$USER --password-stdin"
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
