import { environment } from './../../environments/environment';
import { Movie } from './../store/movie/movie.model';
import { MovieRestService } from './../services/movie-rest.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { moviePersons } from './static-person.data';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

export enum UPLOADMODE {
  'CREATE',
  'UPDATE'
}

@Component({
  selector: 'app-upload-movie',
  templateUrl: './upload-movie.component.html',
  styleUrls: ['./upload-movie.component.scss']
})
export class UploadMovieComponent implements OnInit {
  @ViewChild('moviePhotoFile', {static: true}) moviePhotoFile: ElementRef;
  movieForm: FormGroup;
  uploadedImageUrl = '';
  movie: Movie = new Movie(0, '', '', [], '', [], '', '', [], [], 0);
  mode: UPLOADMODE = UPLOADMODE.CREATE;
  errorMessage = '';
  successMessage = '';
  
  constructor(private form: FormBuilder, private movieRestService: MovieRestService,
              private route: ActivatedRoute, private router: Router) {
    this.movieForm = this.form.group({
      id: new FormData(),
      name: new FormControl(''),
      subject: new FormControl(''),
      duration: new FormControl(''),
      year: new FormControl(''),
      genres: new FormControl(''),
      moviePhotos: new FormControl(''),
      ratingScore: new FormControl(''),
      moviePersons: new FormData()
    });

    const snapShot = this.route.snapshot;
    const routeParams = snapShot.paramMap;
    if(routeParams.has('id') && (snapShot.routeConfig?.path === 'update')) {
      this.mode = UPLOADMODE.UPDATE;
      const movieId = Number(routeParams.get('id'));

      movieRestService.getMovie(movieId).then(movie => {
        if(movie instanceof HttpErrorResponse) {
          this.router.navigate(['/']);
        }
        this.movie = movie;
        this.uploadedImageUrl = environment.imageEndpoint + this.movie.moviePhotos[0];
        this.moviePhotoFile.nativeElement.src = movie.moviePhotos[0];
        this.movieForm.setValue({
          id: movie.id,
          name: movie.name,
          subject: movie.subject,
          duration: movie.duration,
          year: movie.year,
          genres: movie.genres,
          moviePhotos: movie.moviePhotos,
          ratingScore: movie.ratingScore,
          moviePersons: movie.moviePersons
        });
      });
    }
  }

  ngOnInit(): void {
  }

  uploadImage() {
    this.movieRestService.uploadMovieImage(this.moviePhotoFile.nativeElement.files[0]).then(fileResponse => {
      this.uploadedImageUrl = environment.imageEndpoint + fileResponse.uri;
      this.movieForm.patchValue({
        moviePhotos: [fileResponse.uri]
      });
    });
  }

  createUpdateMovie() {
    const movieCopy = JSON.parse(JSON.stringify(this.movieForm.value)) as Movie;
    movieCopy.genres = (typeof this.movieForm.value.genres === 'string') ? this.movieForm.value.genres.split(' ') : this.movieForm.value.genres;

    if(this.mode === UPLOADMODE.CREATE) {
      movieCopy.id = 0;
      movieCopy.moviePersons = moviePersons;
      this.movieRestService.createMovie(movieCopy).then(
        movie => {
          this.successMessage = 'Movie has been successfully uploaded.';
          this.errorMessage = '';
        }
      ).catch(error => {
        this.errorMessage = 'Movie has been cannot be uploaded.';
        return error;
      });
    } else {
      this.movieRestService.updateMovie(movieCopy).then(
        movie => {
          this.successMessage = 'Movie has been successfully updated.';
          this.errorMessage = '';
        }
      ).catch(error => {
        this.errorMessage = 'Movie has been cannot be updated.';
        return error;
      });
    }
  }

}
