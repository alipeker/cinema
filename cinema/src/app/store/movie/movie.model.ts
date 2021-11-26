import { RabbitmqObject } from './../../data/rabbitmq-object.data';
import { User } from '../../data/user.model';

export class Movie {
  id: number;
  name: string = '';
  subject: string = '';
  moviePhotos: string[] = [];
  ratingScore: string = '';
  genres: string[] = [];
  duration: string = '';
  year: string = '';
  moviePersons: MoviePerson[] = [];
  userRatings: UserRating[] = [];
  userRating: number;

  constructor(id: number, name: string, subject: string = '',
  moviePhotos: string[], ratingScore: string,
  genres: string[], duration: string, year: string, moviePersons: MoviePerson[],
  userRatings: UserRating[], userRating: number) {
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
    this.userRating = userRating
  }

}

export enum Gender {
  Man = 'Man',
  Woman = 'Woman'
}

export enum Profession {
  Cast = 'Cast',
  Writer = 'Writer',
  Director = 'Director'
}

export abstract class Person {
  id: number | null = 0;
  name: string = '';
  surname: string = '';
  characterName: string = '';
  age = 0;
  gender: Gender = Gender.Man;
  professions: Profession[] = [];
  photos: String[] = [];
}

export class MoviePerson extends Person{
  profession: Profession = Profession.Cast;
}

export class UserRating {
  id: string | null;
  comment: string;
  rating: number;
  user: User;
  date: string;

  constructor(id: string | null, comment: string, rating: number, user: User, date: string) {
    this.id = id;
    this.comment = comment;
    this.rating = rating;
    this.user = user;
    this.date = date;
  }
}

export class UserRatingRabbitmq {
  rabbitmqObject: RabbitmqObject;
  movieid: number;

  constructor(rabbitmqObject: RabbitmqObject, movieid: number) {
    this.movieid = movieid;
    this.rabbitmqObject = rabbitmqObject;
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

