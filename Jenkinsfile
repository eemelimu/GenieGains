pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub'
        DOCKERHUB_REPO = 'vilpput1/gymjunkie'
        DOCKER_IMAGE_TAG = 'latest'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', credentialsId: 'github', url: 'git@github.com:eemelimu/GymJunkie.git'
                }
            }
        
        stage("Install dependencies"){
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm i'
                    } else {
                        bat 'npm i'
                    }
                }
            }

        }
        stage('Test') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm run test -- -u'
                    } else {
                        bat 'npm run test -- -u'
                    }
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                // Build Docker image
                script {
                    docker.build("${DOCKERHUB_REPO}:${DOCKER_IMAGE_TAG}")
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                // Push Docker image to Docker Hub
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS_ID) {
                        docker.image("${DOCKERHUB_REPO}:${DOCKER_IMAGE_TAG}").push()
                    }
                }
            }
        }

    }
}