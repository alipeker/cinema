import { MovieQuery } from './../store/movie/movie.query';
import { HttpErrorResponse } from '@angular/common/http';
import { MovieRestService } from './../services/movie-rest.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie, UserRating } from '../store/movie/movie.model';
import { environment } from './../../environments/environment';
import { TokenStorageService } from '../services/token-storage.service';
import { EntityActions } from '@datorama/akita';


@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent {
  selectedUserRating: UserRating;
  movie: Movie | undefined;
  imageEndpoint = environment.imageEndpoint;
  error = '';

  constructor(private route: ActivatedRoute, private movieRestService: MovieRestService, private router: Router,
              private tokenStorageService: TokenStorageService, private movieQuery: MovieQuery) {
    const routeParams = this.route.snapshot.paramMap;
    const movieId = Number(routeParams.get('id'));
    movieRestService.getMovie(movieId).then(movie => {
      if (movie instanceof HttpErrorResponse) {
        this.router.navigate(['/']);
      }
      this.movie = movie;
    });

    movieQuery.selectEntityAction(EntityActions.Update).subscribe(updatedIds => {
      if (this.movie && this.movie.id && this.movie.id === updatedIds[0]) {
        this.movie = movieQuery.getEntity(updatedIds[0]);
      }
    });
    this.selectedUserRating = this.createDefaultUserRating();
  }

  submitComment(userrate: number, comment: string): void {
    this.selectedUserRating.comment = comment;
    this.selectedUserRating.rating = userrate;

    this.movieRestService.submitComment(this.selectedUserRating, (this.movie as Movie).id).then(userRate => {
      this.selectedUserRating = this.createDefaultUserRating();
    }).catch(
      error => {
        this.error = 'You can not submit a comment for a movie.'
      });
  }

  editUserRating(userRating: UserRating): void {
    if (userRating) {
      Object.assign(this.selectedUserRating, userRating);
    }
  }

  createDefaultUserRating(): UserRating {
    return new UserRating(null, '', 1, this.tokenStorageService.getUser(), '');
  }

  createNewUserRating(): void {
    this.selectedUserRating = this.createDefaultUserRating();
  }

}
