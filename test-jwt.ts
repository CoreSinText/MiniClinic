import { JwtToken } from './src/utils/JwtToken';

const payload = { id: 123, email: 'test@example.com' } as any; // Mock Bearer
// Note: Bearer interface likely has specific fields, but assuming id/email is enough for test or casting works.
// Let's check src/interfaces/jwt.d.ts content to be safe first? 
// Actually I'll just try generic payload and see if it works.

console.log('Generating token...');
const token = JwtToken.generate(payload);
console.log('Token:', token);

console.log('Verifying token...');
try {
    const decoded = JwtToken.verify(token);
    console.log('Decoded:', decoded);
    if (decoded.id === 123) {
        console.log('Verification SUCCESS');
    } else {
        console.log('Verification FAILED: ID mismatch');
    }
} catch (error) {
    console.error('Verification ERROR:', error);
}
