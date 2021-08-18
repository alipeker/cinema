package com.cinema.cinemaDTO;

import org.springframework.stereotype.Component;

@Component
public class MapStructMapperImpl implements MapStructMapper {
    private String name;
    private String subject;
    private String[] writers;
    private String director;
    private String cast;
    private String[] moviePhotos;
    private String ratingScore;
    private String[] genres;
    private String duration;
    private String year;
    private String[] castPhotos;

    @Override
    public MoviePersist movieToPersistMovie(Movie cinema) {
        MoviePersist cinemaPersist = new MoviePersist();
        cinemaPersist.setName(cinema.getName());
        cinemaPersist.setSubject(cinema.getSubject());
        cinemaPersist.setWriters(cinema.getWriters());
        cinemaPersist.setDirector(cinema.getDirector());
        cinemaPersist.setCast(cinema.getCast());
        cinemaPersist.setMoviePhotos(cinema.getMoviePhotos());
        cinemaPersist.setRatingScore(cinema.getRatingScore());
        cinemaPersist.setGenres(cinema.getGenres());
        cinemaPersist.setDuration(cinema.getDuration());
        cinemaPersist.setYear(cinema.getYear());
        cinemaPersist.setCastPhotos(cinema.getCastPhotos());
        return cinemaPersist;
    }

    @Override
    public Movie persistMovieToMovie(MoviePersist cinemaPersist) {
        Movie cinema = new Movie();
        cinema.setName(cinemaPersist.getName());
        cinema.setSubject(cinemaPersist.getSubject());
        cinema.setWriters(cinemaPersist.getWriters());
        cinema.setDirector(cinemaPersist.getDirector());
        cinema.setCast(cinemaPersist.getCast());
        cinema.setMoviePhotos(cinemaPersist.getMoviePhotos());
        cinema.setRatingScore(cinemaPersist.getRatingScore());
        cinema.setGenres(cinemaPersist.getGenres());
        cinema.setDuration(cinemaPersist.getDuration());
        cinema.setYear(cinemaPersist.getYear());
        cinema.setCastPhotos(cinemaPersist.getCastPhotos());
        return cinema;
    }
}
