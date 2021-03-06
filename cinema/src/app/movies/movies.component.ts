import { environment } from './../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { MovieRestService } from './../services/movie-rest.service';
import { Component, OnInit } from '@angular/core';
import { MovieQuery } from '../store/movie/movie.query';
import { Movie } from '../store/movie/movie.model';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];
  errorMessage = '';

  constructor(private moviesRestService: MovieRestService, private movieQuery: MovieQuery) { }

  ngOnInit(): void {
    this.movieQuery.selectAll().subscribe(movies => {
      this.movies = movies;
    });

    this.getMovies();
  }

  getMovies(): void {
    this.moviesRestService.getMovies().then(movies => {
      if (movies instanceof HttpErrorResponse) {
        this.errorMessage = movies.status + ' ' + movies.statusText;
        return;
      }
      this.movies = movies;
    });
  }

  async deleteMovie(movieId: number): Promise<void> {
    await this.moviesRestService.deleteMovie(movieId);
  }

  getSource(name: string): string {
    return environment.imageEndpoint + name;
  }

}
