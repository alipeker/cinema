package com.cinema.cinemaDTO;

import lombok.Data;
import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

@Entity
@Data
public class Movie implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column
    private Long id;

    private String name;

    private String subject;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> moviePhotos;

    private String ratingScore;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> genres;

    private String duration;

    private String year;

    @ManyToMany(cascade=CascadeType.ALL, targetEntity=MoviePerson.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "movie_id")
    private Set<MoviePerson> moviePersons;
}
