import { Injectable } from "@angular/core";
import { Movie } from "./movie.model";
import { MovieStore } from "./movie.store";

@Injectable({ providedIn: "root" })
export class MovieService {

  constructor(private movieStore: MovieStore) {}

  add(movie: Movie) {
    this.movieStore.add(movie);
  }

  setMovies(movies: Movie[]) {
    this.movieStore.set(movies);
  }

  delete(id: number) {
    this.movieStore.remove(id);
  }

  update(movie: Movie) {
    this.movieStore.update(movie);
  }

}
