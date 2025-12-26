import { roleEnum } from 'drizzle/drizzle.schema';

export interface Bearer {
  id: string;
  role: typeof roleEnum.enumValues[number];
  email: string;
}
