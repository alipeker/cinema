import { MovieService } from './../store/movie/movie.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from '../store/movie/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieRestService {

  constructor(private http: HttpClient, private movieService: MovieService) {
    this.getMovies();
  }

  async getMovies(): Promise<Movie[]> {
    return await this.http.get<Movie[]>("/proxy/getMovies").toPromise().then(
      movies => {
        this.movieService.setMovies(movies);
        return movies;
      }
    ).catch(error => {
      return error;
    });
  }

  async getMovie(movieId: number): Promise<Movie> {
    return await this.http.get<Movie>("/proxy/getMovie/" + movieId).toPromise().then(
      movie => {
        return movie;
      }
    ).catch(error => {
      return error;
    });
  }

  async deleteMovie(movieId: number): Promise<Movie[]> {
    return this.http.delete('/proxy/deleteMovie/' + movieId).toPromise().then(
      movie => {
        this.movieService.delete(movieId);
      }
    ).catch(error => {
      return error;
    });
  }

}
