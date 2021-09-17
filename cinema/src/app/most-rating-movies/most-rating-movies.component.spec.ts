import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostRatingMoviesComponent } from './most-rating-movies.component';

describe('MostRatingMoviesComponent', () => {
  let component: MostRatingMoviesComponent;
  let fixture: ComponentFixture<MostRatingMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostRatingMoviesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MostRatingMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
