package com.RiderTracking.RiderTracking.kafka;

import com.RiderTracking.RiderTracking.model.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class LocationProducer {

    private final KafkaTemplate<String, Location> kafkaTemplate;

    public LocationProducer(KafkaTemplate<String, Location> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendLocation(Location location){
        kafkaTemplate.send("rider-location", location);
    }
}
