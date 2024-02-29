pipeline {
    agent any
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
        stage('Build') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm start'
                    } else {
                        bat 'npm start'
                    }
                }
            }
        }
        stage('Test') {
            steps {
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