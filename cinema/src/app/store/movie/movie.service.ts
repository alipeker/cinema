import { MovieQuery } from './movie.query';
import { Injectable } from "@angular/core";
import { Movie, UserRating } from "./movie.model";
import { MovieStore } from "./movie.store";
import { arrayAdd, arrayRemove, arrayUpsert, ID } from '@datorama/akita';

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

  addComment(movieId: number, newUserRating: UserRating) {
    this.movieStore.update(movieId, ({ userRatings }) => ({
      userRatings: arrayAdd(userRatings, newUserRating)
    }));
  }

  removeComment(movieId: number, removedUserId: string) {
    this.movieStore.update(movieId, ({ userRatings }) => ({
      userRatings: arrayRemove(userRatings, removedUserId)
    }));
  }

  updateComment(movieId: number, updatedUserRating: UserRating) {
    this.movieStore.update(movieId, ({ userRatings }) => ({
      userRatings: arrayUpsert(userRatings, updatedUserRating.id as ID, updatedUserRating)
    }));
  }

}
