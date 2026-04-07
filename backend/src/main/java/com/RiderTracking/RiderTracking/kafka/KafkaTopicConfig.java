package com.RiderTracking.RiderTracking.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic createRiderLocationTopic(){
        return new NewTopic("rider-location", 1, (short)1);
    }
}
