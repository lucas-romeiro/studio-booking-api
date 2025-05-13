import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI.replace(
      '<db_password>',
      process.env.MONGODB_PASSWORD
    );

    await mongoose.connect(uri);

    console.log('MongoDB conectado');
  } catch (err) {
    console.log(`Erro ao conectar ao MongoDB: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
