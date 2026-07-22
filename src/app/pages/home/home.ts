import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UserProfile } from '../../components/user-profile/user-profile';

@Component({
  selector: 'app-home',
  imports: [UserProfile],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./home.css'],
})
export class Home {}
