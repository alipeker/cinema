import { UploadMovieComponent } from './upload-movie/upload-movie.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { MoviesComponent } from './movies/movies.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieComponent } from './movie/movie.component';
import { AuthGuard } from './services/authguard.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movies', component: MoviesComponent, canActivate: [AuthGuard] },
  { path: 'movie', component: MovieComponent , canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent , canActivate: [AuthGuard]},
  { path: 'upload', component: UploadMovieComponent , canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
