import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OneArticlePage } from './one-article.page';

const routes: Routes = [
  {
    path: '',
    component: OneArticlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OneArticlePageRoutingModule {}
