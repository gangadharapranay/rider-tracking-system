package com.RiderTracking.RiderTracking.controller;

import com.RiderTracking.RiderTracking.model.EmailPayload;
import jakarta.mail.internet.MimeMessage;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
public class MailConsumer {

    private static final int MAX_RETRIES = 3;

    @KafkaListener(topics = "email-topic", groupId = "email-group")
    public void listenForEmails(EmailPayload payload) {
        int attempt = 0;
        boolean sent = false;

        while (attempt < MAX_RETRIES && !sent) {
            try {
                attempt++;

                JavaMailSenderImpl mailSender = getMailSenderClient();
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true);

                helper.setFrom("gangadharapranay22@gmail.com", "DRH");

                if (payload.getTo() != null && !payload.getTo().isEmpty()) {
                    helper.setTo(payload.getTo().toArray(new String[0]));
                }

                helper.setSubject(payload.getSubject());
                helper.setText(payload.getBody(), true); // Send as HTML

                mailSender.send(message);

                System.out.println("✅ Email sent to: " + String.join(", ", payload.getTo()));
                sent = true;

            } catch (Exception e) {
                System.err.println("❌ Attempt " + attempt + " failed to send email: " + e.getMessage());

                if (attempt == MAX_RETRIES) {
                    System.err.println("🚨 All attempts to send the email have failed.");
                    // Optional: Push to a dead-letter topic or log to DB here.
                }

                try {
                    Thread.sleep(1000); // Wait 1 sec before retrying
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }

    public JavaMailSenderImpl getMailSenderClient() {
        JavaMailSenderImpl temp = new JavaMailSenderImpl();

        temp.setHost("smtp.gmail.com");
        temp.setUsername("gangadharapranay22@gmail.com");
        temp.setPassword("vnfu izsy ezxw xhgv");
        temp.setPort(587);
        temp.setProtocol("smtp");

        Properties props = temp.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.debug", "true");

        return temp;
    }
}
