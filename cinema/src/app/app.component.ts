import { RabbitmqService } from './services/rabbitmq.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cinema';

  constructor(private rabbitmqService: RabbitmqService) {

  }
}
