import { environment } from './../../environments/environment';
import { MovieRestService } from './../services/movie-rest.service';
import { Component, OnInit } from '@angular/core';
import { Movie } from '../store/movie/movie.model';

@Component({
  selector: 'app-most-rating-movies',
  templateUrl: './most-rating-movies.component.html',
  styleUrls: ['./most-rating-movies.component.scss']
})
export class MostRatingMoviesComponent implements OnInit {
  movies: Movie[];
  imageEndpoint = environment.imageEndpoint;

  constructor(private movieRestService: MovieRestService) {
  }

  ngOnInit(): void {
    this.movieRestService.getMostRatingMovies().then(movies => {
      this.movies = movies;
    })
  }

  getImageUrl(moviePhotoUrl): string {
    return this.imageEndpoint + moviePhotoUrl;
  }

}
