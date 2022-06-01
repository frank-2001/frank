import { Component } from '@angular/core';
import { FunctionsService } from '../functions.service';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public fx:FunctionsService) {}

}
