import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { WaitlistEntry, WaitlistStatus } from './waitlist.model.js';

@Injectable()
export class WaitlistService {
  private readonly logger = new Logger(WaitlistService.name);
  private readonly entries: WaitlistEntry[] = [];

  add(email: string): WaitlistEntry {
    const existing = this.entries.find((e) => e.email === email);
    if (existing) {
      this.logger.warn(`Duplicate waitlist signup attempted: ${email}`);
      throw new ConflictException('Email is already on the waitlist');
    }

    const entry: WaitlistEntry = {
      email,
      position: this.entries.length + 1,
      createdAt: new Date(),
    };

    this.entries.push(entry);
    this.logger.log(
      `Added to waitlist: ${email} at position ${entry.position}`,
    );
    return entry;
  }

  getStatus(email: string): WaitlistStatus {
    const entry = this.entries.find((e) => e.email === email);
    if (!entry) {
      this.logger.warn(`Waitlist status lookup failed: ${email} not found`);
      throw new NotFoundException('Email not found on the waitlist');
    }

    this.logger.log(
      `Waitlist status checked: ${email} at position ${entry.position}/${this.entries.length}`,
    );
    return {
      email: entry.email,
      position: entry.position,
      totalEntries: this.entries.length,
      createdAt: entry.createdAt,
    };
  }
}
