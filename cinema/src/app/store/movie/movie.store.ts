import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Movie } from './movie.model';

export interface MovieState extends EntityState<Movie, number> {}

const initialState = {  };

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'movie' })
export class MovieStore extends EntityStore<MovieState> {
  constructor() {
    super(initialState);
  }
}
