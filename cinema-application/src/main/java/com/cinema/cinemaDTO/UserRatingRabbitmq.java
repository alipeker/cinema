package com.cinema.cinemaDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserRatingRabbitmq {
    RabbitmqObject rabbitmqObject;
    Long movieid;
}
