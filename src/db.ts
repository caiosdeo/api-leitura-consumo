// db.ts
import mongoose from 'mongoose';

const connectToDatabase = async () => {
    const mongoURI = 'mongodb://mongo:27017/api-leitura-consumo';
    console.log(`Connecting to MongoDB at ${mongoURI}`); 

    try {
        await mongoose.connect(mongoURI);
        console.log('Database connected!');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;  
    }
};

export default connectToDatabase;
