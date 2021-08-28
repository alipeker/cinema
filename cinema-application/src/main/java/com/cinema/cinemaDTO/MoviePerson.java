package com.cinema.cinemaDTO;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class MoviePerson extends Person implements Serializable {
    @Enumerated(EnumType.STRING)
    private Profession profession;
}
