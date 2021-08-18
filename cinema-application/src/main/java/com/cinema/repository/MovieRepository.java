package com.cinema.repository;

import com.cinema.cinemaDTO.MoviePersist;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieRepository extends CrudRepository<MoviePersist, Long> {
}
