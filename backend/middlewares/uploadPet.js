import multer from "multer";
import path from "node:path";
import { randomUUID } from "node:crypto";

// Configuração do armazenamento
const armazenamento = multer.diskStorage({

    destination: "uploads/",

    filename: (_req, file, callback) => {

        const extensao = path.extname(
            file.originalname
        ).toLowerCase();

        callback(
            null,
            `${randomUUID()}${extensao}`
        );

    }

});

// Formatos permitidos
const tiposPermitidos = [
    "image/jpeg",
    "image/png"
];

// Configuração do Multer
const upload = multer({

    storage: armazenamento,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (_req, file, callback) => {

        if (!tiposPermitidos.includes(file.mimetype)) {

            return callback(
                new Error("Formato de imagem não permitido.")
            );

        }

        callback(null, true);

    }

});

export default upload;