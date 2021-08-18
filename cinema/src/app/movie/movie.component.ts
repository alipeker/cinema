import { HttpErrorResponse } from '@angular/common/http';
import { MovieRestService } from './../services/movie-rest.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../store/movie/movie.model';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent {
  movie: Movie | undefined;

  constructor(private route: ActivatedRoute, private movieRestService: MovieRestService,
    private router: Router) {
    const routeParams = this.route.snapshot.paramMap;
    const movieId = Number(routeParams.get('id'));
    movieRestService.getMovie(movieId).then(movie => {
      if(movie instanceof HttpErrorResponse) {
        this.router.navigate(['/']);
      }
      this.movie = movie;
    });
  }

}
