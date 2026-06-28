import argon2 from 'argon2';


export async function gerarHash(senha) {
    try {
        // Cria o hash com parâmetros seguros
        const hash = await argon2.hash(senha, {
            type: argon2.argon2id,   // versão mais resistente a ataques
            memoryCost: 2 ** 16,     // memória usada (quanto maior, mais seguro)
            timeCost: 5,             // número de iterações
            parallelism: 1           // threads paralelas
        });
        return ({ status: true, hash });
    } catch (err) {
        return { status: false, err: err };
    }
}

export async function verificarSenha(senha, hash) {
    try {
        const match = await argon2.verify(hash, senha);
        if (!match) {
            return { status: false, err: 'Senha inválida' };
        }
        return ({ status: true, match }); // true se a senha estiver correta
    } catch (err) {
        return { status: false, err: 'Senha inválida' };
    }
}

// (async () => {
//   const senha = "minhaSenhaUltraSecreta!";
//   const hash = await gerarHash(senha);
//   console.log("Hash gerado:", hash);

//   const valido = await verificarSenha(senha, hash);
//   console.log("Senha válida?", valido);
// })();
