# Tree View Navigation

Navegação vertical para dados hierárquicos no formato de árvore, oferecendo a possibilidade de responder a 5 eventos diferentes: clique, seleção, expandir/retrair, *mouseover* e *mouseout*.

![Tree View Navigation](/src/assets/tree-view-navigation.png "Tree View Navigation")

## Características

- Suporte a 5 tipos de eventos
- 2 opções de ícones para expandir/retrair
- Zero dependências
- Modo dark

## Utilização

Baixe o arquivo de produção da biblioteca que está localizado no diretório [`/build`](/build) e acrescente-o à `HEAD` da página.

Inclua uma `DIV` no local desejado da página, especificando o `id` desejado e suas largura (*width*) e altura (*height*).

Ao final do corpo da página insira o script de configuração e inicialização da classe da biblioteca, `TreeViewNavigation`.

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <title>Tree View Navigation</title>
    <script src="tree-view-navigation.min.js"></script>
    <style>
        #tree {
            width: 600px;
            margin: auto;
        }
        .chip {
            background-color: #aaa7bf;
            padding: 1px 6px;
            border-radius: 8px;
            color: #fff;
            font-size: 0.7rem;
            margin-left: 10px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    <script>
        fetch('data.json')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                const el = document.querySelector('#root')
                const tree = new TreeViewNavigation({
                    container: el,
                    data
                })        
            })
    </script>
</body>
</html>
```

> Para um exemplo de utilização da biblioteca, veja o arquivo [`/src/demo/index.js`](/src/demo/index.js), utilizado em ambiente de desenvolvimento.

## API

```javascript
const tree = new TreeViewNavigation(options)
```

`options` é um objeto que contém propriedades de configuração do gráfico.

### Propriedades de `options`

| Propriedade | Tipo | Descrição |
| ----------- | ---- | --------- |
| `container` | `HTMLElement` | **[obrigatório]** Elemento HTML onde a navegação será gerada. |
| `data` | `Object` | **[obrigatório]** Dados para geração da navegação. |
| `onRender` | `Function` | Função a ser executada ao fim da impressão do menu. Formato: `(params: Map<{ node: Node, parents: Node[] }>) => {}`. Valor padrão: `null`. |
| `labelFormatter` | `Function` | Função utilizada para formatar os *labels* dos elementos/nós, no formato: `labelFormatter(node: object): string`. Valor padrão: `null`. |
| `depth` | `Number` | Indica à partir de qual nível a árvore iniciará colapsada. Valor padrão: `null`. |
| `selected` | `any[]` | Array de IDs dos nós que irão iniciar selecionados. Valor padrão: `[]`. |
| `allChecked` | `Boolean` | Iniciar árvore com todos os nós selecionados. Valor padrão: `false`. |
| `selectable` | `Boolean` | Exibir ou não as checkboxes de seleção dos nós, habilitando ou não a funcionalidade de seleção de nós. Valor padrão: `true`. |
| `switchIcon` | `String` | Tipo de ícone utilizado para expandir/colapsar nós (`'arrow'` ou `'plus'`). Valor padrão: `'arrow'`. |
| `darkMode` | `Boolean` | Ativa o modo *dark* para contraste com fundos escuros. Valor padrão: `false`. |

#### Dados (`options.data`)

`options.data` é um array onde cada elemento representa um nó na árvore (ou "galho") e pode ou não conter nós filhos (`children`).

```javascript
const data = [
    {
        id: 8,
        label: "Animal",
        children: [
            {
                id: 9,
                label: "Mamíferos",
                children: [],
                metadata: {
                    quantidade: 2
                }
            }
        ],
        metadata: {
            tipo: "doméstico",
            idade: 7
        }
    },
    // ...
]
```

> A propriedade `metadata` pode conter quaisquer tipos de dados e pode ser utilizada nos eventos para exibir informações adicionais ou melhorar a experiência do usuário.

### Eventos

```javascript
const tree = new TreeViewNavigation(options)

// Atribuindo uma 'callback function' ao evento clique
tree.on('click', (node) => {
  console.log('Nó clicado:', node)
});
```

Os *event listeners* são atribuídos na instância, utilizando a função `on(eventName: string, callbackFunction: function)`. Exceto o evento `onRender`, que deve ser atribuído na construção da instância.

| Evento | Descrição |
| ------ | --------- |
| `click` | Quando um nó da árvore é clicado (sobre o label). Ex.: `tree.on('click', (node: Node) => {})` |
| `change` | Quando um nó da árvore é selecionado (checkbox). Ex.: `tree.on('change', (node: Node, event: Event) => {})` |
| `switch` | Quando um grupo de nós e expandido ou colapsado. Ex.: `tree.on('switch', (node: Node) => {})` |
| `labelenter` | Quando o mouse está sobre o label um nó. Ex.: `tree.on('labelenter', (node: Node) => {})` |
| `labelleave` | Quando o mouse deixa de estar sobre o label um nó. Ex.: `tree.on('labelleave', (node: Node) => {})` |
| `switchall` | Quando são executados os métodos para expandir ou colapsar todos os nós. Retorna os IDs dos nós visíveis. Ex.: `tree.on('switchall', (visible: string[]\|number[]) => {})` |

### Principais propriedades do objeto `Node` (componente):

| Propriedade | Tipo | Descrição |
| ----------- | ---- | --------- |
| `id` | `string\|number` | ID único do nó. |
| `name` | `string` | Nome original do nó, pois o label (`attibutes.label`) pode ser alterado para exibição. |
| `attributes` | `object` | Atributos internos de criação e estilo do nó. |
| `checked` | `boolean` | Indica se o nó está selecionado (checkbox marcada). |
| `indeterminate` | `boolean` | Indica se o nó está em estado indeterminado, quando nem todos os filhos estão selecionados (checkbox indeterminado). |
| `open` | `boolean` | Indica se o nó pai está expandido ou não. |
| `visible` | `boolean` | Indica se o nó está visível ou oculto, quando seu pai está colapsado. |
| `level` | `number` | Nível do nó na árvore. |
| `children` | `Node[]` | Nós filhos. |
| `elements` | `object` | Elementos HTML que compõem o componente. |
| `metadata` | `object` | Dados gerais do nó. |
| `parent` | `Node` | Nó pai. |

### Principais propriedades da instância:

| Propriedade | Tipo | Descrição |
| ----------- | ---- | --------- |
| `nodes` | `Map<{ node: Node, parents: string[]\|number[] }` | Mapa com todos os nós da árvore e os IDs dos seus antecessores (pais). As chaves são os IDs dos nós. |
| `indeterminate` | `string[]\|number[]` | Array de IDs dos nós em estado indeterminado. |
| `selected` | `string[]\|number[]` | Array de IDs dos nós selecionados. |
| `visible` | `string[]\|number[]` | Array de IDs dos nós que estão visíveis (grupos expandidos). |

### Principais métodos da instância:

| Método | Retorno | Descrição |
| ------ | ------- | --------- |
| `getSelected` | `string[]\|number[]` | Retorna os IDs dos nós atualmente selecionados. |
| `getIndeterminate` | `string[]\|number[]` | Retorna os IDs dos nós com status indeterminado (que possue algum filho selecionado, mas não todos). |
| `getVisible` | `string[]\|number[]` | Retorna os IDs dos nós que estão sendo exibidos no momento (não colapsados). |
| `getNode` | `string[]|number[]` | Retorna a instância de um nó e seus pais pelo seu ID. Formato: `{ node: Node, parents: string[]\|number[] }`. |
| `expandAll` | `void` | Expande todos os nós. |
| `collapseAll` | `void` | Colapsa todos os nós. |

## Desenvolvimento

```bash
# Instalando dependências
npm install

# Servidor de desenvolvimento
npm start

# Build de produção
npm run build
```

## Créditos

- Inspiração: [@widgetjs/tree](https://github.com/daweilv/treejs)
- Boilerplate utilizada: [Javascript Library Boilerplate Basic](https://github.com/DevUnltd/js-library-boilerplate-basic)
