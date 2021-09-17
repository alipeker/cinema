package com.cinema.controller;

import com.cinema.cinemaDTO.*;
import com.cinema.rabbitmq.RabbitMqSender;
import com.cinema.repository.MovieRepository;
import com.cinema.uploadingfiles.FileSystemStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("movie")
public class MovieController {
    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private MapStructMapper mapStructMapper;

    @Autowired
    private RabbitMqSender rabbitMqSender;

    private FileSystemStorageService storageService;

    @Autowired
    public MovieController(FileSystemStorageService storageService) {
        this.storageService = storageService;
    }

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
        this.rabbitMqSender.sendToRabbitmqMovie(Operation.CREATE, savedMovie);
        return new ResponseEntity<>(savedMovie, HttpStatus.CREATED);
    }

    @DeleteMapping(value = "/deleteMovie/{id}")
    public ResponseEntity<HttpStatus> deleteMovie(@PathVariable("id") Long id) {
        try{
            movieRepository.delete(movieRepository.findById(id).get());
            this.rabbitMqSender.sendToRabbitmqMovie(Operation.DELETE, id);
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
        this.rabbitMqSender.sendToRabbitmqMovie(Operation.UPDATE, mapStructMapper.persistMovieToNonPersistMovie(updatedMovie));
        return new ResponseEntity<>(updatedMovie, HttpStatus.OK);
    }

    @GetMapping(value= "/uploads/{filename:.+}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_GIF_VALUE})
    @ResponseBody
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        Resource resource = storageService.loadAsResource(filename);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PostMapping("/uploadImage")
    @ResponseBody
    public FileResponse uploadFile(@RequestParam("file") MultipartFile file) {
        String filename = UUID.randomUUID().toString()+".png";
        String name = storageService.store(file, filename);

        return new FileResponse(name, "/img/"+filename, file.getContentType(), file.getSize());
    }

    @PostMapping("/rating/{id}")
    @ResponseBody
    public ResponseEntity createMovieRating(@RequestBody UserRating userRating, @PathVariable("id") Long id) {
        Movie movie = movieRepository.findById(id).get();
        String currentDate = new SimpleDateFormat("HH.mm dd.MM.yyyy").format(new Date());
        userRating.setDate((currentDate));
        movie.addUserRating(userRating);
        try {
            movieRepository.save(movie);
            this.rabbitMqSender.sendToRabbitmqComment(Operation.CREATE, movie.getUserRatingById(userRating.getId()), id);
        } catch (InvalidDataAccessApiUsageException e) {
            return new ResponseEntity<String>(e.getMessage().toString(), HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e) {
            return new ResponseEntity<String>(e.getMessage().toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PreAuthorize("isMemberHas(#userRating, authentication.principal.username)")
    @PutMapping("/rating/{id}")
    @ResponseBody
    public ResponseEntity updateMovieRating(@RequestBody UserRating userRating, @PathVariable("id") Long id) {
        Movie movie = movieRepository.findById(id).get();
        String currentDate = new SimpleDateFormat("HH.mm dd.MM.yyyy").format(new Date());
        userRating.setDate(currentDate);
        movie.updateUserRating(userRating);
        movieRepository.save(movie);
        this.rabbitMqSender.sendToRabbitmqComment(Operation.UPDATE, userRating, id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("isMemberHas(#userRating, authentication.principal.username)")
    @DeleteMapping("/rating/{id}")
    @ResponseBody
    public ResponseEntity deleteMovieRating(@RequestBody UserRating userRating, @PathVariable("id") Long id) {
        Movie movie = movieRepository.findById(id).get();
        movie.deleteUserRating(userRating.getId());
        movieRepository.save(movie);
        this.rabbitMqSender.sendToRabbitmqComment(Operation.DELETE, userRating, id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getMostRatingMovies")
    public ResponseEntity<Set<Movie>> getMostRatingMovies() {
        return new ResponseEntity<>(movieRepository.getMostRatingMovies(), HttpStatus.OK);
    }

}
