import { UserRating } from './../store/movie/movie.model';
import { MovieService } from './../store/movie/movie.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from '../store/movie/movie.model';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class MovieRestService {

  constructor(private http: HttpClient, private movieService: MovieService) {
    this.getMovies();
  }

  async getMovies(): Promise<Movie[]> {
    return await this.http.get<Movie[]>('/proxy/movie/getMovies').toPromise().then(
      movies => {
        this.movieService.setMovies(movies);
        return movies;
      }
    ).catch(error => {
      return error;
    });
  }

  async getMovie(movieId: number): Promise<Movie> {
    return await this.http.get<Movie>('/proxy/movie/getMovie/' + movieId).toPromise().then(
      movie => {
        movie.moviePhotos[0] = movie.moviePhotos[0];
        return movie;
      }
    ).catch(error => {
      return error;
    });
  }

  async deleteMovie(movieId: number): Promise<Movie[]> {
    return await this.http.delete('/proxy/movie/deleteMovie/' + movieId).toPromise().then(
      movie => {
      }
    ).catch(error => {
      return error;
    });
  }

  async uploadMovieImage(image: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', image);
    let headers = new HttpHeaders();
    headers = headers.append('enctype', 'multipart/form-data');   
    return await this.http.post<any>('/proxy/file/uploadImage/', formData, {headers}).toPromise();
  }

  async createMovie(movie: Movie): Promise<Movie[]> {
    return await this.http.post<Movie[]>('/proxy/movie/createMovie/', movie).toPromise();
  }

  async updateMovie(movie: Movie): Promise<Movie[]> {
    return await this.http.put<Movie[]>('/proxy/movie/updateMovie/', movie).toPromise();
  }

  async submitComment(userRating: UserRating, movieId: number): Promise<any> {
    if (!userRating.id) {
      userRating.id = uuid();
      return await this.http.post<any>('/proxy/movie/rating/' + movieId, userRating).toPromise();
    }
    return await this.http.put<any>('/proxy/movie/rating/' + movieId, userRating).toPromise();
  }

  async deleteComment(userRating: UserRating, movieId: number): Promise<any> {
    return await this.http.request<any>('delete', '/proxy/movie/rating/' + movieId, {body: userRating}).toPromise();
  }

  async getMostRatingMovies(): Promise<Movie[]> {
    return await this.http.get<Movie[]>('/proxy/movie/getMostRatingMovies').toPromise();
  }

}
