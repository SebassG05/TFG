import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-historia',
  standalone: true,
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.css'],
  imports: [
    FooterComponent
  ]
})
export class HistoriaComponent {}
