import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VisitorService } from '../../services/visitor.service';

@Component({
  selector: 'app-visitor-log',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './visitor-log.component.html',
  styleUrl: './visitor-log.component.css'
})
export class VisitorLogComponent {
  constructor(public readonly visitorService: VisitorService) {}
}
