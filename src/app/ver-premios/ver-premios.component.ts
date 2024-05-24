import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from '../conexion';


@Component({
  selector: 'app-ver-premios',
  templateUrl: './ver-premios.component.html',
  styleUrls: ['./ver-premios.component.css']
})
export class VerPremiosComponent {
  private offersSub!: Subscription;
  premios:any = []

  constructor(private socketService: SocketService) {
    this.offersSub = this.socketService.getMymispremiosBehaUpdateListener()
    .subscribe((prices) => {
      console.log("mis premiosooooos en componente:", prices)
      this.premios = prices
    });
  }

}
