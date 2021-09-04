import { MovieRestService } from './../services/movie-rest.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-upload-movie',
  templateUrl: './upload-movie.component.html',
  styleUrls: ['./upload-movie.component.scss']
})
export class UploadMovieComponent implements OnInit {
  @ViewChild('moviePhoto', {static: true}) moviePhoto: ElementRef;
  movieForm: FormGroup;
  uploadedImage;
  
  constructor(private form: FormBuilder, private movieRestService: MovieRestService,
    private _sanitizer: DomSanitizer) {
    this.movieForm = this.form.group({
      mname: new FormControl(''),
      mdescription: new FormControl(''),
      mduration: new FormControl(''),
      myear: new FormControl(''),
      mgenres: new FormControl(''),
      moviePhoto: new FormControl(''),
      mrating: new FormControl('')
    });
  }

  ngOnInit(): void {

  }

  uploadImage() {
    // this.movieRestService.uploadMovieImage(this.moviePhoto.nativeElement.files[0]).then(fileResponse => {
    //     console.log(fileResponse)
    // });

    this.movieRestService.getMovieImage("a").then(e => {
      console.log('fsdfds')
      this.uploadedImage = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
      + e.base64string);
    });
  }

  uploadMovie() {
    
  }

}
