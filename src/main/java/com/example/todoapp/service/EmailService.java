package com.example.todoapp.service;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import com.resend.core.exception.ResendException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final Resend resend;

    @Value("${resend.from-email}")
    private String fromEmail;

    @Value("${resend.from-name}")
    private String fromName;

    public EmailService(@Value("${resend.api-key}") String apiKey) {
        this.resend = new Resend(apiKey);
        log.info("EmailService initialized with Resend. From: {} <{}>", fromName, fromEmail);
    }

    public void sendWelcomeEmail(String toEmail, String name) {
        log.info(">>> Sending welcome email to {} ({})", toEmail, name);
        try {
            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from(fromName + " <" + fromEmail + ">")
                    .to(toEmail)
                    .subject("Welcome to ToDo App!")
                    .html(buildWelcomeHtml(name))
                    .build();

            CreateEmailResponse response = resend.emails().send(params);
            log.info(">>> Welcome email SENT. ID: {} to {} ({})", response.getId(), toEmail, name);
        } catch (ResendException e) {
            log.error(">>> FAILED to send email to {} ({}): {}", toEmail, name, e.getMessage(), e);
            throw new RuntimeException("Email send failed: " + e.getMessage(), e);
        }
    }

    private String buildWelcomeHtml(String name) {
        return "<!DOCTYPE html>"
            + "<html lang=\"en\">"
            + "<head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></head>"
            + "<body style=\"margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,Helvetica,sans-serif;\">"
            + "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#f4f4f7;padding:40px 0;\">"
            + "<tr><td align=\"center\">"
            + "<table role=\"presentation\" width=\"560\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);\">"
            + "<tr><td style=\"background:linear-gradient(135deg,#7c3aed,#a855f7);padding:32px 40px;text-align:center;\">"
            + "<h1 style=\"color:#ffffff;margin:0;font-size:24px;\">ToDo App</h1>"
            + "</td></tr>"
            + "<tr><td style=\"padding:40px;\">"
            + "<h2 style=\"color:#1f2937;margin:0 0 16px;font-size:22px;\">Registration Successful!</h2>"
            + "<p style=\"color:#4b5563;font-size:16px;line-height:1.6;margin:0 0 24px;\">"
            + "Hello " + escapeHtml(name) + ", your account has been successfully created and configured. You can now log in using the credentials you provided during sign-up.</p>"
            + "<p style=\"color:#1e293b;font-size:15px;font-weight:600;margin:0 0 16px;\">Account Setup Details:</p>"
            + "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:0 0 24px;\">"
            + "<tr><td style=\"padding:6px 0;color:#4b5563;font-size:15px;line-height:1.5;\">&#10003;&nbsp;&nbsp;Account status: <strong>Active</strong></td></tr>"
            + "<tr><td style=\"padding:6px 0;color:#4b5563;font-size:15px;line-height:1.5;\">&#10003;&nbsp;&nbsp;All premium starter templates unlocked</td></tr>"
            + "<tr><td style=\"padding:6px 0;color:#4b5563;font-size:15px;line-height:1.5;\">&#10003;&nbsp;&nbsp;Cloud synchronization enabled</td></tr>"
            + "</table>"
            + "</td></tr>"
            + "<tr><td style=\"background-color:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;\">"
            + "<p style=\"color:#9ca3af;font-size:12px;margin:0;text-align:center;\">"
            + "This is an automated message confirming your registration. Please do not reply to this email.<br>"
            + "&copy; 2026 ToDo App. All rights reserved.</p>"
            + "</td></tr>"
            + "</table>"
            + "</td></tr></table>"
            + "</body></html>";
    }

    private String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;")
                    .replace("\"", "&quot;");
    }
}
