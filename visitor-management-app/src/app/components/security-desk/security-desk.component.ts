import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { VisitorService } from '../../services/visitor.service';

@Component({
  selector: 'app-security-desk',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './security-desk.component.html',
  styleUrl: './security-desk.component.css'
})
export class SecurityDeskComponent implements OnDestroy {
  @ViewChild('cameraPreview', { static: false }) cameraPreview?: ElementRef<HTMLVideoElement>;
  private pendingStream: MediaStream | null = null;
  form: { fullName: string; contactNumber: string; purpose: string; residentName: string; roomNumber: string; idType: string; idNumber: string; notes: string; imageUrl?: string | null } = {
    fullName: '',
    contactNumber: '',
    purpose: '',
    residentName: '',
    roomNumber: '',
    idType: 'Emirates ID',
    idNumber: '',
    notes: '',
    imageUrl: null
  };

  message: string | null = null;
  videoActive = false;
  capturedImage: string | null = null;
  selectedFilter: 'All' | 'Pending' | 'Approved' | 'Denied' | 'Expired' = 'All';

  constructor(
    public readonly visitorService: VisitorService,
    public readonly authService: AuthService,
    private readonly router: Router
  ) {}

  submitVisitor(): void {
    this.visitorService.addVisitor(this.form);
    this.message = `Visitor ${this.form.fullName} registered successfully and sent for resident approval.`;
    this.resetForm();
    this.stopCamera();
  }

  async openCamera(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.message = 'Camera is not supported in this browser.';
      return;
    }

    this.stopCamera();
    this.message = 'Opening camera...';

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }
        },
        audio: false
      });

      this.videoActive = true;
      this.message = null;
      this.pendingStream = stream;

      setTimeout(async () => {
        const video = this.cameraPreview?.nativeElement;
        if (!video) {
          this.message = 'Camera preview not available.';
          this.stopCamera();
          return;
        }

        video.srcObject = stream;

        try {
          await video.play();
        } catch {
          this.message = 'Camera opened, but preview could not start. Try again.';
          this.stopCamera();
        }
      });
    } catch (error) {
      this.message = this.getCameraErrorMessage(error);
      this.stopCamera();
    }
  }

  capturePhoto(): void {
    const video = this.cameraPreview?.nativeElement;
    if (!video) {
      this.message = 'Camera preview not available.';
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const context = canvas.getContext('2d');
    if (!context) {
      this.message = 'Unable to capture photo.';
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.capturedImage = canvas.toDataURL('image/jpeg', 0.85);
    this.form.imageUrl = this.capturedImage;
    this.stopCamera();
  }

  stopCamera(): void {
    if (this.pendingStream) {
      this.pendingStream.getTracks().forEach((track) => track.stop());
      this.pendingStream = null;
    }

    const video = this.cameraPreview?.nativeElement;
    if (video && video.srcObject instanceof MediaStream) {
      video.srcObject = null;
    }

    this.videoActive = false;
  }

  selectFilter(status: 'All' | 'Pending' | 'Approved' | 'Denied' | 'Expired'): void {
    this.selectedFilter = status;
  }

  get filteredVisitors() {
    if (this.selectedFilter === 'All') {
      return this.visitorService.visitors();
    }
    return this.visitorService.visitors().filter((visitor) => visitor.status === this.selectedFilter);
  }

  private resetForm(): void {
    this.form = {
      fullName: '',
      contactNumber: '',
      purpose: '',
      residentName: '',
      roomNumber: '',
      idType: 'Emirates ID',
      idNumber: '',
      notes: '',
      imageUrl: null
    };
    this.capturedImage = null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  private getCameraErrorMessage(error: unknown): string {
    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        return 'Camera permission was denied. Allow camera access in app settings and try again.';
      }

      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        return 'No camera was found on this device.';
      }
    }

    return 'Unable to access camera. Grant permission and try again.';
  }
}
