import { User } from '../../data/user.model';

export class Movie {
  id: number;
  name: string = "";
  subject: string = "";
  moviePhotos: string[] = [];
  ratingScore: string = "";
  genres: string[] = [];
  duration: string = "";
  year: string = "";
  moviePersons: MoviePerson[] = [];
  userRatings: UserRating[] = [];

  constructor(id: number, name: string, subject: string = "",
  moviePhotos: string[], ratingScore: string,
  genres: string[], duration: string, year: string, moviePersons: MoviePerson[],
  userRatings: UserRating[]) {
    this.id = id;
    this.name = name;
    this.subject = subject;
    this.moviePhotos = moviePhotos;
    this.ratingScore = ratingScore;
    this.genres = genres;
    this.duration = duration;
    this.year = year;
    this.moviePersons = moviePersons;
    this.userRatings = userRatings;
  }

}

export enum Gender {
  Man = "Man",
  Woman = "Woman"
}

export enum Profession {
  Cast = "Cast",
  Writer = "Writer",
  Director = "Director"
}

export abstract class Person {
  id: number | null = 0;
  name: string = "";
  surname: string = "";
  characterName: string = "";
  age = 0;
  gender: Gender = Gender.Man;
  professions: Profession[] = [];
  photos: String[] = [];
}

export class MoviePerson extends Person{
  profession: Profession = Profession.Cast;
}

export class UserRating {
  id: number;
  comment: string;
  rating: number;
  user: User;

  constructor(id: number, comment: string, rating: number, user: User) {
    this.id = id;
    this.comment = comment;
    this.rating = rating;
    this.user = user;
  }
}

export enum ERole {
  ROLE_USER,
  ROLE_MODERATOR,
  ROLE_ADMIN
}

export class Role {
  id: number;
  name: ERole;

  constructor(id: number,name: ERole) {
    this.id = id;
    this.name = name;
  }
}

