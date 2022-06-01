import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewArticlePageRoutingModule } from './new-article-routing.module';

import { NewArticlePage } from './new-article.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewArticlePageRoutingModule
  ],
  declarations: [NewArticlePage]
})
export class NewArticlePageModule {}
