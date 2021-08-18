package com.cinema.cinemaDTO;

import lombok.Data;
import javax.persistence.*;

@Entity
@Data
public class MoviePersist {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @Column
    private Long id;

    private String name;
    private String subject;
    private String[] writers;
    private String director;
    private String[] cast;
    private String[] moviePhotos;
    private String ratingScore;
    private String[] genres;
    private String duration;
    private String year;
    private String[] castPhotos;
}
