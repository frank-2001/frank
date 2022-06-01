import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
@Component({
  selector: 'app-one-article',
  templateUrl: './one-article.page.html',
  styleUrls: ['./one-article.page.scss'],
})
export class OneArticlePage implements OnInit {

  constructor(public fx:FunctionsService) { }

  ngOnInit() {
  }

}
