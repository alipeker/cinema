export class Movie {
  id: number = 0;
  name: string = "";
  subject: string = "";
  moviePhotos: string[] = [];
  ratingScore: string = "";
  genres: string[] = [];
  duration: string = "";
  year: string = "";

  constructor(id: number, name: string, subject: string = "",
  cast: string[], moviePhotos: string[], ratingScore: string,
  genres: string[], duration: string, year: string) {
    this.id = id;
    this.name = name;
    this.subject = subject;
    this.moviePhotos = moviePhotos;
    this.ratingScore = ratingScore;
    this.genres = genres;
    this.duration = duration;
    this.year = year;
  }

}
