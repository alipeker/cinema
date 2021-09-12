import { MovieQuery } from './movie.query';
import { Injectable } from "@angular/core";
import { Movie } from "./movie.model";
import { MovieStore } from "./movie.store";

@Injectable({ providedIn: "root" })
export class MovieService {

  constructor(private movieStore: MovieStore, private query: MovieQuery) {}

  add(movie: Movie) {
    this.movieStore.upsert(movie.id, movie);
  }

  setMovies(movies: Movie[]) {
    this.movieStore.set(movies);
  }

  delete(mid: number) {
    this.movieStore.remove(mid);
  }

  update(movie: Movie) {
    this.movieStore.upsert(movie.id, movie);
  }

  addComment(movie: Movie) {
    this.movieStore.upsert(movie.id, movie);
  }

}
