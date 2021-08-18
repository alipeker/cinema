package com.cinema.cinemaDTO;
import org.mapstruct.Mapper;

@Mapper(
        componentModel = "spring"
)
public interface MapStructMapper {
    MoviePersist movieToPersistMovie(Movie cinema);
    Movie persistMovieToMovie(MoviePersist cinemaPersist);
}
