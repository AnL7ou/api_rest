import dotenv from 'dotenv';
dotenv.config();

export const config = {
    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h', // Token expires in 1 hour
        refreshExpiresIn: '7d' // Refresh token expires in 7 days
    },

    // Database Configuration
    database: {
        filename: './db/SkzPets.db'
    },

    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost'
    },

    // Security
    security: {
        bcryptRounds: 10, // Number of salt rounds for bcrypt
        maxLoginAttempts: 5,
        lockoutTime: 15 * 60 * 1000 // 15 minutes in milliseconds
    }
};