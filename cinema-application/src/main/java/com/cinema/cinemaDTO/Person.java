package com.cinema.cinemaDTO;

import lombok.Data;

import javax.persistence.*;
import java.util.Set;

@Entity
@Data
public abstract class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column
    private Long id;

    private String name;
    private String surname;
    private String characterName;
    private Long age;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<Profession> professions;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> photos;
}
