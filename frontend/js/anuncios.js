// Elementos da página
const listaPets = document.getElementById("listaPets");
const mensagem = document.getElementById("mensagem");

// Consulta os pets no backend
async function carregarPets() {

    try {

        mensagem.textContent = "Carregando animais...";

        // Solicita os dados ao backend
        const resposta = await fetch("/api/pets");

        const resultado = await resposta.json();

        // Verifica a resposta HTTP
        if (!resposta.ok) {

            throw new Error("Erro ao consultar os animais.");

        }

        // Limpa a lista
        listaPets.replaceChildren();

        // Verifica se existem animais
        if (resultado.pets.length === 0) {

            mensagem.textContent =
                "Nenhum animal disponível para adoção.";

            return;

        }

        mensagem.textContent =
            `${resultado.quantidade} animais encontrados.`;

        // Percorre os animais recebidos
        resultado.pets.forEach(pet => {

            // Cria o cartão
            const card = document.createElement("article");

            card.classList.add("pet-card");

            // Cria a fotografia
            const imagem = document.createElement("img");

            imagem.src = pet.foto_url;

            imagem.alt = `Foto de ${pet.nome}`;

            // Cria o nome
            const nome = document.createElement("h2");

            nome.textContent = pet.nome;

            // Cria as informações
            const informacoes = document.createElement("p");

            informacoes.textContent =
                `${pet.fase} | ${pet.raca} | ${pet.porte}`;

            // Adiciona os elementos ao cartão
            card.append(imagem, nome, informacoes);

            // Adiciona o cartão à página
            listaPets.append(card);

        });

    } catch (erro) {

        console.error("Erro:", erro);

        mensagem.textContent =
            "Não foi possível carregar os animais.";

    }

}

// Executa a consulta ao abrir a página
carregarPets();