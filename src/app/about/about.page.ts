import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
site=null
  constructor(public fx:FunctionsService) {
this.site=null
   }

  ngOnInit() {
  }

}
