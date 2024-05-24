 import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable, Subject, Subscriber } from 'rxjs';

interface Oferta {
  data: any[];
}



interface Offer {
  id: string;
  data: any[];
}
interface usuarioInterface {
  puntos: number
}

interface StatusResponse {
  material: string;
  status: string;
}
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private offersUpdated = new Subject<any[]>();
  private pointsUpdated = new BehaviorSubject<number>(0);
  private myoffersUpdated = new Subject<any[]>();
  private canCreate = new BehaviorSubject<string[]>([])
  private premiosBeha = new BehaviorSubject<string[]>([])
  private mispremiosBeha = new BehaviorSubject<string[]>([])
  name: any = ""
  rol: any = ""
  estadoOferta = ""
  points = 0
  premios:any =""


  constructor() {
    this.socket = io('http://localhost:4000');
    this.socket.on('update-offers', offers => {
      this.offersUpdated.next(offers);
      console.log('ofertas obtenidas', offers)
    });
    this.socket.on("puntos", data => {
      const safeData = data as { [key: number]: any };

      const filteredOffers = Object.entries(safeData).filter(([key, value]) => key === this.name);
      console.log("gsgsgsgsgsgsg:", filteredOffers)

      const puntos = filteredOffers[0][1].puntos;
      console.log("puntooooooooooo: ", puntos)
      this.pointsUpdated.next(puntos);

    })
    this.socket.on("sendPoints", points =>{
      console.log("escucha los puntos")
      this.pointsUpdated.next(points);
    })


    this.socket.on('myupdate-offers', offers => {
      let misOfertas: any = "sin ofertas";

      // Asegurarse de que `offers` es un objeto antes de proceder
      if (offers && typeof offers === 'object') {
        console.error('Received valid `offers`: ', offers);
        misOfertas = Object.entries(offers).filter(([key, value]) => {
          if ((value as Oferta).data && Array.isArray((value as Oferta).data)) {
            const oferta = value as Oferta;
            return oferta.data[1] === this.name;
          } else {
            return false;
          }
        });
      } else {
        console.error('Received invalid `offers` usuario: ', offers);
      }
      console.log(misOfertas, "ofertas al actualizar reciclador")
      if (this.rol == "reciclador") {
        console.log("rolllalalalla:", this.rol)
        this.myoffersUpdated.next(misOfertas);
      }

    });

    
    this.socket.on('premios', data => {
        console.log("entra en premios en conexion" , data)
        this.premiosBeha.next(data);
        this.premios = data
    });
    this.socket.on('mispremios', data => {
      if (data ) {
        console.log("entra en mis  premios en conexion" , data[this.name].datos.length)
        if(data[this.name].datos.length > 0){
          
          this.mispremiosBeha.next(data[this.name].datos);
        }else{
          // this.mispremiosBeha.next([]);
        }
        // 

      }
    });






    this.socket.on('myupdate-offers_usser', (offers: any) => {
      let misOfertas: any = "sin ofertas";

      if (offers && typeof offers === 'object') {
        console.error('Received valid `offers`: ', offers);

        misOfertas = Object.entries(offers).filter(([key, value]) => {
          if ((value as Oferta).data && Array.isArray((value as Oferta).data)) {
            const oferta = value as Oferta;
            return oferta.data[1] === this.name;
          } else {
            console.warn(`Invalid offer format for key ${key}`, value);
            return false;
          }
        });
      } else {
        console.error('Received invalid `offers` usuario: ', offers);
      }

      console.log(misOfertas, "ofertas al actualizar usuario");

      if (this.rol === "usuario") {
        console.log("rolllalalalla usuario:", this.rol);
        this.myoffersUpdated.next(misOfertas);
      }
    });

  }

  getName(): string {
    return this.name
  }

  setpoints(){
    this.socket.emit("getPoints", this.name)
  }
  getOffersUpdateListener() {
    return this.offersUpdated.asObservable();
  }

  getpricesUpdateListener() {
    return this.premiosBeha.asObservable();
  }

  getPointsUpdateListener() {
    return this.pointsUpdated.asObservable();
  }
  

  takePrice(premio:any){
    this.socket.emit('takePrice', [premio, this.name]);
  }

  setname(nombre: any) {
    this.socket.emit('setName', nombre);
    this.name = nombre
    console.log("Nombre que se está seteando:", nombre)
  }
  getPoints():number{
    console.log("entra en lo de los puntos")
    return this.points
  }
  setRol(userRol: any) {
    this.rol = userRol
  }
  getRol() {
    return this.rol
  }



  setStatusEnd(id: any) {
    this.estadoOferta = ""
    this.socket.emit("endState", [this.name, id])
  }

  getMyOffersUpdateListener() {
    return this.myoffersUpdated.asObservable();
  }

  getMymispremiosBehaUpdateListener() {
    return this.mispremiosBeha.asObservable();
  }



  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  updateOffers() {
    this.socket.emit('updateOffers', true);
  }

  onMessage(): void {
    this.socket.on('message', (data: any) => {
      console.log(data);
    });
  }

  // public sendOffer(offer: any) {
  //   this.socket.emit('new-offer', offer);
  // }

  public getOffers() {
    this.socket.on('update-offers', offers => {
    });
  }
  public getMyOffers() {
    this.socket.on('myupdate-offers', offers => {
    });
  }

  newRequest(nombre: any, direccion: any, estado: any, material: any, cantidad: any) {

    this.socket.emit('new-offer', [this.name, { data: [nombre, direccion, estado, material, cantidad] }])
  }

  takeOffer(id: any) {
    this.estadoOferta = "Asignado"
    this.socket.emit("take-offer", [this.name, id])
  }

  getEstado(): string {
    return this.estadoOferta
  }

  getStatus(): Observable<Offer[]> {
    return new Observable<Offer[]>(subscriber => {
      this.socket.emit("canCreate", this.name);
      this.socket.on("canCreateResponse", (response: [string, { data: any[] }][]) => {
        const transformedData = response.map(([id, content]) => ({ id: id, data: content.data }));
        console.log("Datos transformados:", transformedData);
        subscriber.next(transformedData);
        subscriber.complete();
      });
    });
  }

  //   tomarOfertaPorId(id: number) {
  //     this.socket.emit('offer-taken', id);
  //   }

}
