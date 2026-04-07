package com.RiderTracking.RiderTracking.kafka;


import com.RiderTracking.RiderTracking.model.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class EmergencyAlertConsumer {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Base location to compare distance from (e.g., origin/hub)
    private static final double BASE_LAT = 17.441026;
    private static final double BASE_LON = 78.391635;
    private static final double MAX_DISTANCE_KM = 1; // Threshold distance

    @KafkaListener(topics = "rider-location", groupId = "alert-group")
    public void consume(Location location) {
        double distance = calculateDistance(BASE_LAT, BASE_LON, location.getLatitude(), location.getLongitude());

        if (distance > MAX_DISTANCE_KM) {
            String alertMessage = "⚠️ Rider " + location.getRiderId() +
                    " is moving away (Radius: " + String.format("%.2f", distance) + " km)";

            System.out.println("ALERT TRIGGERED: " + alertMessage);
            messagingTemplate.convertAndSend("/topic/alerts", alertMessage);
        }
    }

    // Haversine formula to calculate distance between two lat/lon points
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the Earth in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon/2) * Math.sin(dLon/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }
}

