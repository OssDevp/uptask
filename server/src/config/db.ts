import mongoose from "mongoose";
import colors from "colors";
import { exit } from "node:process";

export const connectDB = async () => {
  try {
    const dataBaseUrl = process.env.DATABASE_URL;
    if (!dataBaseUrl)
      throw new Error(colors.bold.red("Error whit the URL in DB"));
    const { connection } = await mongoose.connect(dataBaseUrl);
    const url = `${connection.host}:${connection.port}`;
    console.log(colors.bold.bgBlue(` -- MongoDB conectado en: ${url} `));
  } catch (err) {
    console.log(colors.bgRed(" Error al conectarse en la base de datos "));
    // console.log(err.message);
    exit(1);
  }
};
