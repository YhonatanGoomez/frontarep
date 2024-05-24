import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { InteractionType, PopupRequest } from '@azure/msal-browser';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SocketService } from '../conexion';

interface UserDetails {
  '@odata.context': string;
  displayName: string;
  jobTitle: string | null;  
  mail: string | null;
  department: string | null;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private socketService: SocketService,private http: HttpClient, private authService: MsalService, private router: Router) { }

  ngOnInit() {
    this.initializeMsal();
  }

  async initializeMsal() {
    try {
      await this.authService.instance.initialize();
      console.log('MSAL initialized successfully');
    } catch (error) {
      console.error('Failed to initialize MSAL', error);
    }
  }

  login() {
    const request: PopupRequest = {
      scopes: ["user.read"],
      prompt: "select_account",
      authority: 'https://login.microsoftonline.com/47c26730-1c44-4031-978b-9a0a195ff9d6',
    };

    this.authService.loginPopup(request)
      .subscribe({
        next: (result) => {
          
          this.authService.instance.setActiveAccount(result.account);
          this.getUserDetails();
          
          
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
  }

  getUserDetails() {
    const request = { scopes: ['user.read'] };
    this.authService.acquireTokenSilent(request).subscribe({
      next: (response) => {
        const accessToken = response.accessToken;
        // console.log("token", accessToken);
        this.getmoredetails(accessToken).subscribe({
          next: (userDetails) => {
            console.log("datos: ", userDetails)
            this.socketService.setRol(userDetails.jobTitle)
            this.socketService.setname(userDetails.displayName)
            this.socketService.setpoints()
            
            this.router.navigate(['/inicio']);
            
          },
          error: (err) => {
            console.error('Error fetching user details from Microsoft Graph:', err);
          }
        });
      },
      error: (error) => {
        console.error('Failed to acquire token', error);
        
      }
    });
  }

  getmoredetails(accessToken: string): Observable<UserDetails> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.get<UserDetails>('https://graph.microsoft.com/v1.0/me?$select=displayName,jobTitle,mail,department', { headers });
  }

}
