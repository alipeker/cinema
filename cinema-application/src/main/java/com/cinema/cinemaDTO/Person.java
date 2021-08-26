package com.cinema.cinemaDTO;

import lombok.Data;

import javax.persistence.*;
import java.util.Set;

@Data
public abstract class Person {
    private String name;
    private String surname;
    private String characterName;
    private Long age;
    @Enumerated(EnumType.STRING)
    private Gender gender;
    private Set<Profession> professions;
    private Set<String> photos;
}
