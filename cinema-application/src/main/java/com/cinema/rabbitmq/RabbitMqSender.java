package com.cinema.rabbitmq;

import com.cinema.cinemaDTO.Operation;
import com.cinema.cinemaDTO.RabbitmqObject;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.core.RabbitMessagingTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.stereotype.Service;

@Service
public class RabbitMqSender {

    @Autowired
    private RabbitMessagingTemplate rabbitMessagingTemplate;

    @Autowired
    private MappingJackson2MessageConverter mappingJackson2MessageConverter;

    public void sendToRabbitmq(Operation operation, Object movie) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            RabbitmqObject rabbitmqObject = new RabbitmqObject(operation, movie);
            this.rabbitMessagingTemplate.convertAndSend("cinema", "frame", mapper.writeValueAsString(rabbitmqObject));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

}
