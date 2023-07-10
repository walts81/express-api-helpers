import bcrypt from 'bcrypt';

export const generateHash = (textToHash: string) => bcrypt.hash(textToHash, 14);
export const compareHash = (textToHash: string, hash: string) => bcrypt.compare(textToHash, hash);
