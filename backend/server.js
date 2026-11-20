import express from "express";
import petsRoutes from "./routes/pets.js";
import "./database.js";

// Inicializa o servidor
const app = express();

// Rota responsável pelo cadastro dos pets
app.use("/api/pets", petsRoutes);

const PORT = 3000;

// Disponibiliza o frontend
app.use(express.static("../frontend"));

// Testa o servidor e o banco de dados  
app.get("/api/health", (_req, res) => {

    db.prepare("SELECT 1").get();

    res.json({
        servidor: "online",
        banco: "conectado"
    });

});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});