import { Component, OnInit } from '@angular/core';
import { SocketService } from '../conexion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-offers',
  templateUrl: './new-offers.component.html',
  styleUrls: ['./new-offers.component.css']
})
export class NewOffersComponent  implements OnInit{
  id: any = ''
  nombre: any = ''
  direccion: any = ''
  material: any = ''
  cantidad: any = ''

  constructor(private socket: SocketService, private router: Router) {

  }
  ngOnInit(): void {
      this.nombre = this.socket.getName()
  }
  // insertPetition(){
  //   this.socket.newRequest(this.nombre, this.direccion, "En curso", this.material, this.cantidad)
  //   alert("oferta enviada")
  //   this.router.navigate(['/inicio']);

  // }
  insertPetition() {
    this.socket.getStatus().subscribe(offers => {
      console.log("Datos recibidos:", offers);
      let flag = true
      for (const offer of offers) {
        if (offer.data[5] === this.material && offer.data[4] !== "Finalizado") {
          alert("Usuario ya cuenta con oferta creada");
          flag = false
          break;
        }
      }
      if(flag){
        this.socket.newRequest(this.nombre, this.direccion, "En curso", this.material, this.cantidad);
        alert("Oferta enviada");
        this.router.navigate(['/inicio']);
      }

    });
  }

}
