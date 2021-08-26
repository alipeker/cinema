package com.cinema.cinemaDTO;
import org.mapstruct.Mapper;

@Mapper(
        componentModel = "spring"
)
public interface MapStructMapper {
    Movie nonPersistMovieToPersistMovie(NonPersistMovie cinema);
    NonPersistMovie persistMovieToNonPersistMovie(Movie cinemaPersist);
}
