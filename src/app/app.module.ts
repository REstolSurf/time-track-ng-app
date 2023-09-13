import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StopWatchComponent } from './components/stop-watch/stop-watch.component';
import { ControlsSWComponent } from './components/controls-sw/controls-sw.component';
import { ProjectInputComponent } from './components/project-input/project-input.component';
import { AlarmWatchComponent } from './components/alarm-watch/alarm-watch.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AlarmSetComponent } from './components/alarm-set/alarm-set.component';
import { HistoryComponent } from './components/history/history.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { AlertComponent } from './components/alert/alert.component';
import { ConfirmWindowComponent } from './components/confirm-window/confirm-window.component';
import { Pag404Component } from './components/pag404/pag404.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    StopWatchComponent,
    ControlsSWComponent,
    ProjectInputComponent,
    AlarmWatchComponent,
    NavbarComponent,
    AlarmSetComponent,
    HistoryComponent,
    StatisticsComponent,
    AlertComponent,
    ConfirmWindowComponent,
    Pag404Component,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }