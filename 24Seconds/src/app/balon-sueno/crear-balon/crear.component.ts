import { Component } from '@angular/core';
import { FooterComponent } from "../../footer/footer.component";
import { Balon3dComponent } from './balon-3d.component';

@Component({
  selector: 'app-crear-balon',
  standalone: true,
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css'],
  imports: [FooterComponent, Balon3dComponent]
})
export class CrearComponent {}
