import { Component } from '@angular/core';

/**
 * Generated class for the LandingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'landing',
  templateUrl: 'landing.html'
})
export class LandingComponent {

  text: string;

  constructor() {
    console.log('Hello LandingComponent Component');
    this.text = 'Hello World';
  }

}
