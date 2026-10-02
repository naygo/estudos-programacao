import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated$ = new BehaviorSubject(true);
  authUser$ = inject(HttpClient).get('https://jsonplaceholder.typicode.com/users');
}