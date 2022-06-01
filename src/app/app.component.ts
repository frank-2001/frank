import { Component } from '@angular/core';
import { FunctionsService } from './functions.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public fx:FunctionsService) {}
}
