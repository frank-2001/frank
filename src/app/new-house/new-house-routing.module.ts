import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewHousePage } from './new-house.page';

const routes: Routes = [
  {
    path: '',
    component: NewHousePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewHousePageRoutingModule {}
