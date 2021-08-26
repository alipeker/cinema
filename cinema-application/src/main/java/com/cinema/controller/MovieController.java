package com.cinema.controller;

import com.cinema.cinemaDTO.Movie;
import com.cinema.cinemaDTO.MapStructMapper;
import com.cinema.cinemaDTO.NonPersistMovie;
import com.cinema.rabbitmq.RabbitMqSender;
import com.cinema.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("movie")
public class MovieController {
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private MapStructMapper mapStructMapper;
    @Autowired
    private RabbitMqSender rabbitMqSender;

    @GetMapping("/getMovies")
    public ResponseEntity<Iterable<Movie>> getMovies() {
        return new ResponseEntity<>(movieRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/getMovie/{id}")
    public ResponseEntity<Movie> getMovie(@PathVariable("id") Long id) {
        return new ResponseEntity<Movie>(movieRepository.findById(id).get(), HttpStatus.OK);
    }

    @PostMapping("/createMovie")
    public ResponseEntity<Movie> createMovie(@RequestBody NonPersistMovie movie) throws Exception {
        Movie savedMovie = movieRepository.save(mapStructMapper.nonPersistMovieToPersistMovie(movie));
        this.rabbitMqSender.sendToRabbitmq(savedMovie);
        return new ResponseEntity<>(savedMovie, HttpStatus.CREATED);
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
    public ResponseEntity<Movie> cloneMovie(@RequestParam("id") Long id) {
        try{
            NonPersistMovie nonPersistMovie = mapStructMapper.persistMovieToNonPersistMovie(movieRepository.findById(id).get());
            nonPersistMovie.setId(null);
            Movie cloneMovie = movieRepository.save(mapStructMapper.nonPersistMovieToPersistMovie(nonPersistMovie));
            return new ResponseEntity<Movie>(cloneMovie, HttpStatus.OK);
        } catch (Exception  e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/updateMovie")
    public ResponseEntity<Movie> updateMovie(@RequestBody Movie cinema) {
        Movie updatedMovie = movieRepository.save(cinema);
        return new ResponseEntity<>(updatedMovie, HttpStatus.OK);
    }

}
