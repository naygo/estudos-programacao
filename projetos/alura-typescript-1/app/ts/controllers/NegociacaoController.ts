class NegociacaoController {
    private _inputDate: JQuery;
    private _inputQuantidade: JQuery;
    private _inputValor: JQuery;
    // private _negociacoes: Negociacoes = new Negociacoes;
    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemView = new MensagemView('#mensagemView')

    constructor() {
        this._inputDate = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');
        this._negociacoesView.update(this._negociacoes);
    }

    adiciona(event: Event) {
        
        event.preventDefault();

        const negociacao = new Negociacao(
            new Date(this._inputDate.val().replace(/-/g, ',')),
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val())
        );
        
        this._negociacoes.adiciona(negociacao)

        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso!');

        // this.   _negociacoes.paraArray().forEach(negociacao => {
        //     console.log(negociacao.data);
        //     console.log(negociacao.quantidade);
        //     console.log(negociacao.valor)
        // })
        console.log(negociacao)
    }
}