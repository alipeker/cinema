export class Movie {
  id: number = 0;
  name: string = "";
  subject: string = "";
  writers: string[] = [];
  director: string = "";
  cast: string[] = [];
  moviePhotos: string[] = [];
  ratingScore: string = "";
  genres: string[] = [];
  duration: string = "";
  year: string = "";
  castPhotos: string[] = [];

  constructor(id: number, name: string, subject: string = "", writers: string[], director: string,
  cast: string[], moviePhotos: string[], ratingScore: string,
  genres: string[], duration: string, year: string, castPhotos: string[]) {
    this.id = id;
    this.name = name;
    this.subject = subject;
    this.writers = writers;
    this.director = director;
    this.cast = cast;
    this.moviePhotos = moviePhotos;
    this.ratingScore = ratingScore;
    this.genres = genres;
    this.duration = duration;
    this.year = year;
    this.castPhotos = castPhotos;
  }

}

