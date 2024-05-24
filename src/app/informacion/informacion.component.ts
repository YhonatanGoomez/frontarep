import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.css']
})
export class InformacionComponent {
  constructor(private router: Router) { }

  goBack() {
    this.router.navigateByUrl('/inicio');
  }
}
