import Database from "better-sqlite3";

// Conecta ao banco de dados
const db = new Database("./database/pets.db");

// Ativa as chaves estrangeiras
db.pragma("foreign_keys = ON");

// Cria as tabelas
db.exec(`

    CREATE TABLE IF NOT EXISTS tutores (

        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        data_nascimento TEXT NOT NULL,
        telefone TEXT NOT NULL

    );

    CREATE TABLE IF NOT EXISTS pets (

        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tutor_id INTEGER NOT NULL,
        nome TEXT NOT NULL,
        forma_adocao TEXT NOT NULL,
        fase TEXT NOT NULL,
        raca TEXT NOT NULL,
        porte TEXT NOT NULL,
        castrado TEXT NOT NULL,
        vacinacao TEXT NOT NULL,
        vacinas TEXT DEFAULT '[]',
        foto_path TEXT NOT NULL,
        status TEXT DEFAULT 'disponivel',

        FOREIGN KEY (tutor_id)
            REFERENCES tutores(id)

    );

`);

console.log("Banco de dados conectado!");

export default db;