import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Waitlist (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const addToWaitlistMutation = `
    mutation AddToWaitlist($email: String!) {
      addToWaitlist(email: $email) {
        email
        position
        createdAt
      }
    }
  `;

  const waitlistStatusQuery = `
    query WaitlistStatus($email: String!) {
      waitlistStatus(email: $email) {
        email
        position
        totalEntries
        createdAt
      }
    }
  `;

  describe('addToWaitlistMutation', () => {
    it('should add an email to the waitlist', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: addToWaitlistMutation,
          variables: { email: 'user1@example.com' },
        })
        .expect(200)
        .expect((res) => {
          const { addToWaitlist } = res.body.data;
          expect(addToWaitlist.email).toBe('user1@example.com');
          expect(addToWaitlist.position).toBe(1);
          expect(addToWaitlist.createdAt).toBeDefined();
        });
    });

    it('should reject invalid email format on addToWaitlist', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: addToWaitlistMutation,
          variables: { email: 'not-an-email' },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          const error = res.body.errors[0];
          expect(error.message).toBe('Bad Request Exception');
          expect(error.extensions.originalError.message).toContain(
            'Please provide a valid email address',
          );
        });
    });

    it('should reject duplicate email', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: addToWaitlistMutation,
          variables: { email: 'user1@example.com' },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].message).toContain(
            'already on the waitlist',
          );
        });
    });
  });

  describe('waitlistStatusQuery', () => {
    it('should reject invalid email format on waitlistStatus', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: waitlistStatusQuery,
          variables: { email: 'not-an-email' },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          const error = res.body.errors[0];
          expect(error.message).toBe('Bad Request Exception');
          expect(error.extensions.originalError.message).toContain(
            'Please provide a valid email address',
          );
        });
    });

    it('should return waitlist status for existing email', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: addToWaitlistMutation,
          variables: { email: 'user2@example.com' },
        });

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: waitlistStatusQuery,
          variables: { email: 'user2@example.com' },
        })
        .expect(200)
        .expect((res) => {
          const { waitlistStatus } = res.body.data;
          expect(waitlistStatus.email).toBe('user2@example.com');
          expect(waitlistStatus.position).toBe(2);
          expect(waitlistStatus.totalEntries).toBe(2);
          expect(waitlistStatus.createdAt).toBeDefined();
        });
    });

    it('should return error for unknown email', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: waitlistStatusQuery,
          variables: { email: 'unknown@example.com' },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].message).toContain('not found');
        });
    });
  });
});
