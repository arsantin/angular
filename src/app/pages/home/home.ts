import { Component } from '@angular/core';
import { UserProfile } from '../../components/user-profile/user-profile';

@Component({
  selector: 'app-home',
  imports: [UserProfile],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {}
