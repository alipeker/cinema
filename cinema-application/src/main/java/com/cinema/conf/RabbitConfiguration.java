package com.cinema.conf;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.core.RabbitMessagingTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;

@Configuration
public class RabbitConfiguration {
    @Autowired
    private RabbitMessagingTemplate rabbitMessagingTemplate;

    @Bean
    Queue queueMessage() {
        return new Queue("movie", true);
    }

    @Bean
    DirectExchange exchange() {
            return new DirectExchange("cinema");
    }

    @Bean
    Binding bindingExchangeMessage(Queue queueMessage, DirectExchange exchange) {
        return BindingBuilder.bind(queueMessage).to(exchange).with("frame");
    }

    @Bean
    public MappingJackson2MessageConverter jackson2Converter() {
        MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
        return converter;
    }

}

