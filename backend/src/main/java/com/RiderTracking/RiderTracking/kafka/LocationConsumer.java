package com.RiderTracking.RiderTracking.kafka;

import com.RiderTracking.RiderTracking.model.Location;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class LocationConsumer {
    private final SimpMessagingTemplate messagingTemplate;

    public LocationConsumer(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(topics = "rider-location", groupId = "viewer-group")
    public void consume(Location location){
        System.out.println("Received Location : "+ location.getRiderId() + "==>{"
                +location.getLatitude()+" , "+ location.getLongitude()+"}");
        messagingTemplate.convertAndSend("/topic/location", location);
    }

}
