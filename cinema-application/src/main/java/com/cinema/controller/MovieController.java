package com.cinema.controller;

import com.cinema.cinemaDTO.FileResponse;
import com.cinema.cinemaDTO.Movie;
import com.cinema.cinemaDTO.MapStructMapper;
import com.cinema.cinemaDTO.NonPersistMovie;
import com.cinema.rabbitmq.RabbitMqSender;
import com.cinema.repository.MovieRepository;
import com.cinema.uploadingfiles.FileSystemStorageService;
import com.cinema.uploadingfiles.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

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

    @GetMapping(value= "/uploads/{filename:.+}", produces = MediaType.IMAGE_JPEG_VALUE)
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
    public FileResponse uploadFile(@RequestParam("image") MultipartFile file) {
        String name = storageService.store(file);

        String uri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/movie/uploads/")
                .path(name)
                .toUriString();

        return new FileResponse(name, "/movie/uploads/"+name, file.getContentType(), file.getSize());
    }

}
