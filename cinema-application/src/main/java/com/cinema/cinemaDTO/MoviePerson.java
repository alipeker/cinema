package com.cinema.cinemaDTO;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class MoviePerson extends Person implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column
    private Long id;

    @Enumerated(EnumType.STRING)
    private Profession profession;

    @ManyToMany
    @JoinColumn(name = "person_id")
    private Set<Movie> movie;
}
