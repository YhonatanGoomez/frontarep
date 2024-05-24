import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NewOffersComponent } from './new-offers/new-offers.component';
import { SeeOffersComponent } from './see-offers/see-offers.component';
import { LoginComponent } from './login/login.component';
import { MyOffersComponent } from './my-offers/my-offers.component';
import { InicioComponent } from './inicio/inicio.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsalModule, MsalService, MsalGuard, MsalInterceptor, MsalBroadcastService, MsalRedirectComponent } from "@azure/msal-angular";
import { PublicClientApplication, InteractionType, BrowserCacheLocation } from "@azure/msal-browser";
import { HttpClientModule } from '@angular/common/http';
import { InformacionComponent } from './informacion/informacion.component';
import { PremiosComponent } from './premios/premios.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VerPremiosComponent } from './ver-premios/ver-premios.component';
const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'new-offers', component: NewOffersComponent },
  { path: 'see-offers', component: SeeOffersComponent }

];

@NgModule({
  declarations: [
    AppComponent,
    NewOffersComponent,
    SeeOffersComponent,
    LoginComponent,
    MyOffersComponent,
    InicioComponent,
    InformacionComponent,
    PremiosComponent,
    VerPremiosComponent
  ],
  imports: [
    MsalModule.forRoot(new PublicClientApplication(
      { 
        auth: {
          clientId: "279901d7-70ad-451f-8d97-dc69f16269ed",
          authority: "https://login.microsoftonline.com/47c26730-1c44-4031-978b-9a0a195ff9d6", // Corregido aquí
          redirectUri: "http://localhost:4200/inicio",
        },
        cache: {
          cacheLocation: BrowserCacheLocation.LocalStorage,
          storeAuthStateInCookie: true, // Recomendado para IE 11
        },
        system: {
          loggerOptions: {
            loggerCallback: () => { },
            piiLoggingEnabled: false
          }
        }
      }), {
        interactionType: InteractionType.Redirect,
      }, {
        interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
        protectedResourceMap: new Map([
            ['https://graph.microsoft.com/v1.0/me', ['user.read']],
            ['https://api.myapplication.com/users/*', ['customscope.read']],
            ['http://localhost:4200/about/', null] 
        ])
    }),    
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
