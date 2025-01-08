pipeline {
  agent {
    label 'Dev-Node'
  }
  environment {
    def CONTAINER_NAME_PROD = 'doccuraplusplus_server_prod'
    def CONTAINER_NAME_DEV = 'doccuraplusplus_server_dev'
    def WEB_HOST_DEV='dev-api-dp.edalytics.com'
    def WEB_HOST_PROD='prod.api.doccuraplusplus.edalytics.com'
    def DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1095584308804190298/fWUMHE_1_JEC-UbAjyoiwe41S4CajKjRdjgNjcVP5Vt6wJbZp0-WnCl43Dq7hE5Lo7h-'
    def discordURL = 'https://discord.com/api/webhooks/1095584308804190298/fWUMHE_1_JEC-UbAjyoiwe41S4CajKjRdjgNjcVP5Vt6wJbZp0-WnCl43Dq7hE5Lo7h-'
    // URL of image png/jpg to place to right of Discord build notifications
    def discordTImage = 'http://assets.stickpng.com/images/58480984cef1014c0b5e4902.png'    
    def discordImage = 'https://www.nicepng.com/png/full/362-3624869_icon-success-circle-green-tick-png.png'
    def discordDesc = "description\n"
    def discordFooter = "footer desc with vars: ${JOB_BASE_NAME}` (build #${BUILD_NUMBER})`  (tag #${BUILD_TAG})"
    def discordTitle = "${BUILD_NAME} (devel)"
    def username = "Jenkins-Bot"
    def tag = "${BUILD_TAG}"
    def jobBaseName = "${env.JOB_NAME}".split('/').first()
 
    def envButton = ''

  }
  post {
    always {
      script{

        def statusColor = ''
        switch (currentBuild.currentResult) {
          case 'SUCCESS':
            statusColor = '#00FF00'
            break
          case 'UNSTABLE':
            statusColor = '#FFA500'
            break
          case 'FAILURE':
            statusColor = '#FF0000'
            break
          default:
            statusColor = '#808080'
            break
        }


        if ("$JOB_BASE_NAME" == 'dev' || "$JOB_BASE_NAME" == 'main') {
          if (env.BRANCH_NAME == 'dev') {
            envButton = "[View Dev Site](http://${WEB_HOST_DEV})"
          } else {
            envButton = "[View Prod Site](http://${WEB_HOST_PROD})"
          }

          discordSend webhookURL: DISCORD_WEBHOOK_URL,
          title: "${JOB_BASE_NAME} #${BUILD_NUMBER}",
          link: "$BUILD_URL",
          result: currentBuild.currentResult ,
          description: "**Pipeline:** ${jobBaseName}  \n**Build:** ${env.BUILD_NUMBER}  \n**Status:** ${currentBuild.currentResult }\n\n**Branch:** ${env.BRANCH_NAME}   \n**Commit Message:** ${env.CHANGE_TITLE}\n\u2060\n[View Build]($BUILD_URL)  | ${envButton}\n\u2060",
          enableArtifactsList: true,
          showChangeset: true,
          thumbnail: discordTImage,
          unstable: true,
          color:statusColor,
          customAvatarUrl: discordTImage,
          customUsername: username,
          notes: "Hey <#1095584090691997726> the build for **${jobBaseName}** --> is Complete!",
          footer: discordFooter
        } else {
        
        }
      }
    }
  }
  stages {


  stage('Pre Build') {
      when {
        anyOf {
          branch 'dev'
          branch 'main'
        }
      }
      steps {
      script{
        if ("$JOB_BASE_NAME" == 'dev' || "$JOB_BASE_NAME" == 'main') {
          discordSend webhookURL: DISCORD_WEBHOOK_URL,
          title: "${JOB_BASE_NAME} #${BUILD_NUMBER}",
          link: "$BUILD_URL",
          result: currentBuild.currentResult ,
          description: "**Pipeline:** ${jobBaseName}  \n**Build:** ${env.BUILD_NUMBER}  \n**Status:**  Starting...\n\u2060  ",
          enableArtifactsList: true,
          showChangeset: true,
          thumbnail: discordTImage,
          unstable: true,
          customAvatarUrl: discordTImage,
          customUsername: username,
          footer: discordFooter
        } else {
        
        }
      }
      }
    }


    stage('Deploy Docker Compose') {
      when {
        anyOf {
          branch 'dev'
          branch 'main'
        }
      }
      steps {
        script {
          if (env.BRANCH_NAME == 'dev') {
            sh "echo Deploying Docker Compose for DEV environment"
            sh """ docker system prune -f  """
            sh """ docker-compose build dp_bdev """
            sh """ echo "Build Succesfully" """
            sh """  docker-compose up -d dp_bdev dp-dredis """
            sh """ docker ps --latest """

          } else {
            sh "echo Deploying Docker Compose for DEV environment"
            sh """ docker system prune -f  """
            sh """ docker-compose build doccuraplus_be_prod """
            sh """ echo "Build Succesfully" """
            sh """  docker-compose up -d doccuraplus_be_prod """
            sh """ docker ps --latest """
          }
        }
      }
    }
  }
}
