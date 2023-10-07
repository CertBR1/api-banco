const db = require('../db/bancodedados');


const middlewareContas = {
    validarSenhaBanco: (req, res, next) => {
        const { senha_banco } = req.query;
        if (!senha_banco) return res.status(401).json({ "mensagem": "É necessario informar a senha!" });
        if (senha_banco === db.banco.senha) return next();
        return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" });
    },
    //usar na rota POST apenas
    validarDados: (req, res, next) => {
        const dadosConta = req.body;
        const camposObrigatorios = ['nome', 'cpf', 'data_nascimento', 'telefone', 'email', 'senha'];

        const camposFaltantes = camposObrigatorios.filter(element => !dadosConta[element]);
        if (camposFaltantes.length > 0) {
            return res.status(400).json({ mensagem: "É necessário informar todos os campos!" });
        };


        const verificarEmail = db.contas.find(element => element.usuario.email === dadosConta.email);
        const verificarCpf = db.contas.find(element => element.usuario.cpf === dadosConta.cpf);
        if (verificarCpf || verificarEmail) {
            const cpfOuEmail = verificarCpf ? "CPF" : "email";
            return res.status(400).json({ mensagem: `O ${cpfOuEmail} já existe` });
        };
        next();
    },


    validarNumeroDeConta: (req, res, next) => {
        let numero_conta = {};

        if (req.query) {
            numero_conta = req.query.numero_conta
        }
        if (req.params.numero_conta) {
            numero_conta = req.params.numero_conta
        }
        if (!numero_conta) return res.status(400).json({ mensagem: "Número de conta inválido" });
        if (isNaN(Number(numero_conta))) return res.status(400).json({ mensagem: "Número de conta inválido" });
        const numero = db.contas.find((element) => element.numero === numero_conta);
        if (!numero) return res.status(404).json({ mensagem: "Usuario não encontrado" });
        next();
    },

    verificarExistenciaEmailCpf: (req, res, next) => {
        const { cpf, email } = req.body;
        const { numeroConta: numero_conta } = req.params;

        const verificarCpf = db.contas.find(element => element.usuario.cpf === cpf);
        const verificarEmail = db.contas.find(element => element.usuario.email === email);
        if (!verificarCpf || !verificarEmail) return next();
        if (verificarCpf || verificarEmail) {
            if (verificarCpf.numero === numero_conta && verificarEmail.numero === numero_conta) return next();
            const cpfOuEmail = verificarCpf ? "CPF" : "email";
            return res.status(400).json({ mensagem: `O ${cpfOuEmail} já existe e pertence a outra conta` });
        };
    },

    validarSenhaContas: (req, res, next) => {
        const { numero_conta, senha } = req.query;
        const conta = db.contas.find((element) => element.numero === numero_conta);
        if (conta.usuario.senha === senha) return next();
        console.log(conta);
        return res.status(401).json({ mensagem: "Senha incorreta" });
    },

};


module.exports = middlewareContas;