import { Injectable, signal } from '@angular/core';
import type { VisitorFormInput, VisitorRecord, VisitorStatus } from '../models/visitor.model';

@Injectable({ providedIn: 'root' })
export class VisitorService {
  private readonly storageKey = 'visitor-management-data-v1';
  private readonly expiryTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly visitorsSignal = signal<VisitorRecord[]>(this.loadVisitors());

  readonly visitors = this.visitorsSignal.asReadonly();

  addVisitor(input: VisitorFormInput): VisitorRecord {
    const visitor: VisitorRecord = {
      id: crypto.randomUUID(),
      fullName: input.fullName,
      contactNumber: input.contactNumber,
      purpose: input.purpose,
      residentName: input.residentName,
      residentMobileNumber: input.residentMobileNumber,
      roomNumber: input.roomNumber,
      idType: input.idType,
      idNumber: input.idNumber,
      notes: input.notes,
      imageUrl: input.imageUrl ?? null,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    };

    this.visitorsSignal.update((items) => [visitor, ...items]);
    this.persist();
    this.scheduleExpiry(visitor.id, visitor.expiresAt);
    return visitor;
  }

  updateStatus(id: string, status: VisitorStatus): void {
    this.visitorsSignal.update((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, status, updatedAt: new Date().toISOString() }
          : item
      )
    );

    this.clearExpiryTimer(id);
    this.persist();
  }

  markExpired(id: string): void {
    this.updateStatus(id, 'Expired');
  }

  getPendingVisitors(): VisitorRecord[] {
    return this.visitorsSignal().filter((visitor) => visitor.status === 'Pending');
  }

  getMetrics() {
    const visitors = this.visitorsSignal();
    return {
      total: visitors.length,
      pending: visitors.filter((visitor) => visitor.status === 'Pending').length,
      approved: visitors.filter((visitor) => visitor.status === 'Approved').length,
      denied: visitors.filter((visitor) => visitor.status === 'Denied').length,
      expired: visitors.filter((visitor) => visitor.status === 'Expired').length
    };
  }

  private loadVisitors(): VisitorRecord[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const raw = window.localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as VisitorRecord[];
    } catch {
      return [];
    }
  }

  private persist(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(this.visitorsSignal()));
  }

  private scheduleExpiry(id: string, expiresAt: string): void {
    const delay = new Date(expiresAt).getTime() - Date.now();
    const timer = window.setTimeout(() => {
      this.markExpired(id);
      this.expiryTimers.delete(id);
    }, Math.max(delay, 0));

    this.clearExpiryTimer(id);
    this.expiryTimers.set(id, timer);
  }

  private clearExpiryTimer(id: string): void {
    const timer = this.expiryTimers.get(id);
    if (timer) {
      window.clearTimeout(timer);
      this.expiryTimers.delete(id);
    }
  }

}
