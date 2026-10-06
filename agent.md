## Projeto

-Aplicação web desenvolvida com Angular 21, TypeScript, Angular Signals e NgRx Signal Store.

## Stack

-Angular 21
-TypeScript
-Angular Signals
-NgRx Signal Store
-Tailwind
-npm

## Princípios gerais

-Siga os padrões modernos do Angular 21.
-Prefira APIs baseadas em Signals quando apropriado.
-Prefira componentes standalone.
-Evite introduzir padrões legados quando existir uma alternativa moderna no Angular.
-Antes de criar uma nova abstração, procure por uma implementação existente que possa ser reutilizada.
-Mantenha as alterações pequenas e focadas na tarefa.
-Não adicione dependências sem necessidade.
-Não altere contratos públicos ou comportamentos existentes sem verificar seus consumidores.

## Angular Components

-Use standalone components.
-Prefira signal, computed e effect para estado e reações locais quando fizer sentido.
-Prefira input() e output() em vez das APIs decoradoras legadas quando compatível com o código existente.
-Evite lógica de negócio complexa dentro do template.
-Mantenha os componentes focados em apresentação e interação.
A- lógica de estado compartilhado deve ficar em stores ou serviços apropriados.

## Templates

-Prefira a sintaxe moderna de controle de fluxo do Angular, como @if, @for e @switch.
-Evite *ngIf e *ngFor em código novo.
-Evite chamadas de métodos com processamento pesado diretamente no template.
-Prefira Signals e computed() para valores derivados.

## Estado local

-Use Signals para estado local:
readonly count = signal(0);
readonly doubleCount = computed(() => this.count() \* 2);
-Evite usar BehaviorSubject ou Subject apenas para representar estado local quando um Signal for suficiente.

## NgRx Signal Store

-O estado compartilhado da aplicação deve utilizar NgRx Signal Store quando a complexidade justificar uma store.

## Estrutura

-Mantenha cada store focada em um domínio ou responsabilidade.
-Separe estado, métodos, computeds e efeitos de forma clara.
-Prefira withState, withComputed, withMethods e withHooks conforme a necessidade.
-Utilize rxMethod para integrar operações RxJS com Signal Store quando apropriado.
-Evite criar stores globais para estado que pertence exclusivamente a um componente.

Exemplo:
export const UsersStore = signalStore(
withState({
users: [] as User[],
loading: false,
}),

withComputed(({ users }) => ({
userCount: computed(() => users().length),
})),

withMethods((store, usersService = inject(UsersService)) => ({
loadUsers: rxMethod<void>(
pipe(
tap(() => patchState(store, { loading: true })),
switchMap(() =>
usersService.getUsers().pipe(
tapResponse({
next: users => patchState(store, { users }),
error: error => {
console.error(error);
},
finalize: () => patchState(store, { loading: false }),
}),
),
),
),
),
})),
);

## Regras para stores

-Não coloque lógica de apresentação dentro da store.
-Não use a store como substituto de qualquer serviço.
-Mantenha chamadas HTTP nos services quando isso melhorar a separação de responsabilidades.
-A store deve coordenar estado e efeitos relacionados ao domínio.
-Prefira estado derivado com computed em vez de armazenar valores que podem ser calculados.
-Evite duplicar estado.
-Trate estados de loading, error e success de forma consistente com o padrão já utilizado no projeto.
-Não introduza NgRx Store tradicional (Store, reducers, actions, selectors) em código novo sem uma justificativa clara.

## RxJS

-Use RxJS principalmente para operações assíncronas, streams e integração com APIs que já utilizam Observables.
-Não transforme Signals em Observables sem necessidade.
-Use toSignal() e toObservable() quando houver uma necessidade clara de interoperabilidade.
-Prefira rxMethod dentro do Signal Store para métodos que precisam trabalhar com pipelines RxJS.
-Garanta o gerenciamento correto do ciclo de vida das subscriptions.

## Services

-Services devem encapsular comunicação com APIs, regras de infraestrutura e integrações externas.
-Evite colocar estado global nos services quando esse estado pertence a uma Signal Store.
-Reutilize services existentes antes de criar novos.
-Não faça chamadas HTTP diretamente no componente quando elas puderem ser encapsuladas adequadamente em um service.

## TypeScript

-Evite any.
-Prefira tipos explícitos e interfaces existentes.
-Use unknown quando o tipo realmente não puder ser conhecido.
-Evite casts (as) desnecessários.
-Prefira readonly quando uma propriedade não deve ser alterada.
-Não duplique tipos que já existem no projeto.

## Testes

-Ao alterar comportamento, adicione ou atualize testes quando houver infraestrutura de testes disponível.
-Antes de finalizar uma tarefa, execute, quando aplicável:

npm test
npm run lint
npm run build

-Se o projeto usar comandos diferentes, consulte package.json antes de executar os comandos acima.

## Estilo e arquitetura

-Siga a estrutura e as convenções já existentes no projeto.
-Não reorganize arquivos ou pastas sem necessidade.
-Não faça refatorações não relacionadas à tarefa.
-Prefira soluções simples e idiomáticas do Angular.
-Evite abstrações prematuras.
-Código novo deve seguir os padrões modernos já adotados pelo projeto.

## Antes de implementar

-Analise a estrutura do projeto.
-Leia os arquivos relacionados à tarefa.
-Procure componentes, services e stores semelhantes.
-Identifique os padrões já utilizados.
-Implemente seguindo esses padrões.
-Execute os testes, lint e build relevantes.
-Informe quais arquivos foram alterados e quaisquer problemas encontrados.

## Git

-Não faça commits automaticamente.
-Não altere arquivos não relacionados à tarefa.
-Não remova código existente sem verificar seu propósito.
-Preserve alterações locais existentes feitas pelo desenvolvedor.
-Não faça alterações destrutivas sem confirmação explícita.

## Regra principal

-Antes de criar uma nova solução, procure primeiro como o projeto já resolve problemas semelhantes.
-Consistência com a arquitetura existente é mais importante do que introduzir uma nova abordagem apenas porque ela é tecnicamente possível.
