package com.cinema.cinemaDTO;
import lombok.Data;

import java.io.Serializable;

@Data
public class Movie implements Serializable {
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
