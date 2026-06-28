import { Injectable, signal } from '@angular/core';

const RESIDENT_STORE_KEY = 'visitor-management-resident-store-v1';

export interface Resident {
  id: string;
  name: string;
  buildingNumber: string;
  mobileNumber: string;
  createdAt: string;
}

export interface ResidentInput {
  name: string;
  buildingNumber: string;
  mobileNumber: string;
}

@Injectable({ providedIn: 'root' })
export class ResidentService {
  private readonly residentSignal = signal<Resident[]>(this.loadResidents());
  readonly residents = this.residentSignal.asReadonly();

  addResident(input: ResidentInput): void {
    const resident: Resident = {
      id: crypto.randomUUID(),
      name: input.name,
      buildingNumber: input.buildingNumber,
      mobileNumber: input.mobileNumber,
      createdAt: new Date().toISOString()
    };

    this.setResidents([resident, ...this.residentSignal()]);
  }

  findResident(id: string): Resident | undefined {
    return this.residentSignal().find((resident) => resident.id === id);
  }

  private setResidents(residents: Resident[]): void {
    this.residentSignal.set(residents);
    this.saveResidents(residents);
  }

  private loadResidents(): Resident[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const raw = window.localStorage.getItem(RESIDENT_STORE_KEY);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as Resident[];
    } catch {
      return [];
    }
  }

  private saveResidents(residents: Resident[]): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(RESIDENT_STORE_KEY, JSON.stringify(residents));
  }
}
