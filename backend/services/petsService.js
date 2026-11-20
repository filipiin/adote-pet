import {
    cadastrarPet as salvarNoBanco,
    listarPets as buscarPets,
    buscarPetPorId as buscarPetNoBanco,
    atualizarPet as atualizarPetNoBanco,
    excluirPet as excluirPetNoBanco
} from "../repositories/petsRepository.js";

/*
Serviços do petsService 
    01. Listagem dos pets
    02. Cadastro dos pets
    03. Busca por id dos pets
    04. Remoção dos anúncios dos pets 
    05. Atualização das informaçẽos dos anúncios dos pets
*/

// Cria um erro de validação
function erroValidacao(mensagem) {

    const erro = new Error(mensagem);

    erro.statusCode = 400;

    return erro;

}

// Lista os pets disponíveis
export async function listarPets() {

    const pets = await buscarPets();

    // Organiza os dados para o frontend
    return pets.map(pet => ({ ...pet,

        vacinas: JSON.parse(pet.vacinas || "[]"),
        
        foto_url: "/" + pet.foto_path.replace(/\\/g, "/")

    }));

}

// Processa o cadastro do pet
export async function cadastrarPet(formulario, arquivo) {

    const {
        tutor,
        nascimento,
        telefone,
        pet,
        adocao,
        idade,
        raca,
        porte,
        castrado,
        vacinacao,
        vacinas
    } = formulario;

    // Verifica os campos obrigatórios
    const campos = [
        tutor,
        nascimento,
        telefone,
        pet,
        adocao,
        idade,
        raca,
        porte,
        castrado,
        vacinacao
    ];

    if (campos.some(campo =>
        typeof campo !== "string" || !campo.trim()
    )) {

        throw erroValidacao(
            "Preencha todos os campos obrigatórios."
        );

    }

    if (!arquivo) {

        throw erroValidacao(
            "A fotografia do pet é obrigatória."
        );

    }

    // Converte as vacinas para array
    let listaVacinas;

    try {

        listaVacinas = JSON.parse(vacinas || "[]");

        if (
            !Array.isArray(listaVacinas) ||
            !listaVacinas.every(vacina => typeof vacina === "string")
        ) {
            throw new Error();
        }

    } catch {

        throw erroValidacao(
            "Informações de vacinação inválidas."
        );

    }

    // Organiza os dados do tutor
    const dadosTutor = {

        nome: tutor,
        data_nascimento: nascimento,
        telefone: telefone

    };

    // Organiza os dados do pet
    const dadosPet = {

        nome: pet,
        forma_adocao: adocao,
        fase: idade,
        raca: raca,
        porte: porte,
        castrado: castrado,
        vacinacao: vacinacao,
        vacinas: listaVacinas,
        foto_path: arquivo.path

    };

    // Solicita o armazenamento ao repository
    return salvarNoBanco(dadosTutor, dadosPet);

}

// Busca um pet específico
export async function buscarPetPorId(id) {

    const pet = await buscarPetNoBanco(id);

    // Verifica se o registro existe
    if (!pet) {
        return null;
    }

    // Organiza os dados para o frontend
    const { foto_path, ...dadosPet } = pet;

    return {

        ...dadosPet,

        vacinas: JSON.parse(pet.vacinas || "[]"),

        foto_url: "/" + foto_path.replace(/\\/g, "/")

    };

}

// Atualiza um cadastro de pet
export async function atualizarPet(id, formulario, arquivo) {

    const {
        pet,
        adocao,
        idade,
        raca,
        porte,
        castrado,
        vacinacao,
        vacinas
    } = formulario;

    // Verifica os campos obrigatórios
    const campos = [
        pet,
        adocao,
        idade,
        raca,
        porte,
        castrado,
        vacinacao
    ];

    if (campos.some(campo =>
        typeof campo !== "string" || !campo.trim()
    )) {

        const erro = new Error("Preencha todos os campos.");

        erro.statusCode = 400;

        throw erro;

    }

    // Converte as vacinas
    let listaVacinas;

    try {

        listaVacinas = JSON.parse(vacinas || "[]");

        if (
            !Array.isArray(listaVacinas) ||
            !listaVacinas.every(item => typeof item === "string")
        ) {
            throw new Error();
        }

    } catch {

        const erro = new Error("Vacinas inválidas.");

        erro.statusCode = 400;

        throw erro;

    }

    // Organiza os dados
    const dadosPet = {

        nome: pet,
        forma_adocao: adocao,
        fase: idade,
        raca: raca,
        porte: porte,
        castrado: castrado,
        vacinacao: vacinacao,
        vacinas: listaVacinas,

        foto_path: arquivo?.path ?? null

    };

    return atualizarPetNoBanco(id, dadosPet);

}

export async function excluirPet(id) {

    return excluirPetNoBanco(id);

}