import { MovieService } from './../store/movie/movie.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from '../store/movie/movie.model';
import { FileResponse } from '../data/file-response.data';

@Injectable({
  providedIn: 'root'
})
export class MovieRestService {

  constructor(private http: HttpClient, private movieService: MovieService) {
    this.getMovies();
  }

  async getMovies(): Promise<Movie[]> {
    return await this.http.get<Movie[]>("/proxy/movie/getMovies").toPromise().then(
      movies => {
        this.movieService.setMovies(movies);
        return movies;
      }
    ).catch(error => {
      return error;
    });
  }

  async getMovie(movieId: number): Promise<Movie> {
    return await this.http.get<Movie>("/proxy/movie/getMovie/" + movieId).toPromise().then(
      movie => {
        return movie;
      }
    ).catch(error => {
      return error;
    });
  }

  async deleteMovie(movieId: number): Promise<Movie[]> {
    return this.http.delete('/proxy/movie/deleteMovie/' + movieId).toPromise().then(
      movie => {
        this.movieService.delete(movieId);
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
   
    return this.http
        .post<any>('/proxy/file/blobs/', formData, {headers}).toPromise();
  }

  async getMovieImage(name: string): Promise<any> {
    return await this.http.get<any>("/proxy/file/blobs/253").toPromise();
  }

  arrayBufferToBase64(buffer: ArrayBuffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }

}
