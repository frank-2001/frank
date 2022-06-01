import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OneArticlePageRoutingModule } from './one-article-routing.module';

import { OneArticlePage } from './one-article.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OneArticlePageRoutingModule
  ],
  declarations: [OneArticlePage]
})
export class OneArticlePageModule {}
