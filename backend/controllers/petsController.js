import { unlink } from "node:fs/promises";
import path from "node:path";
import { cadastrarPet, 
         buscarPetPorId, 
         listarPets, 
         atualizarPet as atualizarPetService,
         excluirPet as excluirPetService
} from "../services/petsService.js";

/*Controle dos serviços de 
    01. Listagem dos pets
    02. Cadastro dos pets
    03. Busca por id dos pets
    04. Remoção dos anúncios dos pets 
    05. Atualização das informaçẽos dos anúncios dos pets
*/

// Controla a listagem dos pets
export async function listarPetsContr(_req, res) { //_req -> parâmetro foi recebido, mas não está sendo utilizado 

    try {

        const pets = await listarPets();

        return res.status(200).json({

            quantidade: pets.length,
            pets: pets

        });

    } catch (erro) {

        console.error("Erro ao consultar pets:", erro);

        return res.status(500).json({

            erro: "Não foi possível consultar os pets."

        });

    }

}

// Controla o cadastro do pet
export async function criarPet(req, res) {

    try {

        // Solicita o processamento do cadastro
        const resultado = await cadastrarPet(
            req.body,
            req.file
        );

        // Responde ao frontend
        return res.status(201).json({

            mensagem: "Pet cadastrado com sucesso!",
            tutorId: resultado.tutorId,
            petId: resultado.petId

        });

    } catch (erro) {

        console.error("Erro ao cadastrar pet:", erro);

        // Remove a fotografia caso o cadastro falhe
        if (req.file?.path) {

            await unlink(req.file.path).catch(() => {});

        }

        return res.status(erro.statusCode || 500).json({

            erro: erro.statusCode
                ? erro.message
                : "Não foi possível cadastrar o pet."

        });

    }

}

// Consulta um pet pelo ID
export async function obterPet(req, res) {

    const id = Number(req.params.id);

    // Valida o identificador
    if (!Number.isInteger(id) || id <= 0) {

        return res.status(400).json({
            erro: "Identificador inválido."
        });

    }

    try {

        const pet = await buscarPetPorId(id);

        // Verifica se o pet existe
        if (!pet) {

            return res.status(404).json({
                erro: "Pet não encontrado."
            });

        }

        return res.status(200).json({
            pet: pet
        });

    } catch (erro) {

        console.error("Erro ao consultar pet:", erro);

        return res.status(500).json({
            erro: "Não foi possível consultar o pet."
        });

    }

}

const pastaUploads = path.resolve("uploads");

async function removerFoto(caminho) {

    if (!caminho) return;

    const caminhoAbsoluto = path.resolve(caminho);

    // Verifica se o arquivo pertence a uploads
    if (!caminhoAbsoluto.startsWith(pastaUploads + path.sep)) {

        console.error("Caminho de fotografia inválido.");

        return;

    }

    try {

        await unlink(caminhoAbsoluto);

    } catch (erro) {

        if (erro.code !== "ENOENT") {
            console.error("Erro ao remover fotografia:", erro);
        }

    }

}

// Atualiza um pet
export async function atualizarPet(req, res) {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {

        await removerFoto(req.file?.path);

        return res.status(400).json({
            erro: "Identificador inválido."
        });

    }

    try {

        const resultado = await atualizarPetService(
            id,
            req.body,
            req.file
        );

        if (!resultado) {

            await removerFoto(req.file?.path);

            return res.status(404).json({
                erro: "Pet não encontrado."
            });

        }

        // Remove a fotografia antiga, caso tenha sido substituída
        if (resultado.fotoAntiga !== resultado.fotoAtual) {

            await removerFoto(resultado.fotoAntiga);

        }

        return res.json({
            mensagem: "Cadastro atualizado com sucesso!"
        });

    } catch (erro) {

        await removerFoto(req.file?.path);

        console.error("Erro ao atualizar pet:", erro);

        return res.status(erro.statusCode || 500).json({

            erro: erro.statusCode
                ? erro.message
                : "Não foi possível atualizar o pet."

        });

    }

}

export async function excluirPet(req, res) {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {

        return res.status(400).json({
            erro: "Identificador inválido."
        });

    }

    try {

        const pet = await excluirPetService(id);

        if (!pet) {

            return res.status(404).json({
                erro: "Pet não encontrado."
            });

        }

        // Remove a fotografia
        await removerFoto(pet.foto_path);

        return res.json({
            mensagem: "Pet excluído com sucesso!"
        });

    } catch (erro) {

        console.error("Erro ao excluir pet:", erro);

        return res.status(500).json({
            erro: "Não foi possível excluir o pet."
        });

    }

}