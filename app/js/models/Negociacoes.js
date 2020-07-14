class Negociacoes {
    constructor() {
        // private _negociacoes: Array<Negociacao> = [];
        this._negociacoes = [];
    }
    adiciona(negocicacao) {
        this._negociacoes.push(negocicacao);
    }
    paraArray() {
        return [].concat(this._negociacoes);
    }
}
