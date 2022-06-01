import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { IonicStorageModule } from '@ionic/storage-angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { SignInPipe } from './sign-in.pipe';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, SignInPipe],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,IonicStorageModule.forRoot(),HttpClientModule],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
