import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';
import { TruncatePipe } from './pipes/truncate.pipe';
import { UserService } from './services/user/user.service';
import { FormsModule } from '@angular/forms';
import { AuthModule } from './auth/auth.module';


// import { PipesModule } from './pipes/pipes.module';


@NgModule({
  declarations: [
    AppComponent,
    PagesComponent,
    // TruncatePipe,
  ],
  imports: [
    AppRoutingModule,
    PagesModule,
    AuthModule,
    BrowserModule,
    SharedModule,
    FormsModule
    // PipesModule
    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFireAuthModule,
    // AngularFirestoreModule
    // BrowserAnimationsModule
  ],
  providers: [ UserService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
