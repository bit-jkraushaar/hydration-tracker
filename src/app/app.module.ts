import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';

import { HistoryComponent } from './pages/history/history.component';
import { StartComponent } from './pages/start/start.component';
import { AboutComponent } from './pages/about/about.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SettingsComponent } from './pages/settings/settings.component';

import localeGerman from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HistoryComponent,
    StartComponent,
    AboutComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatListModule,
    MatTabsModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatCardModule,
    MatRadioModule,

    ServiceWorkerModule.register('sw-master.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    registerLocaleData(localeGerman, 'de');
  }
}
