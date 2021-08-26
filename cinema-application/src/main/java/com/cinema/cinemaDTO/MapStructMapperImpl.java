package com.cinema.cinemaDTO;

import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class MapStructMapperImpl implements MapStructMapper {
    private String name;
    private String subject;
    private Set<String> writers;
    private String director;
    private String cast;
    private Set<String> moviePhotos;
    private String ratingScore;
    private Set<String> genres;
    private String duration;
    private String year;
    private Set<String> castPhotos;

    @Override
    public Movie nonPersistMovieToPersistMovie(NonPersistMovie nonPersistMovie) {
        Movie movie = new Movie();
        movie.setName(nonPersistMovie.getName());
        movie.setSubject(nonPersistMovie.getSubject());
        movie.setMoviePhotos(nonPersistMovie.getMoviePhotos());
        movie.setRatingScore(nonPersistMovie.getRatingScore());
        movie.setGenres(nonPersistMovie.getGenres());
        movie.setDuration(nonPersistMovie.getDuration());
        movie.setYear(nonPersistMovie.getYear());
        movie.setMoviePersons(nonPersistMovie.getMoviePersons());
        return movie;
    }

    @Override
    public NonPersistMovie persistMovieToNonPersistMovie(Movie movie) {
        NonPersistMovie nonPersistMovie = new NonPersistMovie();
        nonPersistMovie.setName(movie.getName());
        nonPersistMovie.setSubject(movie.getSubject());
        nonPersistMovie.setMoviePhotos(movie.getMoviePhotos());
        nonPersistMovie.setRatingScore(movie.getRatingScore());
        nonPersistMovie.setGenres(movie.getGenres());
        nonPersistMovie.setDuration(movie.getDuration());
        nonPersistMovie.setYear(movie.getYear());
        nonPersistMovie.setMoviePersons(movie.getMoviePersons());
        return nonPersistMovie;
    }
}
