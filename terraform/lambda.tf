data "aws_caller_identity" "current" {}

resource "aws_lambda_function" "email_notification" {
  function_name    = "email-notification"
  s3_bucket        = "lambda-code-tc5-g192-v1"
  s3_key           = "notification-service.zip"
  source_code_hash = var.source_code_hash
  handler          = "src/handler.handler"
  runtime          = "nodejs18.x"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"

  timeout     = 15
  memory_size = 256

  environment {
    variables = {
      MAIL_HOST = "smtp.gmail.com"
      MAIL_PORT = "587"
      MAIL_USER = var.mail_user
      MAIL_PASS = var.mail_pass
    }
  }
}
