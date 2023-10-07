const db = require('../db/bancodedados');

const controllerBanco = {
    listarContas: (req, res) => {
        return res.json(db.contas);
    },
    criarContas: (req, res) => {
        const dadosConta = req.body;

        const novaConta = {
            numero: (db.contas.length === 0 ? "1" : (Number(db.contas[db.contas.length - 1].numero) + 1)).toString(),
            saldo: 0,
            usuario: {
                nome: dadosConta.nome,
                cpf: dadosConta.cpf,
                data_nascimento: dadosConta.data_nascimento,
                telefone: dadosConta.telefone,
                email: dadosConta.email,
                senha: dadosConta.senha,
            },
        };

        db.contas.push(novaConta);
        return res.status(201).json({ mensagem: "Conta Criada com sucesso!" });
    },
    atualizarConta: (req, res) => {
        const { numero_conta } = req.params;
        const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
        const { usuario } = db.contas.find((element) => element.numero === numero_conta);

        usuario.nome = nome;
        usuario.cpf = cpf;
        usuario.data_nascimento = data_nascimento;
        usuario.telefone = telefone;
        usuario.email = email;
        usuario.senha = senha;

        return res.status(204).send();
    },
    deletarConta: (req, res) => {
        const { numero_conta } = req.params;
        const conta = db.contas.find((element) => element.numero === numero_conta);

        if (conta.saldo > 0) {
            return res.status(405).json({ mensagem: "Só é possivel deletar contas sem saldo" });
        }

        const contasFiltradas = db.contas.filter((element) => element.numero !== numero_conta);
        db.contas = contasFiltradas;

        return res.status(204).send();
    },
    consultarSaldo: (req, res) => {
        const { numero_conta } = req.query;
        const conta = db.contas.find(element => element.numero === numero_conta);
        return res.status(200).json({ saldo: conta.saldo });
    },

    consultarExtrato: (req, res) => {
        const { numero_conta } = req.query;
        const depositos = db.depositos.filter(element => element.numero_conta === numero_conta);
        const saques = db.saques.filter(element => element.numero_conta === numero_conta);
        const transferenciasEnviadas = db.transferencias.filter(element => element.numero_conta_origem === numero_conta);
        const transferenciasRecebidas = db.transferencias.filter(element => element.numero_conta_destino === numero_conta);
        return res.status(200).json({
            depositos,
            saques,
            transferenciasEnviadas,
            transferenciasRecebidas,
        });
    },
};

module.exports = controllerBanco;