import { MovieRestService } from './../services/movie-rest.service';
import { UserRating } from './../store/movie/movie.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
@Component({
  selector: 'app-user-comment',
  templateUrl: './user-comment.component.html',
  styleUrls: ['./user-comment.component.scss']
})
export class UserCommentComponent implements OnInit {
  @Output() editUserRatingEvent = new EventEmitter<UserRating>();
  @Input() userRating: UserRating;
  @Input() movieId: number;

  constructor(private movieRestService: MovieRestService, private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
  }

  editComment(): void {
    this.editUserRatingEvent.emit(this.userRating);
  }

  deleteComment(): void {
    this.movieRestService.deleteComment(this.userRating, this.movieId);
  }

  isUserHasThisRating(): boolean {
    return this.tokenStorageService.getUser().username === this.userRating.user.username;  
  }

}
