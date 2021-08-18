package com.cinema.rabbitmq;

import com.cinema.cinemaDTO.Movie;
import com.cinema.cinemaDTO.MoviePersist;
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

    public void sendToRabbitmq(MoviePersist movie) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            this.rabbitMessagingTemplate.convertAndSend("cinema", "frame", mapper.writeValueAsString(movie));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

}
