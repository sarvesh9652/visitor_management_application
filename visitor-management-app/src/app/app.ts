import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Visitor Management');
  readonly steps = [
    {
      title: 'Visitor arrives at the entrance',
      content: 'The visitor reaches the building entry and requests access to a resident.'
    },
    {
      title: 'Security registers visitor details',
      content: 'Security collects the visitor name, contact number, purpose, resident, and room details.'
    },
    {
      title: 'Photo and identity data are captured',
      content: 'The security team records the visitor photo and identification details before proceeding.'
    },
    {
      title: 'Resident is notified for approval',
      content: 'The resident receives the request and can approve or deny the visit in the app.'
    },
    {
      title: 'Access is granted or denied',
      content: 'Based on the resident decision, the system updates the visit status and informs security.'
    }
  ];
}
