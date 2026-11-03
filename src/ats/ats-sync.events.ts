export const CLIENT_CREATED = 'user.client.created';

export interface ClientCreatedEvent {
  userId: number;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  phone: string | null;
  gender: string | null;
}
