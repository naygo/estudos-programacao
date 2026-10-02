## Requisitos da aplicação Calendar

- Deve ser possível cadastrar usuários, sendo que deve ser validado se o formato do email e do telefone estão corretor.
  
- Deve ser validado se o email já foi cadastrado.

- Deve ser possível alterar os dados dos usuários

- Deve ser possível buscar os usuários, filtrando por nome ou email

- Deve ser possível, deletar também suas tarefas

- Deve ser possível cadastrar uma tarefa para um usuário

- Deve ser possível buscar as tarefas de um usuário

- Deve ser possível deletar as tarefas de um usuário


## Anotações Aula 4


```ts
interface CarteiraDeIdentidade {
    idade: number;
    nome: string;
    numero: string;
}

class Pessoa implements CarteiraDeIdentidade{
    
    idade: number
    nome: string
    numero: string
    
    constructor(id: CarteiraDeIdentidade) {
        this.idade = id.idade
        this.nome = id.nome
        this.numero = id.numero
    }

    andar(distanciaEmMetros?: number): string {
        if(!distanciaEmMetros)
            return 'Sair por aí, sem hora pra voltar'
        else if (distanciaEmMetros < 500)
            return 'Tá perto, bora lá'

        return 'Vamos lá andar'
    }

    falar(): void {
        console.log('Blá blá blá')
    }
}

type Nota = 1 | 2 | 3 | 4 | 5

class ParticipanteDoBBB extends Pessoa {

    notaTotal: number = 0

    constructor(id: CarteiraDeIdentidade) {
        super(id)
    }

    votar(nota: Nota): void {
        this.notaTotal++
    }
}

const pessoa = new Pessoa({ idade: 19, nome: 'Nayla', numero: 'MG34234' })
console.log(pessoa)

const participante = new ParticipanteDoBBB({ idade: 19, nome: 'Nayla', numero: 'MG34234' })
participante.votar(1)
console.log(participante)
```    

## Anotações Aula 5


```ts
const users = [{ id: 1, name: 'Nayla' }, { id: 2, name: 'Matheus' }]

const buscarUsers = (id: number) => {
    return new Promise((resolve, reject) => {

        setTimeout(() => {
            const user = users.find((u) => u.id === id)
            
            if(user)
                resolve(user)
            reject('Usuário não encontrado')

        }, 2000)
    })
}

const main = async () => {
    try {
        const user = await buscarUsers(1)
        console.log(user)
    } catch(err) {
        console.log(err)
    }
}

buscarUsers(1)
    .then((user) => console.log(user))
    .catch((err) => console.log(err))


main()
```