package com.cinema.cinemaDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RabbitmqObject {
    private Operation operation;
    private Object message;
}
