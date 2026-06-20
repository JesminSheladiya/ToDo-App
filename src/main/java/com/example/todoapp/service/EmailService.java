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
                    .subject("Welcome to ToDo Goal!")
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
            + "<h1 style=\"color:#ffffff;margin:0;font-size:24px;\">ToDo Goal</h1>"
            + "</td></tr>"
            + "<tr><td style=\"padding:40px;\">"
            + "<h2 style=\"color:#1f2937;margin:0 0 16px;font-size:22px;\">Registration Successful!</h2>"
            + "<p style=\"color:#4b5563;font-size:16px;line-height:1.6;margin:0 0 24px;\">"
            + "Hello <b>" + escapeHtml(name) + "</b>, <br/>Welcome to ToDo Goal! Your account has been created successfully. You can now sign in and start managing your tasks and goals.</p>"
            + "<p style=\"color:#1e293b;font-size:15px;font-weight:600;margin:0 0 16px;\">Getting Started:</p>"
            + "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:0 0 24px;\">"
            + "<tr><td style=\"padding:6px 0;color:#4b5563;font-size:15px;line-height:1.5;\">&#10003;&nbsp;&nbsp;Account status: <strong>Active</strong></td></tr>"
            + "<tr><td style=\"padding:6px 0;color:#4b5563;font-size:15px;line-height:1.5;\">&#10003;&nbsp;&nbsp;Create your first goal and set a target date</td></tr>"
            + "<tr><td style=\"padding:6px 0;color:#4b5563;font-size:15px;line-height:1.5;\">&#10003;&nbsp;&nbsp;Track your progress across categories</td></tr>"
            + "</table>"
            + "</td></tr>"
            + "<tr><td style=\"background-color:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;\">"
            + "<p style=\"color:#9ca3af;font-size:12px;margin:0;text-align:center;\">"
            + "This is an automated message confirming your registration. Please do not reply to this email.<br>"
            + "&copy; 2026 ToDo Goal. All rights reserved.</p>"
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

    public void sendOtpEmail(String toEmail, String otp) {
        log.info(">>> Sending OTP email to {}", toEmail);
        try {
            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from(fromName + " <" + fromEmail + ">")
                    .to(toEmail)
                    .subject("Your Password Reset OTP")
                    .html(buildOtpHtml(otp))
                    .build();

            CreateEmailResponse response = resend.emails().send(params);
            log.info(">>> OTP email SENT. ID: {} to {}", response.getId(), toEmail);
        } catch (ResendException e) {
            log.error(">>> FAILED to send OTP email to {}: {}", toEmail, e.getMessage(), e);
            throw new RuntimeException("OTP email send failed: " + e.getMessage(), e);
        }
    }

    private String buildOtpHtml(String otp) {
        return "<!DOCTYPE html>"
            + "<html lang=\"en\">"
            + "<head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></head>"
            + "<body style=\"margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,Helvetica,sans-serif;\">"
            + "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#f4f4f7;padding:40px 0;\">"
            + "<tr><td align=\"center\">"
            + "<table role=\"presentation\" width=\"560\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);\">"
            + "<tr><td style=\"background:linear-gradient(135deg,#7c3aed,#a855f7);padding:32px 40px;text-align:center;\">"
            + "<h1 style=\"color:#ffffff;margin:0;font-size:24px;\">ToDo Goal</h1>"
            + "</td></tr>"
            + "<tr><td style=\"padding:40px;text-align:center;\">"
            + "<h2 style=\"color:#1f2937;margin:0 0 16px;font-size:22px;\">Password Reset Request</h2>"
            + "<p style=\"color:#4b5563;font-size:16px;line-height:1.6;margin:0 0 24px;\">"
            + "We received a request to reset your password. Use the OTP code below to proceed:</p>"
            + "<div style=\"background:#f9fafb;border:2px dashed #7c3aed;border-radius:12px;padding:20px 40px;margin:0 0 24px;display:inline-block;\">"
            + "<span style=\"font-size:36px;font-weight:800;letter-spacing:8px;color:#7c3aed;font-family:monospace;\">" + otp + "</span>"
            + "</div>"
            + "<p style=\"color:#4b5563;font-size:14px;line-height:1.6;margin:0 0 16px;\">"
            + "This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>"
            + "<p style=\"color:#9ca3af;font-size:13px;margin:0;\">"
            + "If you did not request a password reset, please ignore this email.</p>"
            + "</td></tr>"
            + "<tr><td style=\"background-color:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;\">"
            + "<p style=\"color:#9ca3af;font-size:12px;margin:0;text-align:center;\">"
            + "This is an automated message. Please do not reply to this email.<br>"
            + "&copy; 2026 ToDo Goal. All rights reserved.</p>"
            + "</td></tr>"
            + "</table>"
            + "</td></tr></table>"
            + "</body></html>";
    }
}
