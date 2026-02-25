import { ConflictException, NotFoundException } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';

describe('WaitlistService', () => {
  let service: WaitlistService;

  beforeEach(() => {
    service = new WaitlistService();
  });

  describe('add', () => {
    it('should add an email and return the entry', () => {
      const result = service.add('test@example.com');

      expect(result.email).toBe('test@example.com');
      expect(result.position).toBe(1);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should assign incrementing positions', () => {
      service.add('first@example.com');
      const second = service.add('second@example.com');

      expect(second.position).toBe(2);
    });

    it('should throw ConflictException for duplicate email', () => {
      service.add('dup@example.com');

      expect(() => service.add('dup@example.com')).toThrow(ConflictException);
    });
  });

  describe('getStatus', () => {
    it('should return status for an existing email', () => {
      service.add('user@example.com');
      service.add('other@example.com');

      const status = service.getStatus('user@example.com');

      expect(status.email).toBe('user@example.com');
      expect(status.position).toBe(1);
      expect(status.totalEntries).toBe(2);
      expect(status.createdAt).toBeInstanceOf(Date);
    });

    it('should throw NotFoundException for unknown email', () => {
      expect(() => service.getStatus('unknown@example.com')).toThrow(
        NotFoundException,
      );
    });
  });
});
