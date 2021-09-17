import { ID } from '@datorama/akita';
import { UserRating } from './../store/movie/movie.model';
import { RabbitmqObject } from './../data/rabbitmq-object.data';
import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { MovieService } from '../store/movie/movie.service';
import { Movie, UserRatingRabbitmq } from '../store/movie/movie.model';
import { Operation } from '../data/operation.model';

@Injectable({
  providedIn: 'root'
})
export class RabbitmqService {

  constructor(private movieService: MovieService) {
    this.rabbitmqConfig();
  }

  rabbitmqConfig(): void {
    let rxStomp = new RxStomp();
    const stompConfig = {
      // Typically login, passcode and vhost
      // Adjust these for your broker
      connectHeaders: {
        login: "guest",
        passcode: "guest"
      },

      // Broker URL, should start with ws:// or wss:// - adjust for your broker setup
      brokerURL: "ws://127.0.0.1:15674/ws",

      // Keep it off for production, it can be quit verbose
      // Skip this key to disable
      debug: function g(e) {
        console.log('STOMP: ' + e);
      },

      // If disconnected, it will retry after 100ms
      reconnectDelay: 100
    };

    rxStomp.configure(stompConfig);
    rxStomp.activate();
    const thisComp = this;
    setTimeout(() => {
      rxStomp.stompClient.subscribe('/queue/movie', function (message) {
        const rabbitMqObject = JSON.parse(message.body) as RabbitmqObject;
        if(rabbitMqObject.operation === Operation.CREATE) {
          thisComp.movieService.add(rabbitMqObject.message as Movie);
        } else if(rabbitMqObject.operation === Operation.UPDATE) {
          thisComp.movieService.update(rabbitMqObject.message as Movie);
        } else if(rabbitMqObject.operation === Operation.DELETE) {
          thisComp.movieService.delete(rabbitMqObject.message as number);
        }
      });

      rxStomp.stompClient.subscribe('/queue/comment', function (message) {
        const rabbitMqObject = JSON.parse(message.body) as UserRatingRabbitmq;
        if(rabbitMqObject.rabbitmqObject.operation === Operation.CREATE) {
          thisComp.movieService.addComment(rabbitMqObject.movieid, rabbitMqObject.rabbitmqObject.message as UserRating);
        } else if(rabbitMqObject.rabbitmqObject.operation === Operation.UPDATE) {
          thisComp.movieService.updateComment(rabbitMqObject.movieid, rabbitMqObject.rabbitmqObject.message as UserRating);
        } else if(rabbitMqObject.rabbitmqObject.operation === Operation.DELETE) {
          thisComp.movieService.removeComment(rabbitMqObject.movieid, (rabbitMqObject.rabbitmqObject.message as UserRating).id as string);
        }
      });
    }, 1000);
  }

}
