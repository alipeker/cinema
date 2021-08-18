package com.cinema.controller;

import com.cinema.cinemaDTO.Movie;
import com.cinema.cinemaDTO.MoviePersist;
import com.cinema.cinemaDTO.MapStructMapper;
import com.cinema.rabbitmq.RabbitMqSender;
import com.cinema.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class MovieController {
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private MapStructMapper mapStructMapper;
    @Autowired
    private RabbitMqSender rabbitMqSender;

    @GetMapping("/getMovies")
    public ResponseEntity<Iterable<MoviePersist>> getMovies() {
        return new ResponseEntity<>(movieRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/getMovie/{id}")
    public ResponseEntity<MoviePersist> getMovie(@PathVariable("id") Long id) {
        return new ResponseEntity<MoviePersist>(movieRepository.findById(id).get(), HttpStatus.OK);
    }

    @PostMapping("/createMovie")
    public ResponseEntity<MoviePersist> createMovie(@RequestBody Movie movie) throws Exception {
        MoviePersist savedCinema = movieRepository.save(mapStructMapper.movieToPersistMovie(movie));
        this.rabbitMqSender.sendToRabbitmq(savedCinema);
        return new ResponseEntity<>(savedCinema, HttpStatus.CREATED);
    }

    @DeleteMapping(value = "/deleteMovie/{id}")
    public ResponseEntity<HttpStatus> deleteMovie(@PathVariable("id") Long id) {
        try{
            movieRepository.delete(movieRepository.findById(id).get());
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception  e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/cloneMovie")
    public ResponseEntity<MoviePersist> cloneMovie(@RequestParam("id") Long id) {
        try{
            Movie cinema = mapStructMapper.persistMovieToMovie(movieRepository.findById(id).get());
            cinema.setId(null);
            MoviePersist cloneCinema = movieRepository.save(mapStructMapper.movieToPersistMovie(cinema));
            return new ResponseEntity<MoviePersist>(cloneCinema, HttpStatus.OK);
        } catch (Exception  e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/updateMovie")
    public ResponseEntity<MoviePersist> updateMovie(@RequestBody MoviePersist cinema) {
        MoviePersist updatedMovie = movieRepository.save(cinema);
        return new ResponseEntity<>(updatedMovie, HttpStatus.OK);
    }

}
