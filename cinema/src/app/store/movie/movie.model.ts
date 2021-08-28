export class Movie {
  id: number = 0;
  name: string = "";
  subject: string = "";
  moviePhotos: string[] = [];
  ratingScore: string = "";
  genres: string[] = [];
  duration: string = "";
  year: string = "";
  moviePersons: MoviePerson[] = []

  constructor(id: number, name: string, subject: string = "",
  moviePhotos: string[], ratingScore: string,
  genres: string[], duration: string, year: string, moviePersons: MoviePerson[]) {
    this.id = id;
    this.name = name;
    this.subject = subject;
    this.moviePhotos = moviePhotos;
    this.ratingScore = ratingScore;
    this.genres = genres;
    this.duration = duration;
    this.year = year;
    this.moviePersons = moviePersons
  }

}

export enum Gender {
  Man,
  Woman
}

export enum Profession {
  Cast,
  Writer,
  Director
}

export abstract class Person {
  name: string = "";
  surname: string = "";
  characterName: string = "";
  age = 0;
  gender: Gender = 0;
  professions: Profession[] = [];
  photos: String[] = [];
}

export class MoviePerson extends Person{
  id: number = 0;
  profession: Profession = 0;
  movie: Movie[] = [];
}

