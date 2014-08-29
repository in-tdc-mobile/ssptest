var Banco = function () {
    this.Nome = "SSPchklist";
    this.Versao = "1.0";
    this.Tamanho = 200000;
    var Usuario;
    this.initialize = function () {
        var db = window.openDatabase(this.Nome, this.Versao, this.Nome, this.Tamanho);
        db.transaction(this.criar, this.criarError);
    };
    this.criar = function (tx) {

        /*tx.executeSql('DROP TABLE IF EXISTS Empresa ');
        tx.executeSql('DROP TABLE IF EXISTS Loja ');
        tx.executeSql('DROP TABLE IF EXISTS Pergunta ');
        tx.executeSql('DROP TABLE IF EXISTS Regiao ');
        tx.executeSql('DROP TABLE IF EXISTS Resposta ');
        tx.executeSql('DROP TABLE IF EXISTS Usuario ');
        tx.executeSql('DROP TABLE IF EXISTS UsuarioP ');*/
        tx.executeSql('DROP TABLE IF EXISTS Usuario ')
        tx.executeSql('CREATE TABLE IF NOT EXISTS UsuarioP (Id int, IdEmpresa int, Nome varchar(100), Email varchar(100), Perfil varchar(100), Sigla varchar(10))');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Empresa (Objeto BLOB)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Loja (Objeto BLOB)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Regiao (Objeto BLOB)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Pergunta (Objeto BLOB)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Resposta (Objeto BLOB, IdLoja int)');

    };
    this.criarError = function (err) {
        alerta('Error 9151');
    };

    this.login = function (callback) {
        var db = window.openDatabase(this.Nome, this.Versao, this.Nome, this.Tamanho);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM UsuarioP', [], function (tx, results) {
                var len = results.rows.length;

                for (var i = 0; i < len; i++) {
                    Usuario = new Object();
                    Usuario.Id = results.rows.item(i).Id;
                    Usuario.Nome = results.rows.item(i).Nome;

                    if (results.rows.item(i).IdEmpresa > 0) {
                        Usuario.Empresa = new Object();
                        Usuario.Empresa.Id = results.rows.item(i).IdEmpresa;
                    }
                    else {
                        Usuario.Empresa = null;
                    }

                    Usuario.Email = results.rows.item(i).Email;
                    Usuario.Perfil = new Object();
                    Usuario.Perfil.Nome = results.rows.item(i).Perfil;
                    Usuario.Perfil.Sigla = results.rows.item(i).Sigla;
                    callback(Usuario);
                    break;
                }
            }, function (err) {
                alerta('Error 9150 ' + err);
            });
        }, this.erro, function () {
        });
    };

    this.SalvaLogin = function (_usuario) {
        this.Usuario = _usuario;
        var query = "";

        if (_usuario.Empresa == null || _usuario.Empresa == undefined)
            query = 'INSERT INTO UsuarioP (Id, IdEmpresa, Nome, Email, Perfil, Sigla) VALUES (' + _usuario.Id + ', 0, "' + _usuario.Nome + '", "' + _usuario.Email + '", "' + _usuario.Perfil.Nome + '", "' + _usuario.Perfil.Sigla + '" )';
        else
            query = 'INSERT INTO UsuarioP (Id, IdEmpresa, Nome, Email, Perfil, Sigla) VALUES (' + _usuario.Id + ', ' + _usuario.Empresa.Id + ', "' + _usuario.Nome + '", "' + _usuario.Email + '", "' + _usuario.Perfil.Nome + '", "' + _usuario.Perfil.Sigla + '" )';

        var db = window.openDatabase(this.Nome, this.Versao, this.Nome, this.Tamanho);
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM UsuarioP');
            tx.executeSql(query);
        }, this.erro, function () {
        });
    };

    this.SalvarLojas = function (_dados) {
        var query = 'INSERT INTO Loja (Objeto) VALUES (?)';
        var db = window.openDatabase(this.Nome, this.Versao, this.Nome, this.Tamanho);
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM Loja');
            tx.executeSql(query, [_dados]);
        }, this.erro, function () {
        });
    };

    this.SalvarEmpresas = function (_dados) {
        var query = 'INSERT INTO Empresa (Objeto) VALUES (?)';
        var db = window.openDatabase(this.Nome, this.Versao, this.Nome, this.Tamanho);
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM Empresa');
            tx.executeSql(query, [_dados]);
        }, this.erro, function () {
        });
    };

    this.SalvarRegioes = function (_dados) {
        var query = 'INSERT INTO Regiao (Objeto) VALUES (?)';
        var db = window.openDatabase(this.Nome, this.Versao, this.Nome, this.Tamanho);
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM Regiao');
            tx.executeSql(query, [_dados]);
        }, this.erro, function () {
        });
    };

    this.SalvarPerguntas = function (_dados) {
        var query = 'INSERT INTO Pergunta (Objeto) VALUES (?)';
        var db = window.openDatabase(this.Nome, this.Versao, this.Nome, this.Tamanho);
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM Pergunta');
            tx.executeSql(query, [_dados]);
        }, this.erro, function () {
            alerta('Database updated to work off-line.')
            $('.divbtAtuBase img').attr('src', 'includes/img/ico-AtuBase.png');
        });
    };
    this.SalvarRespostas = function (_dados, _IdLoja, _callback) {
        var query = 'INSERT INTO Resposta (Objeto, IdLoja) VALUES (?,' + _IdLoja + ' )';
        var db = window.openDatabase(this.Nome, this.Versao, this.Nome, this.Tamanho);
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM Resposta where IdLoja = ' + _IdLoja);
            tx.executeSql(query, [_dados]);
        }, function (err) {
            alerta('Error 9152');
            _callback(false);
        }, function () {
            _callback(true);
        });
    };
    this.ContarRespostas = function (_callback) {
        var db = window.openDatabase(this.Nome, this.Versao, this.Nome, this.Tamanho);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Resposta', [], function (tx, results) {
                var total = results.rows.length;
                _callback(total);
            }, function (err) {
                alerta('Error 9153');
            });
        }, this.erro);
    };
    this.ObterRespostas = function (_IdLoja, _callback) {
        var query = 'SELECT * FROM Resposta where IdLoja=' + _IdLoja;
        var _retornar = null;
        var db = window.openDatabase(this.Nome, this.Versao, this.Nome, this.Tamanho);
        db.transaction(function (tx) {
            tx.executeSql(query, [], function (tx, results) {
                if (results.rows.length > 0) {
                    _retornar = results.rows.item(0).Objeto;
                }
            }, function (err) {
                alerta('Error 9154');
            });
        }, function (err) {
            alerta('Error 9155');
        }, function () {
            if (_retornar == null)
                _callback(_retornar);
            else
                _callback($.parseJSON(_retornar));
        });
    };
    this.ObterRespostasLista = function () {
        var query = 'SELECT IdLoja FROM Resposta';
        var db = window.openDatabase(this.Nome, this.Versao, this.Nome, this.Tamanho);
        var Arretorno = new Array();
        db.transaction(function (tx) {
            tx.executeSql(query, [], function (tx, results) {
                for (var i = 0; i < results.rows.length; i++) {
                    Arretorno.push(results.rows.item(i).IdLoja);
                }
            }, function (err) {
                alerta('Error 9156');
            });
        }, function (err) {
            alerta('Error 9157');
        }, function () {
            sync.SincronizarStep2(Arretorno);
        });
    };
    this.ObterRespostaUnica = function (_IdLoja, _callback) {
        var query = 'SELECT * FROM Resposta where IdLoja=' + _IdLoja;
        var db = window.openDatabase(this.Nome, this.Versao, this.Nome, this.Tamanho);
        var _obj;
        db.transaction(function (tx) {
            tx.executeSql(query, [], function (tx, results) {
                if (results.rows.length > 0) {
                    _obj = results.rows.item(0).Objeto;
                }
            }, function (err) {
                alerta('Error 9158');
            });
        }, function (err) {
            alerta('Error 9159');
        }, function () {
            sync.SincronizarStep4(_obj);
        });
    };
    this.ApagarResposta = function (_IdLoja) {
        var query = 'DELETE FROM Resposta where IdLoja=' + _IdLoja;
        var db = window.openDatabase(this.Nome, this.Versao, this.Nome, this.Tamanho);
        db.transaction(function (tx) {
            tx.executeSql(query);
        }, function (err) {
            alerta('Error 9160');
        });
    };
    this.ObterEmpresas = function (_callback) {
        var db = window.openDatabase(this.Nome, this.Versao, this.Nome, this.Tamanho);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Empresa', [], function (tx, results) {
                var r = results.rows.item(0).Objeto;
                _callback(eval(r));
            }, function (err) {
                alerta('Error 9161');
            });
        }, this.erro);
    };
    this.ObterLojas = function (_callback, _idEmpresa) {
        var db = window.openDatabase(this.Nome, this.Versao, this.Nome, this.Tamanho);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Loja', [], function (tx, results) {
                var r = results.rows.item(0).Objeto;

                if (_idEmpresa.toString() == "0") {
                    _callback(eval(r));
                }
                else {
                    r = eval(r);
                    var LojasRetorno = new Array();

                    for (var i = 0; i < r.length; i++) {
                        if (r[i].IdEmpresa == _idEmpresa) {
                            LojasRetorno.push(r[i]);
                        }
                    }
                    _callback(LojasRetorno);
                }
            }, function (err) {
                alerta('Error 9162');
            });
        }, this.erro);
    };
    this.ObterRegioes = function (_callback, _idEmpresa) {
        var db = window.openDatabase(this.Nome, this.Versao, this.Nome, this.Tamanho);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Regiao', [], function (tx, results) {
                if (results.rows.length == 0) {
                    alerta('No saved region, go online.');
                    return;
                }
                var r = results.rows.item(0).Objeto;

                if (_idEmpresa.toString() == "0") {
                    _callback(eval(r));
                }
                else {
                    r = eval(r);
                    var RegioesRetorno = new Array();

                    for (var i = 0; i < r.length; i++) {
                        if (r[i].IdEmpresa == _idEmpresa) {
                            RegioesRetorno.push(r[i]);
                        }
                    }
                    _callback(RegioesRetorno);
                }
            }, function (err) {
                alerta('Error 9162');
            });
        }, this.erro);
    };
    this.ObterPerguntas = function (_callback) {
        var db = window.openDatabase(this.Nome, this.Versao, this.Nome, this.Tamanho);
        var _retornar;
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Pergunta', [], function (tx, results) {
                _retornar = results.rows.item(0).Objeto;
            }, function (err) {
                alerta('Error 9163');
            });
        }, function (err) {
            alerta('Error 9164');
        }, function () {
            _callback(eval(_retornar));
        });
    };

    this.erro = function (err) {
        alert(err);
    };
    this.success = function () {
    };
    this.ListaLogin = function () {
        var db = window.openDatabase(this.Nome, this.Versao, this.Nome, this.Tamanho);
        db.transaction(this.queryDB, this.erro);
    };

    this.initialize();
}
