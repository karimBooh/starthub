import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { WaitlistService } from './waitlist.service.js';
import { WaitlistEntry, WaitlistStatus } from './waitlist.model.js';
import { EmailArgs } from './waitlist.input.js';

@Resolver()
export class WaitlistResolver {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Mutation(() => WaitlistEntry)
  addToWaitlist(@Args() { email }: EmailArgs): WaitlistEntry {
    return this.waitlistService.add(email);
  }

  @Query(() => WaitlistStatus)
  waitlistStatus(@Args() { email }: EmailArgs): WaitlistStatus {
    return this.waitlistService.getStatus(email);
  }
}
