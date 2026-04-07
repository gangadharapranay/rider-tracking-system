package com.RiderTracking.RiderTracking.controller;

import com.RiderTracking.RiderTracking.model.EmailPayload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mail")
public class MailController {

    @Autowired
    private KafkaTemplate<String, EmailPayload> kafkaTemplate;

    @PostMapping
    public String sendMail(@RequestBody EmailPayload emailPayload) {
        sendEmailToKafka(emailPayload);
        return "Mail payload sent to Kafka topic";
    }

    private void sendEmailToKafka(EmailPayload payload) {
        kafkaTemplate.send("email-topic", payload);
        System.out.println("EmailPayload sent to Kafka topic");
    }
}
