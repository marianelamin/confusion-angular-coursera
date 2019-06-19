import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProcessHTTPMsgService {

  constructor() { }


  public handleError(error: HttpErrorResponse | any){
    let errMsg: string;

    if(error.error instanceof ErrorEvent){
      // if this is an error event, we know how the 
      errMsg = error.error.message;
    }
    else{
      //this is comming from the server
      errMsg = `${error.status} - ${error.statusText || ''} ${error.error} `;
    }

    // then we return an error obervable to our application
    return throwError(errMsg);
  }
  
}
