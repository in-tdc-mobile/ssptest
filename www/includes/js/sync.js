var Sync = function () {
    this.Total = 0;
    this.Vez = 0;
    this.ListaRespostas = new Array();

    this.initialize = function () {
        this.Vez = 0;
        this.Total = 0;
    };
    this.reset = function () {
        this.Vez = 0;
        this.Total = 0;
        this.ListaRespostas = new Array();
    }

    this.sincronizar = function () {
        $('.divLoadingMaior').show();
        $('.divLoadingMaior p').text("Retrieving data...");
        setTimeout(function () {
            banco.ContarRespostas(sync.SincronizarStep1);
        }, 300);
    }

    this.SincronizarStep1 = function (num) {
        this.Total = num;
        if (this.Total <= 0) {
            alerta("No data to synchronize.");
            $('.divLoadingMaior').hide();
            $('.divLoadingMaior p').text("");
        }
        else {
            $('.divLoadingMaior p').text("Total checklist = " + this.Total.toString());
            setTimeout(function () {
                banco.ObterRespostasLista();
            }, 300);

        }
    };

    this.SincronizarStep2 = function (arr) {
        this.ListaRespostas = arr;
        this.SincronizarStep3();
    };

    this.SincronizarStep3 = function () {
        if (this.Vez < this.ListaRespostas.length) {
            $('.divLoadingMaior p').text("Loading Data...  ( " + (this.Vez + 1) + " / " + this.ListaRespostas.length + " )");
            setTimeout(function () {
                banco.ObterRespostaUnica(sync.ListaRespostas[sync.Vez]);
            }, 300);

        }
        else {
            $('.divLoadingMaior p').text("Synchronization complete.");

            setTimeout(function () {
                $('.divLoadingMaior p').text("");
                $('.divLoadingMaior').hide();
                sync.reset();
                verificaSincronizacao();
            }, 1000);
        }
    };

    this.SincronizarStep4 = function (respostaInString) {
        var onj = JSON.parse(respostaInString);
        $('.divLoadingMaior p').text("Saving Data... Store: " + onj.Loja.Nome + " ( " + (sync.Vez + 1) + " / " + sync.ListaRespostas.length + " )");
        setTimeout(function () {
            $.ajax({
                url: serviceApplic + "checklist/SalvarOffline",
                type: 'POST',
                dataType: 'json',
                data: "=" + respostaInString,
                success: function (data) {
                    if (data == true)
                        banco.ApagarResposta(sync.ListaRespostas[sync.Vez]);

                    sync.Vez++;
                    sync.SincronizarStep3();
                },
                error: function (a, e, d) {
                    sync.Vez++;
                    sync.SincronizarStep3();
                }
            });
        }, 500);
    };

    this.initialize();
}
