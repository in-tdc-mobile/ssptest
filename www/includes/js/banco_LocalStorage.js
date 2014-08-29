var Banco = function () {
    var Usuario;

    this.login = function (callback) {
        try {
            if (window.localStorage.getItem("UsuarioP") != undefined) {
                Usuario = JSON.parse(window.localStorage.getItem("UsuarioP"));
            }
        } catch (e) {
            alerta(e.message);
        }
        callback(Usuario);
    };
    this.SalvaLogin = function (_usuario) {
        try {
            window.localStorage.setItem("UsuarioP", JSON.stringify(_usuario));
            localStorage.setItem("UsuarioP", JSON.stringify(_usuario));
        } catch (e) {
            alerta(e.message);
        }
    };
    this.SalvarLojas = function (_dados) {
        window.localStorage.setItem("Lojas", _dados);
    };
    this.SalvarEmpresas = function (_dados) {
        window.localStorage.setItem("Empresas", _dados);
    };
    this.SalvarRegioes = function (_dados) {
        window.localStorage.setItem("Regioes", _dados);
    };
    this.SalvarPerguntas = function (_dados) {
        window.localStorage.Perguntas = _dados;
        alerta('Database updated to work off-line.');
        $('.divbtAtuBase img').attr('src', 'includes/img/ico-AtuBase.png');
    };

    this.SalvarRespostas = function (_dados, _IdLoja, _callback) {
        var resposTAS = new Array();
        try {
            if (window.localStorage.getItem("Respostas") != undefined) {
                resposTAS = JSON.parse(window.localStorage.getItem("Respostas"));

                for (var i = 0; i < resposTAS.length; i++) {
                    if (resposTAS[i].Loja.Id == _IdLoja) {
                        resposTAS[i] = _dados;
                        window.localStorage.setItem("Respostas", JSON.stringify(resposTAS).replace(/[\u0026]+/g, ""));
                        _callback(true);
                        return;
                    }
                }
            }

            resposTAS.push(_dados);
            window.localStorage.setItem("Respostas", JSON.stringify(resposTAS).replace(/[\u0026]+/g, ""));
            _callback(true);
        } catch (e) {
            alerta('Error 9152: ' + e.message);
            _callback(false);
        }
    };
    this.ContarRespostas = function (_callback) {
        var resposTAS = new Array();

        if (window.localStorage.getItem("Respostas") != undefined) {
            resposTAS = JSON.parse(window.localStorage.getItem("Respostas"));
        }
        _callback(resposTAS.length.toString());
    };
    this.ObterRespostas = function (_IdLoja, _callback) {
        var resposTAS = new Array();
        try {
            if (window.localStorage.getItem("Respostas") != undefined) {
                resposTAS = JSON.parse(window.localStorage.getItem("Respostas"));

                for (var i = 0; i < resposTAS.length; i++) {
                    if (resposTAS[i].Loja.Id == _IdLoja) {
                        _callback(resposTAS[i]);
                        return;
                    }
                }
            }
            _callback(null);
        } catch (e) {
            alerta('Error 9159: ' + e.message);
            return;
        }
    };
    this.ObterRespostasLista = function () {
        var resposTAS = new Array();
        var Arretorno = new Array();

        if (window.localStorage.getItem("Respostas") != undefined)
            resposTAS = JSON.parse(window.localStorage.getItem("Respostas"));

        for (var i = 0; i < resposTAS.length; i++) {
            Arretorno.push(resposTAS[i].Loja.Id);
        }

        sync.SincronizarStep2(Arretorno);
    };

    this.ObterRespostaUnica = function (_IdLoja) {
        var resposTAS = new Array();
        try {
            if (window.localStorage.getItem("Respostas") != undefined) {
                resposTAS = JSON.parse(window.localStorage.getItem("Respostas"));

                for (var i = 0; i < resposTAS.length; i++) {
                    if (resposTAS[i].Loja.Id == _IdLoja) {
                        sync.SincronizarStep4(JSON.stringify(resposTAS[i]).replace(/[\u0026]+/g, ""));
                        return;
                    }
                }
            }
            _callback(null);
        } catch (e) {
            alerta('Error 9259: ' + e.message);
            return;
        }
    };

    this.ApagarResposta = function (_IdLoja) {
        var resposTAS = new Array();
        if (window.localStorage.getItem("Respostas") != undefined) {
            resposTAS = JSON.parse(window.localStorage.getItem("Respostas"));

            for (var i = 0; i < resposTAS.length; i++) {
                if (resposTAS[i].Loja.Id == _IdLoja) {
                    resposTAS.splice(i, 1);
                    window.localStorage.setItem("Respostas", JSON.stringify(resposTAS).replace(/[\u0026]+/g, ""));
                    break;
                }
            }
        }

    };
    this.ObterEmpresas = function (_callback) {
        if (window.localStorage.getItem("Empresas") != undefined) {
            _callback(JSON.parse(window.localStorage.getItem("Empresas")));
        }
    };
    this.ObterLojas = function (_callback, _idEmpresa) {
        var loJAS;
        if (window.localStorage.getItem("Lojas") != undefined) {
            loJAS = JSON.parse(window.localStorage.getItem("Lojas"));
        }
        else {
            alerta('No saved stores, go online.');
            return;
        }

        if (_idEmpresa.toString() == "0") {
            _callback(loJAS);
        }
        else {
            var LojasRetorno = new Array();

            for (var i = 0; i < loJAS.length; i++) {
                if (loJAS[i].IdEmpresa == _idEmpresa) {
                    LojasRetorno.push(loJAS[i]);
                }
            }
            _callback(LojasRetorno);
        }


    };
    this.ObterRegioes = function (_callback, _idEmpresa) {
        var regiOES;

        if (window.localStorage.getItem("Regioes") != undefined) {
            regiOES = JSON.parse(window.localStorage.getItem("Regioes"));
        }
        else {
            alerta('No saved region, go online.');
            return;
        }

        if (_idEmpresa.toString() == "0") {
            _callback(regiOES);
        }
        else {
            var RegioesRetorno = new Array();

            for (var i = 0; i < regiOES.length; i++) {
                if (regiOES[i].IdEmpresa == _idEmpresa) {
                    RegioesRetorno.push(regiOES[i]);
                }
            }
            _callback(RegioesRetorno);
        }

    };
    this.ObterPerguntas = function (_callback) {
        if (window.localStorage.getItem("Perguntas") != undefined)
            _callback(JSON.parse(window.localStorage.getItem("Perguntas")));
        else
            alerta('No questions, go online.');
    };

}
//function debugBase() {
//    try {
//        debug("Base DEGUB");
//        debug("localStorage: " + localStorage);
//        debug("localStorage.length: " + localStorage.length.toString());

//        for (var i = 0; i < localStorage.length; i++) {
//            var chave = localStorage.key(i).toString();
//            debug(chave);
//            debug(localStorage.getItem(localStorage.key(i)));
//        }
//    } catch (e) {
//        debug("Erro DEBUG BASE :" + e.message);
//    }
//}