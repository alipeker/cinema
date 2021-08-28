import { MovieRestService } from './services/movie-rest.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CinemasComponent } from './cinemas/cinemas.component';
import { CinemaDetailComponent } from './cinema-detail/cinema-detail.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BodyComponent } from './body/body.component';
import { MoviesComponent } from './movies/movies.component';
import { MovieComponent } from './movie/movie.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { RabbitmqService } from './services/rabbitmq.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    CinemasComponent,
    CinemaDetailComponent,
    HeaderComponent,
    FooterComponent,
    BodyComponent,
    MoviesComponent,
    MovieComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    AkitaNgDevtools.forRoot()
  ],
  providers: [
    MovieRestService,
    RabbitmqService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
