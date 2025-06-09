#!/usr/bin/env groovy
library 'identifier' : 'jenkins-shared-library@master','retriever': modernSCM(
    [
        $class: 'GitSCMSource',
        remote: 'https://gitlab.com/AbdelrahmanElshahat/jenkins-shared-library.git',
        credentials: 'gitlab-credentials'
    ]
)
pipeline{
    agent any 
    tools {
        nodejs 'my-nodejs'
    }
    stages{
        stage("build"){
            steps{
                echo "========executing build stage========"
                script {
                   buildNodejs()
                }
            }
           
        }
        stage("increment Version"){
            steps{
                echo "========executing increment version stage========"
                script {
                    incrementNodejsVersion()
                }
            }
        }
        stage("push version"){
            steps{
                echo "========executing push version stage========"
                script {
                    pushVersionToGit()
                }
            }
        }
        stage("build backend image"){
            steps{
                echo "========executing build backend image stage========"
                script {
                    def version = getVersionFromPackageJson()
                    buildImage "elshahat20/my-app:iti-${version}"
                }
            }
        }
        stage("build frontend image"){
            steps{
                echo "========executing build frontend image stage========"
                script {
                    def version = getVersionFromPackageJson()
                    dir('frontend') {
                        buildImage "elshahat20/my-app-frontend:iti-${version}"
                    }
                }
            }
        }
        stage("docker Login"){
            steps{
                echo "========executing docker login stage========"
                script {
                    dockerLogin()
                }
            }
        }
        stage("push Images"){
            steps{
                echo "========executing push images stage========"
                script {
                   def version = getVersionFromPackageJson()
                       dockerPush "elshahat20/my-app:itiBack-${version}"
                       dockerPush "elshahat20/my-app:itiFront-${version}"
                }
            }
        }
    }
    post{
        always{
            echo "========always========"
        }
        success{
            echo "========pipeline executed successfully ========"
        }
        failure{
            echo "========pipeline execution failed========"
        }
    }
}