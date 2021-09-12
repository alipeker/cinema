import { UserRating } from '../store/movie/movie.model';
import { Component, Input, OnInit } from '@angular/core';
import { User } from '../data/user.model';

@Component({
  selector: 'app-user-comment',
  templateUrl: './user-comment.component.html',
  styleUrls: ['./user-comment.component.scss']
})
export class UserCommentComponent implements OnInit {
  @Input() userRating: UserRating;

  constructor() {
  }

  ngOnInit(): void {
    
  }

}
