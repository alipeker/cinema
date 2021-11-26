import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-rating',
  templateUrl: './user-rating.component.html',
  styleUrls: ['./user-rating.component.scss']
})
export class UserRatingComponent implements OnInit {
  @Input() static = true;
  @Input() ratingScore = 1;

  ratingScores = [1,2,3,4,5,6,7,8,9,10];

  constructor() { }

  ngOnInit(): void {
  }

  changeSelectedRate(rate: number): void {
    if(!this.static) {
      this.ratingScore = rate;
    }
  }

}
