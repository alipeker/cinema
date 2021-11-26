package com.cinema.repository;

import com.cinema.cinemaDTO.Movie;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface MovieRepository extends CrudRepository<Movie, Long> {
    @Query(value = "select * from movie order by user_rating desc limit 10", nativeQuery = true)
    Set<Movie> getMostRatingMovies();
}
