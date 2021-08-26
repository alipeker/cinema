package com.cinema.cinemaDTO;

import lombok.Data;

import java.io.Serializable;
import java.util.Set;

@Data
public class NonPersistMovie implements Serializable {
    private Long id;
    private String name;
    private String subject;
    private Set<String> moviePhotos;
    private String ratingScore;
    private Set<String> genres;
    private String duration;
    private String year;
    private Set<MoviePerson> moviePersons;
}
