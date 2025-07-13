import app from "./app.js";
import connectToMongoDB from "./db.js";


const PORT = process.env.PORT || 4000;

connectToMongoDB()

//Iniciar el servidor
const server = async () => {
  try {
    app.listen(PORT, () => {
      console.log("Server is running on port: http://localhost:" + PORT); //iniciar el servidor en el puerto 4000
    });
  } catch (error) {
    console.log("Error al iniciar el servidor: ", error);
    process.exit(1); //salir del proceso con un código de error 1
  }
};

server(); //ejecutar la función server

console.log("Server on port: " + PORT);
