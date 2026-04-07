package com.RiderTracking.RiderTracking.controller;


import com.RiderTracking.RiderTracking.kafka.LocationProducer;
import com.RiderTracking.RiderTracking.model.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/location")
public class LocationController {

    @Autowired
    private LocationProducer locationProducer;

    @PostMapping
    public ResponseEntity<?> sendLocation(@RequestBody Location location){
        locationProducer.sendLocation(location);
        return ResponseEntity.ok("Location sent to kafka");
    }
}
