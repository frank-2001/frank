import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewHousePageRoutingModule } from './new-house-routing.module';

import { NewHousePage } from './new-house.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewHousePageRoutingModule
  ],
  declarations: [NewHousePage]
})
export class NewHousePageModule {}
