class NegociacaoController {
    private _inputDate: HTMLInputElement;
    private _inputQuantidade: HTMLInputElement;
    private _inputValor: HTMLInputElement;
    // private _negociacoes: Negociacoes = new Negociacoes;
    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemView = new MensagemView('#mensagemView')

    constructor() {
        this._inputDate = <HTMLInputElement>document.querySelector('#data');
        this._inputQuantidade = <HTMLInputElement>document.querySelector('#quantidade');
        this._inputValor = <HTMLInputElement>document.querySelector('#valor');
        this._negociacoesView.update(this._negociacoes);
    }

    adiciona(event: Event) {
        
        event.preventDefault();

        const negociacao = new Negociacao(
            new Date(this._inputDate.value.replace(/-/g, ',')),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
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