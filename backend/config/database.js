import mongoose from 'mongoose';
mongoose.set('strictQuery', false);

export const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URI);
    console.log(
      `Mogodb connected with the server: ${connection.connection.host}`
    );
  } catch (error) {
    console.log(error);
  }
};
