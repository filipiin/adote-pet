import express from "express";
import upload from "../middlewares/uploadPet.js";
import { criarPet, listarPetsContr, obterPet, atualizarPet, excluirPet } from "../controllers/petsController.js";

// Inicializa as rotas
const router = express.Router();

// Rota para cadastrar um pet
router.post("/", upload.single("foto"), criarPet);

// Lista os pets disponíveis
router.get("/", listarPetsContr);

// Buscar pet por id
router.get("/:id", obterPet);

//Atualizar dados do pet
router.put("/:id", upload.single("foto"), atualizarPet);

router.delete("/:id", excluirPet);

export default router;