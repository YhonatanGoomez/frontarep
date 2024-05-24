import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from '../conexion';

@Component({
  selector: 'app-my-offers',
  templateUrl: './my-offers.component.html',
  styleUrls: ['./my-offers.component.css']
})
export class MyOffersComponent implements OnInit{
  ofertas: any[] = [];
  private offersSub: Subscription;
  rol: any =""
  estado: any =""

  

  constructor(private socketService: SocketService) {
    this.offersSub = this.socketService.getMyOffersUpdateListener()
      .subscribe((offers: any[]) => {
        this.ofertas = offers
        this.estado = this.ofertas[0][3]
        console.log("ofertas por mostrar:", this.ofertas)
        
      });
  }

  ngOnInit(): void {
      this.rol = this.socketService.getRol()
      
  }
  // consultarOferta(id:any){
  //   this.socketService.takeOffer(id)
  // }

  endOffer(id:any){
    this.socketService.setStatusEnd(id)
  }
}



