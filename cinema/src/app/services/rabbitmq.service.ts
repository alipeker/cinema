import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { MovieService } from '../store/movie/movie.service';

@Injectable({
  providedIn: 'root'
})
export class RabbitmqService {

  constructor(private movieService: MovieService) {
    setTimeout(() => {
      this.rabbitmqConfig();
    }, 1000);
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
      const subscription = rxStomp.stompClient.subscribe('/queue/movie', function (message) {
        const movie = JSON.parse(message.body);
        thisComp.movieService.add(movie);
      });
    }, 1000);
  }

}
