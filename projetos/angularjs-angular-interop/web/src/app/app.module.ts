import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule, downgradeComponent } from '@angular/upgrade/static';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './test-component/test-component.component';

declare var app: any;
app.directive(
  'testComponent',
  downgradeComponent({ component: TestComponent })
);

@NgModule({
  declarations: [AppComponent, TestComponent],
  imports: [BrowserModule, AppRoutingModule, UpgradeModule],
  exports: [TestComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
