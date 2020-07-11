import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';
import { TruncatePipe } from './pipes/truncate.pipe';
// import { PipesModule } from './pipes/pipes.module';


@NgModule({
  declarations: [
    AppComponent,
    PagesComponent,
    // TruncatePipe,
  ],
  imports: [
    PagesModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    // PipesModule
    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFireAuthModule,
    // AngularFirestoreModule
    // BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
