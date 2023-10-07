const db = require('../db/bancodedados');


const controllerTransacoes = {
    depositar: (req, res) => {
        const { valor, numero_conta } = req.body;
        const contaDeposito = db.contas.find((element) => element.numero === numero_conta);
        contaDeposito.saldo += valor;
        db.depositos.push({
            data: new Date().toLocaleString('pt-BR'),
            numero_conta: numero_conta,
            valor: valor,
        });
        return res.status(204).send();
    },
    sacar: (req, res) => {
        const { valor, numero_conta } = req.body;
        const contaDeposito = db.contas.find((element) => element.numero === numero_conta);
        if (contaDeposito.saldo < valor) return res.status(400).json({ mensagem: "Saldo insuficiente" });
        contaDeposito.saldo -= valor;
        db.saques.push({
            data: new Date().toLocaleString('pt-BR'),
            numero_conta: numero_conta,
            valor: valor,
        });
        return res.status(204).send();

    },
    transferir: (req, res) => {
        const { numero_conta_origem, numero_conta_destino, valor } = req.body;
        const contaOrigem = db.contas.find(element => element.numero === numero_conta_origem);
        const contaDestino = db.contas.find(element => element.numero === numero_conta_destino);

        contaOrigem.saldo -= valor;
        contaDestino.saldo += valor;

        db.transferencias.push({
            data: new Date().toLocaleString('pt-BR'),
            numero_conta_origem,
            numero_conta_destino,
            valor,
        });
        return res.status(204).send();
    },
};

module.exports = controllerTransacoes;