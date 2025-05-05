import express from "express"; //importar express


const app = express(); //crear una instancia de express


const PORT = 3001; //definir el puerto

app.listen(PORT, () => {
    console.log("Server is running on port: http://localhost:"+PORT); //iniciar el servidor en el puerto 3000
})