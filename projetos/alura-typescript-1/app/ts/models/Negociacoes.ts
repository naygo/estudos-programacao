class Negociacoes {

    // private _negociacoes: Array<Negociacao> = [];
    private _negociacoes: Negociacao[] = [];

    adiciona(negocicacao: Negociacao) {
        this._negociacoes.push(negocicacao);
    }

    paraArray(): Negociacao[] {
        return [].concat(this._negociacoes);
    }
}