import { UploadMovieComponent } from './upload-movie/upload-movie.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { MoviesComponent } from './movies/movies.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieComponent } from './movie/movie.component';
import { AuthguardService } from './services/authguard.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movies', component: MoviesComponent, canActivate: [AuthguardService] },
  { path: 'movie', component: MovieComponent , canActivate: [AuthguardService] },
  { path: 'profile', component: ProfileComponent , canActivate: [AuthguardService]},
  { path: 'upload', component: UploadMovieComponent , canActivate: [AuthguardService]},
  { path: 'update', component: UploadMovieComponent , canActivate: [AuthguardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
