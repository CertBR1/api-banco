const express = require('express');
const router = express.Router();
const middlewareContas = require('../middleware/middlewareContas');
const controllerContas = require('../controller/controllerContas');
const controllerTransacoes = require('../controller/controllerTransacoes');
const middlewareTransacoes = require('../middleware/middlewareTransacoes');

router.get('/contas',
    middlewareContas.validarSenhaBanco,
    controllerContas.listarContas,
);

router.put('/contas/:numero_conta/usuario',
    middlewareContas.validarNumeroDeConta,
    middlewareContas.verificarExistenciaEmailCpf,
    controllerContas.atualizarConta,
);


router.post('/contas',
    middlewareContas.validarDados,
    controllerContas.criarContas
);

router.delete('/contas/:numero_conta',
    middlewareContas.validarNumeroDeConta,
    controllerContas.deletarConta,
);

router.post('/transacoes/depositar',
    middlewareTransacoes.validarConta,
    middlewareTransacoes.validarDadosESaldo,
    controllerTransacoes.depositar,
);

router.post('/transacoes/sacar',
    middlewareTransacoes.validarConta,
    middlewareTransacoes.validarSenhaTransacoes,

    middlewareTransacoes.validarDadosESaldo,
    controllerTransacoes.sacar,
);

router.post('/transacoes/transferir',
    middlewareTransacoes.validarTransferencia,
    controllerTransacoes.transferir,
);

router.get('/contas/saldo',
    middlewareContas.validarNumeroDeConta,
    middlewareContas.validarSenhaContas,
    controllerContas.consultarSaldo,
);

router.get('/contas/extrato',
    middlewareContas.validarNumeroDeConta,
    middlewareContas.validarSenhaContas,
    controllerContas.consultarExtrato,

);


module.exports = router;