variable "mail_user" {
  description = "Gmail address used to send emails"
  type        = string
  sensitive   = true
}

variable "mail_pass" {
  description = "Gmail app password"
  type        = string
  sensitive   = true
}

variable "source_code_hash" {
  description = "Base64-encoded SHA256 hash of the zip file, used to trigger Lambda updates"
  type        = string
  default     = ""
}
