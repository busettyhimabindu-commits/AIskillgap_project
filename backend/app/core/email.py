import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

def send_email_notification(email_to: str, subject: str, template_type: str, data: Dict[str, Any]) -> bool:
    """
    Simulates sending email notifications (Welcome, Password Reset, Weekly Digest).
    Logs the email content and returns True.
    """
    logger.info(f"--- Sending Email Notification ---")
    logger.info(f"To: {email_to}")
    logger.info(f"Subject: {subject}")
    logger.info(f"Template: {template_type}")
    logger.info(f"Payload: {data}")
    logger.info(f"----------------------------------")
    return True
