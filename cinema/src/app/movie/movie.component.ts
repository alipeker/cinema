import { HttpErrorResponse } from '@angular/common/http';
import { MovieRestService } from './../services/movie-rest.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie, UserRating } from '../store/movie/movie.model';
import { environment } from './../../environments/environment';
import { TokenStorageService } from '../services/token-storage.service';
import { v4 as uuid } from 'uuid';


@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent {
  movie: Movie | undefined;
  imageEndpoint = environment.imageEndpoint;

  constructor(private route: ActivatedRoute, private movieRestService: MovieRestService,
    private router: Router, private tokenStorageService: TokenStorageService) {
    const routeParams = this.route.snapshot.paramMap;
    const movieId = Number(routeParams.get('id'));
    movieRestService.getMovie(movieId).then(movie => {
      if(movie instanceof HttpErrorResponse) {
        this.router.navigate(['/']);
      }
      this.movie = movie;
    });
  }

  submitComment(userrate: number, comment: string): void {
    const userrating = new UserRating(uuid(), comment, userrate, this.tokenStorageService.getUser());
    this.movieRestService.submitComment(userrating, (this.movie as Movie).id);
  }

}
