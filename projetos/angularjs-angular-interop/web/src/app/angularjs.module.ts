import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UpgradeModule } from '@angular/upgrade/static';

@Component({ template: `` })
export class EmptyComponent {}

@NgModule({
  declarations: [EmptyComponent],
  imports: [
    UpgradeModule,
    RouterModule.forChild([{ path: '**', component: EmptyComponent }]),
  ],
})
export class AngularJSModule {
  constructor(upgrade: UpgradeModule) {
    upgrade.bootstrap(document.body, ['appAngularJS']);
  }
}
