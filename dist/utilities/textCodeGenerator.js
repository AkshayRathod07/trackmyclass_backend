"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateTextCode = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
};
// Example usage:
const code = generateTextCode(8); // Generate an 8-character code
console.log(code); // Outputs something like: 'Ab3zT9xY'
exports.default = generateTextCode;
