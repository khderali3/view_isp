import smtplib
import ssl
from django.core.mail.backends.smtp import EmailBackend

class SSLIgnoreEmailBackend(EmailBackend):
    def _get_ssl_context(self):
        # Create SSL context that doesn't verify the certificate
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        return context

    def open(self):
        if self.connection:
            return False
        try:
            if self.use_ssl:
                self.connection = smtplib.SMTP_SSL(
                    self.host,
                    self.port,
                    timeout=self.timeout,
                    context=self._get_ssl_context()
                )
            else:
                self.connection = smtplib.SMTP(self.host, self.port, timeout=self.timeout)
                if self.use_tls:
                    self.connection.starttls(context=self._get_ssl_context())
            if self.username and self.password:
                self.connection.login(self.username, self.password)
            return True
        except Exception:
            if not self.fail_silently:
                raise
            return False
