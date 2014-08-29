function MostraPagina(pagina) {
    $('#' + pagina).css('left', document.getElementsByTagName('body')[0].clientWidth + 'px');
    $('#' + pagina).css('display', 'block');
    $('#' + pagina).transition({ left: '0px', delay: 1000 });
}

function MostraAba(pagina) {
    $('#aba1,#aba2,#aba3,#aba4').css('display', '');
    $('#' + pagina + ' .ui-content>div').hide();
    $('#' + pagina).css('display', 'block');

    $('#' + pagina + ' .ui-content>div:lt(12)').show();

    var m = 12;
    var t = $('#' + pagina + ' .ui-content>div').length;
    var timer = setInterval(function () {
        $('#' + pagina + ' .ui-content>div:lt(' + (m + 12) + ')').show();
        m += 12;
        if (m > t)
            clearInterval(timer);
    }, 400);
}
function AtualizaBaseLocal() {
    if (isOFFline())
        alerta("Internet connection necessary to update local database!");
    else {
        $('.divbtAtuBase img').attr('src', 'includes/img/loading.gif');
        CarregaDadosOff();
    }
}

function MostraHome() {
    $('#aba1,#aba2,#aba3,#aba4').css('display', '');
    $('#home').css('left', '-' + document.getElementsByTagName('body')[0].clientWidth + 'px');
    $('#home').css('display', 'block');
    $('#home').transition({ left: '0px', opacity: 1, delay: 300 });
    verificaSincronizacao();
    $('.divLoadingMaior').hide();
}

function ChecaCheck(obj) {
    if ($(obj).hasClass('ui-btn-up-c'))
        return;

    if ($(obj).hasClass('ui-btn-active'))
        $(obj).removeClass('ui-btn-active');
    else
        $(obj).addClass('ui-btn-active');
}

function YesNoCheck(obj) {

    if ($(obj).hasClass('ui-btn-active'))
        $(obj).find('.ui-btn-text').text("No");
    else
        $(obj).find('.ui-btn-text').text("Yes")
}

function multiReplace(str, match, repl) {
    do {
        str = str.replace(match, repl);
    } while (str.indexOf(match) !== -1);
    return str;
}

function MostraComentarios(id, img) {
    if ($('.' + id).is(':visible')) {
        $('.' + id).hide();
        $(img).attr('src', 'includes/img/ico-mais.png');
    }
    else {
        $('.' + id).show();
        $(img).attr('src', 'includes/img/ico-menos.png');
    }
}

function MostraInfoAdicional(id) {
    if ($('.' + id).is(':visible'))
        $('.' + id).hide();
    else
        $('.' + id).show();
}

function alerta(message, title) {
    if (title == null || title == undefined)
        title = "SSP Checklist";

    if (!DEV) {
        if (navigator.notification != undefined && navigator.userAgent.match(/Windows Phone|IEMobile/i) == null)
            navigator.notification.alert(message.toString(), null, title.toString(), "OK");
        else
            alert(title ? (title.toString() + ": " + message.toString()) : message.toString());
    } else {
        alert(title ? (title.toString() + ": " + message.toString()) : message.toString());
    }
}
function debug(msgg) {
    $('.debugs').html($('.debugs').html() + msgg + "<br>");
}
function confirma(message, title, _callback) {
    if (title == null || title == undefined)
        title = "SSP Checklist";

    if (!DEV) {
        if (navigator.notification != undefined && navigator.userAgent.match(/Windows Phone|IEMobile/i) == null) {
            navigator.notification.confirm(message.toString(), _callback, title.toString(), "Yes,No");
        }
        else {
            if (confirm(message.toString()))
                _callback(1);
        }
    } else {
        if (confirm(message.toString()))
            _callback(1);
    }
}

function retDeslogar(button) {
    if (button == 1) {
        CodigoUsuario = null;
        CodigoEmpresa = null;
        CodigoCheckListAtual = null;
        LojaSelecionada = null;

        $('#txt-password').val('');
        $('.pgCategoria').remove();
        $('#divLoadingLojas').show();
        $('#divCmbEmpresas').hide();
        $('#divCmbLojas').hide();
        $('#home').css('display', '');
        $('#login').css('left', '-' + document.getElementsByTagName('body')[0].clientWidth + 'px');
        $('#login').css('display', 'block');
        $('#login').transition({ left: '0px', opacity: 1, delay: 300 });
    }
}

function Cancela() {
    confirma("Cancel the Checklist?", "Are you sure?", retCancela);
}
function retCancela(button) {
    if (button == 1)
        MostraHome();
}
function ConfirmaSalva() {
    confirma("Save now?", "Are you sure?", retConfirmaSalva);
}
function retConfirmaSalva(button) {
    if (button == 1)
        Salva();
}
function Enrola() {
    $('.divLoadingMaior').show();
    setTimeout(function () { $('.divLoadingMaior').hide(); document.body.scrollTop = document.documentElement.scrollTop = 0; }, 3000);
}
function isOFFline() {
    if (DEV) return OFFl;
    if (navigator.connection == undefined) {
        return !ConfereServidor();
    }
    if (navigator.connection)
        return (navigator.connection.type == Connection.NONE || navigator.connection.type == Connection.UNKNOWN);
    else
        return false;
}
function ConfereServidor() {
    jQuery.ajaxSetup({ async: false });
    re = "";
    r = Math.round(Math.random() * 10000);
    $.get("https://gv360store.com/api/checklist", { subins: r }, function (d) {
        re = true;
    }).error(function () {
        re = false;
    });
    return re;
}
function verificaSincronizacao() {
    banco.ContarRespostas(retContarRespostas);
}
function retContarRespostas(num) {
    if (num > 0) {
        $('.divSincron .msgSincron').text(num + ' checklist to synchronize')
        $('.divSincron').show();
    }
    else {
        $('.divSincron .msgSincron').text('no synchronize need')
        $('.divSincron').hide();
    }
}

function CarregarPerguntas(dados) {
    try {


        for (var i = 0; i < dados.length; i++) {
            var tempAbs = templateAba;
            tempAbs = multiReplace(tempAbs, '$aba1$', dados[0].Descricao);
            tempAbs = multiReplace(tempAbs, '$aba2$', dados[1].Descricao);
            tempAbs = multiReplace(tempAbs, '$aba3$', dados[2].Descricao);
            tempAbs = multiReplace(tempAbs, '$aba4$', dados[3].Descricao);
            tempAbs = multiReplace(tempAbs, '$idPage$', 'aba' + (i + 1));
            //muda a classe para ativa
            tempAbs = multiReplace(tempAbs, '$c' + i + '$', 'ui-btn-active');

            //limpa a classe das outras aba que nao sao ativas
            for (var r = 0; r < dados.length; r++)
                tempAbs = multiReplace(tempAbs, '$c' + r + '$', '');

            for (var r = 0; r < EmpresasCarregadas.length; r++) {
                if (EmpresasCarregadas[r].Id == LojaSelecionada.IdEmpresa) {
                    tempAbs = multiReplace(tempAbs, '$nomeEmpresa$', EmpresasCarregadas[r].Nome);
                    break;
                }
            }
            tempAbs = multiReplace(tempAbs, '$nomeLoja$', LojaSelecionada.Nome);
            var todasCateorias = "";
            for (var j = 0; j < dados[i].Topico.length; j++) {
                var TopicoNome = dados[i].Topico[j].Descricao;
                var temps = templateCategoria;
                temps = multiReplace(temps, '$categoria$', TopicoNome);
                var todasPerguntas = "";
                for (var k = 0; k < dados[i].Topico[j].Item.length; k++) {
                    var id = dados[i].Topico[j].Id.toString() + dados[i].Topico[j].Item[k].Id.toString()
                    var perps = templatePerguntaSimples;
                    perps = multiReplace(perps, '$ct$', id);
                    if (dados[i].Topico[j].Item[k].InfoAdicional != null) {
                        var infas = templateInfoAdicional;
                        infas = multiReplace(infas, '$info$', dados[i].Topico[j].Item[k].InfoAdicional);
                        infas = multiReplace(infas, '$ct$', id);
                        perps = multiReplace(perps, '$$infoAdicional$$', infas);
                        perps = multiReplace(perps, '$pergunta$', dados[i].Topico[j].Item[k].Descricao + '<img style="float: none; margin-left: 20px;" src="includes/img/ico-info.png" onclick="MostraComentarios(\'Info' + id + '\');" >');
                    }
                    else {
                        perps = multiReplace(perps, '$$infoAdicional$$', '');
                        perps = multiReplace(perps, '$pergunta$', dados[i].Topico[j].Item[k].Descricao);
                    }
                    perps = multiReplace(perps, '$idItem$', dados[i].Topico[j].Item[k].Id);
                    if (dados[i].Topico[j].Item[k].Yes)
                        perps = multiReplace(perps, '$Yes$', 'ui-btn-up-f');
                    else
                        perps = multiReplace(perps, '$Yes$', 'ui-btn-up-c');
                    if (dados[i].Topico[j].Item[k].Visible)
                        perps = multiReplace(perps, '$Visible$', 'ui-btn-up-f');
                    else
                        perps = multiReplace(perps, '$Visible$', 'ui-btn-up-c');
                    if (dados[i].Topico[j].Item[k].Win)
                        perps = multiReplace(perps, '$Win$', 'ui-btn-up-f');
                    else
                        perps = multiReplace(perps, '$Win$', 'ui-btn-up-c');
                    if (dados[i].Topico[j].Item[k].Ent)
                        perps = multiReplace(perps, '$Ent$', 'ui-btn-up-f');
                    else
                        perps = multiReplace(perps, '$Ent$', 'ui-btn-up-c');
                    if (dados[i].Topico[j].Item[k].Eye)
                        perps = multiReplace(perps, '$Eye$', 'ui-btn-up-f');
                    else
                        perps = multiReplace(perps, '$Eye$', 'ui-btn-up-c');
                    if (dados[i].Topico[j].Item[k].Dis)
                        perps = multiReplace(perps, '$Dis$', 'ui-btn-up-f');
                    else
                        perps = multiReplace(perps, '$Dis$', 'ui-btn-up-c');
                    if (dados[i].Topico[j].Item[k].Sal)
                        perps = multiReplace(perps, '$Sal$', 'ui-btn-up-f');
                    else
                        perps = multiReplace(perps, '$Sal$', 'ui-btn-up-c');
                    if (dados[i].Topico[j].Item[k].Cas)
                        perps = multiReplace(perps, '$Cas$', 'ui-btn-up-f');
                    else
                        perps = multiReplace(perps, '$Cas$', 'ui-btn-up-c');
                    if (dados[i].Topico[j].Item[k].Exi)
                        perps = multiReplace(perps, '$Exi$', 'ui-btn-up-f');
                    else
                        perps = multiReplace(perps, '$Exi$', 'ui-btn-up-c');

                    todasPerguntas += perps;
                }
                temps = multiReplace(temps, '$$perguntas$$', todasPerguntas);
                todasCateorias += temps;
            }
            tempAbs = multiReplace(tempAbs, '$$categorias$$', todasCateorias);
            $('body').append(tempAbs);

        }

        CarregaRespostas();

        $('#home').transition({ opacity: 0 });
        MostraAba('aba1');
        $('.divLoading').hide();

        $('.chckCadaMaior').click(function () {
            if ($(this).hasClass('ui-btn-up-c'))
                return;

            if ($(this).hasClass('ui-btn-active'))
                $(this).removeClass('ui-btn-active');
            else
                $(this).addClass('ui-btn-active');

            return false;
        });

    } catch (e) {
        debug(e.message);
    }
}

function CarregaRespostas() {
    if (checkList.Id > 0)
        CodigoCheckListAtual = checkList.Id;
    else
        CodigoCheckListAtual = 0;


    if (checkList.ChecklistResposta.length > 0) {

        for (var i = 0; i < checkList.ChecklistResposta.length; i++) {
            var id = checkList.ChecklistResposta[i].IdItem;

            if (checkList.ChecklistResposta[i].PresentInStore) {
                $('.chckCadaMaior[p="' + id + '"][tipo="Yes"]').addClass('ui-btn-active');
                if ($('.chckCadaMaior[p="' + id + '"][tipo="Yes"]').hasClass('chkYesNobehavior'))
                    $('.chckCadaMaior[p="' + id + '"][tipo="Yes"]').find('.ui-btn-text').text("Yes");
            }
            if (checkList.ChecklistResposta[i].Visible) {
                $('.chckCadaMaior[p="' + id + '"][tipo="Visible"]').addClass('ui-btn-active');
            }

            if (checkList.ChecklistResposta[i].Window) {
                $('.chckCada[p="' + id + '"][tipo="Win"]').addClass('ui-btn-active');
            }
            if (checkList.ChecklistResposta[i].Entrance) {
                $('.chckCada[p="' + id + '"][tipo="Ent"]').addClass('ui-btn-active');
            }
            if (checkList.ChecklistResposta[i].EyeTestRoom) {
                $('.chckCada[p="' + id + '"][tipo="Eye"]').addClass('ui-btn-active');
            }
            if (checkList.ChecklistResposta[i].Displays) {
                $('.chckCada[p="' + id + '"][tipo="Dis"]').addClass('ui-btn-active');
            }
            if (checkList.ChecklistResposta[i].SalesDesk) {
                $('.chckCada[p="' + id + '"][tipo="Sal"]').addClass('ui-btn-active');
            }
            if (checkList.ChecklistResposta[i].CashDesk) {
                $('.chckCada[p="' + id + '"][tipo="Cas"]').addClass('ui-btn-active');
            }
            if (checkList.ChecklistResposta[i].Exit) {
                $('.chckCada[p="' + id + '"][tipo="Exi"]').addClass('ui-btn-active');
            }

            if (checkList.ChecklistResposta[i].Comentario != null && checkList.ChecklistResposta[i].Comentario.length > 0) {
                $('[p="' + id + 'Com"]').text(checkList.ChecklistResposta[i].Comentario);
                MostraComentarios('Coment' + id, $('#imgCom' + id));
            }
        }

    }
}