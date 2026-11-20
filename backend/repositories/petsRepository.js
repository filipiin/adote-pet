import db from "../database.js";

// Inserção do tutor
const inserirTutor = db.prepare(`
    INSERT INTO tutores (
        nome,
        data_nascimento,
        telefone
    )
    VALUES (?, ?, ?)
`);

// Inserção do pet
const inserirPet = db.prepare(`
    INSERT INTO pets (
        tutor_id,
        nome,
        forma_adocao,
        fase,
        raca,
        porte,
        castrado,
        vacinacao,
        vacinas,
        foto_path
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Transação para cadastrar tutor e pet
const cadastrar = db.transaction((tutor, pet) => {

    // Insere o tutor
    const resultadoTutor = inserirTutor.run(
        tutor.nome,
        tutor.data_nascimento,
        tutor.telefone
    );

    // Recupera o ID gerado
    const tutorId = Number(resultadoTutor.lastInsertRowid);
    
    // Insere o pet relacionado ao tutor
    const resultadoPet = inserirPet.run(
        tutorId,
        pet.nome,
        pet.forma_adocao,
        pet.fase,
        pet.raca,
        pet.porte,
        pet.castrado,
        pet.vacinacao,
        JSON.stringify(pet.vacinas),
        pet.foto_path
    );

        // Retorna os identificadores
        return {
            tutorId: tutorId,
            petId: Number(resultadoPet.lastInsertRowid)
        };
            
    });

    // Consulta os pets disponíveis para adoção
const consultarPets = db.prepare(`
    SELECT
        id,
        tutor_id,
        nome,
        forma_adocao,
        fase,
        raca,
        porte,
        castrado,
        vacinacao,
        vacinas,
        foto_path,
        status
    FROM pets
    WHERE status = ?
    ORDER BY id DESC
`);

// Consulta um pet pelo identificador
const consultarPetPorId = db.prepare(`
    SELECT
        id,
        nome,
        forma_adocao,
        fase,
        raca,
        porte,
        castrado,
        vacinacao,
        vacinas,
        foto_path,
        status
    FROM pets
    WHERE id = ?
`);
  

// Consulta os dados atuais antes da atualização
const consultarPetAtual = db.prepare(`
    SELECT foto_path
    FROM pets
    WHERE id = ?
`);

// Atualiza as informações do pet
const atualizarPetSQL = db.prepare(`
    UPDATE pets
    SET
        nome = ?,
        forma_adocao = ?,
        fase = ?,
        raca = ?,
        porte = ?,
        castrado = ?,
        vacinacao = ?,
        vacinas = ?,
        foto_path = ?
    WHERE id = ?
`);

// Transação de atualização
const atualizarTransacao = db.transaction((id, pet) => {

    // Busca o registro existente
    const existente = consultarPetAtual.get(id);

    if (!existente) {
        return null;
    }

    // Mantém a foto antiga caso não exista uma nova
    const fotoFinal = pet.foto_path ?? existente.foto_path;

    // Atualiza os dados
    const resultado = atualizarPetSQL.run(
        pet.nome,
        pet.forma_adocao,
        pet.fase,
        pet.raca,
        pet.porte,
        pet.castrado,
        pet.vacinacao,
        JSON.stringify(pet.vacinas),
        fotoFinal,
        id
    );

    if (resultado.changes === 0) {
        return null;
    }

    return {
        fotoAntiga: existente.foto_path,
        fotoAtual: fotoFinal
    };

});

// Função exportada
export async function atualizarPet(id, pet) {

    return atualizarTransacao(id, pet);

}

// Função de alteração de status
export async function alterarStatusPet(id, status) {

    const resultado = atualizarStatus.run(status, id);

    return resultado.changes > 0;

}
// Função para listar os pets
export async function listarPets() {

    return consultarPets.all("disponivel");

}

// Função disponibilizada para as rotas
export async function cadastrarPet(tutor, pet) {

    return cadastrar(tutor, pet);

}


// Busca um pet específico
export async function buscarPetPorId(id) {

    return consultarPetPorId.get(id);

}

// Consulta a fotografia do pet
const consultarPetParaExcluir = db.prepare(`
    SELECT foto_path
    FROM pets
    WHERE id = ?
`);

// Exclui o registro
const excluirPetSQL = db.prepare(`
    DELETE FROM pets
    WHERE id = ?
`);

// Transação de exclusão
const excluirTransacao = db.transaction((id) => {

    // Busca o pet
    const pet = consultarPetParaExcluir.get(id);

    if (!pet) {
        return null;
    }

    // Exclui o registro
    const resultado = excluirPetSQL.run(id);

    if (resultado.changes === 0) {
        return null;
    }

    // Devolve o caminho da fotografia
    return {
        foto_path: pet.foto_path
    };

});

export async function excluirPet(id) {

    return excluirTransacao(id);

}