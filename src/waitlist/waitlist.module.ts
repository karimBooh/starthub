import { Module } from '@nestjs/common';
import { WaitlistService } from './waitlist.service.js';
import { WaitlistResolver } from './waitlist.resolver.js';

@Module({
  providers: [WaitlistService, WaitlistResolver],
})
export class WaitlistModule {}
