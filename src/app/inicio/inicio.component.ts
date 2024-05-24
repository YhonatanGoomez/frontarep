import { Component, OnInit, NgZone } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SocketService } from '../conexion';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  rol: any = ""
  nombreUsuario = ""
  puntaje: any = 0
  private offersSub: Subscription;
  constructor(private router: Router, private socketService: SocketService) {
    this.offersSub = this.socketService.getPointsUpdateListener().subscribe((puntos) => {
      console.log("puntoooos componente:", puntos)
      this.puntaje = puntos
      console.log("este es el puntaje:", this.puntaje)


    });
  }
  ngOnInit(): void {
   
    console.log("puntaje de inicio:", this.puntaje)
    this.rol = this.socketService.getRol()
    this.nombreUsuario = this.socketService.getName()
    console.log('rol: ', this.rol)
    this.socketService.getPointsUpdateListener().subscribe(puntos => {
      this.puntaje = puntos;
      console.log("Puntaje actualizado en InicioComponent:", this.puntaje);
    });
  }


  redirect(path: any) {
    if (path == 'crear') {
      console.log("este es el puntaje al crear:", this.puntaje)
      this.router.navigateByUrl('/new-offers');
    }
    else if (path == 'ofertas') {
      this.socketService.updateOffers()
      this.router.navigateByUrl('/see-offers');
    }
    else if (path == 'informacion') {
      this.router.navigateByUrl('/informacion');
    }
    else if (path == 'premios') {
      this.router.navigateByUrl('/premios');
    }
    else if (path == 'mispremios') {
      this.router.navigateByUrl('/verpremios');
    }
    else {
      this.socketService.updateOffers()
      this.router.navigateByUrl('/my-offers');
    }
  }
}
