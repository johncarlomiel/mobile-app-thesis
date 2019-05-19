import { NgModule } from '@angular/core';
import { LandingComponent } from './landing/landing';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
	declarations: [LandingComponent,
		ProgressBarComponent],
	imports: [],
	exports: [LandingComponent,
		ProgressBarComponent]
})
export class ComponentsModule { }
