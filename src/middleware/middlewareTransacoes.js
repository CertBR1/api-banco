const db = require('../db/bancodedados');

const middlewareTransacoes = {
    validarDadosESaldo: (req, res, next) => {
        const camposObrigatorios = ['numero_conta', 'valor'];
        const dadosTransacao = req.body;

        const camposFaltantes = camposObrigatorios.filter(element => !dadosTransacao[element]);
        if (camposFaltantes.length > 0) {
            return res.status(400).json({ mensagem: "É necessário informar o numero da conta e o valor do deposito" });
        };

        if (isNaN(Number(dadosTransacao.valor))) return res.status(400).json({ mensagem: "O valor do deposito é inválido" });
        if (dadosTransacao.valor <= 0) return res.status(400).json({ mensagem: "O valor do deposito deve ser maior que 0" });
        next();
    },
    validarConta: (req, res, next) => {
        const { numero_conta } = req.body;
        const usuario = db.contas.find((element) => element.numero === numero_conta);
        if (!usuario) return res.status(404).json({ mensagem: "Usuario não encontrado" });
        return next();
    },
    validarSenhaTransacoes: (req, res, next) => {
        const { numero_conta, senha } = req.body;
        const conta = db.contas.find((element) => element.numero === numero_conta);
        if (conta.usuario.senha === senha) return next();
        console.log(conta);
        return res.status(401).json({ mensagem: "Senha incorreta" });
    },

    validarTransferencia: (req, res, next) => {
        const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
        const contaOrigem = db.contas.find(element => element.numero === numero_conta_origem);
        const contaDestino = db.contas.find(element => element.numero === numero_conta_destino);
        if (!contaOrigem) return res.status(404).json({ mensagem: "Conta de origem nao encontrada" });
        if (!contaDestino) return res.status(404).json({ mensagem: "Conta de destino nao encontrada" });
        if (contaOrigem.usuario.senha !== senha) return res.status(401).json({ mensagem: "A senha informada esta incorreta" });
        if (contaOrigem.saldo < valor) return res.status(400).json({ mensagem: "Saldo insuficiente" });
        next();
    },
};

module.exports = middlewareTransacoes;