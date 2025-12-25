import * as jwt from 'jsonwebtoken';
import { Bearer } from 'src/interfaces/jwt';



export class JwtToken {
  private static get secretKey(): string {
    return process.env.SECRET_KEY || 'default-secret';
  }

  static generate(payload: Bearer): string {
    return jwt.sign(payload, this.secretKey, {
      algorithm: 'HS256',
      expiresIn: '30d',
    });
  }

  static verify(token: string): Bearer {
    return jwt.verify(token, this.secretKey) as Bearer;
  }
}
