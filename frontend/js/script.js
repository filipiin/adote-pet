
const form = document.getElementById("cadastroPet");

// Controle da vacinação
document.getElementById("vaccination").addEventListener("change", function() {

    document.getElementById("vaccines").hidden =
        this.value !== "algumas_vacinas";

});

document.getElementById("raca").addEventListener("change", function() {

    document.getElementById("raca").hidden =
        this.value !== "outros";

});

// Cadastro
form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const cadastro = {

        tutor: document.getElementById("nameOwner").value,
        nascimento: document.getElementById("dateBirth").value,
        telefone: document.getElementById("phoneContact").value,

        pet: document.getElementById("namePet").value,
        adocao: document.getElementById("handOverPet").value,
        idade: document.getElementById("agePet").value,
        raca: document.getElementById("dogBreed").value,
        porte: document.getElementById("dogSize").value,
        foto: document.getElementById("photoPet").files[0],

        castrado: document.querySelector(
            'input[name="castrado"]:checked'
        ).value,

        vacinacao: document.getElementById("vaccination").value,

        vacinas: Array.from(
            document.querySelectorAll(
                'input[name="vaccines"]:checked'
            )
        ).map(opcao => opcao.value)

    };

    console.table(cadastro);

    // Organiza os dados para envio
    const dados = new FormData();

    dados.append("tutor", cadastro.tutor);
    dados.append("nascimento", cadastro.nascimento);
    dados.append("telefone", cadastro.telefone);

    dados.append("pet", cadastro.pet);
    dados.append("adocao", cadastro.adocao);
    dados.append("idade", cadastro.idade);
    dados.append("raca", cadastro.raca);
    dados.append("porte", cadastro.porte);

    dados.append("foto", cadastro.foto);

    dados.append("castrado", cadastro.castrado);
    dados.append("vacinacao", cadastro.vacinacao);

    dados.append("vacinas", JSON.stringify(cadastro.vacinas));

    // Envia os dados para o backend
    try {

        const resposta = await fetch("/api/pets", {

            method: "POST",
            body: dados

        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao enviar cadastro.");
        }

        console.log("Resposta do servidor:", resultado);

        alert(resultado.mensagem);

    } catch (erro) {

        console.error("Erro:", erro);

        alert("Não foi possível enviar o cadastro.");

    }

});
