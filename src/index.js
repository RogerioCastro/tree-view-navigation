import EventManager from './core/events'
import Node from './core/node'
import isHTMLElement from './utils/isHTMLElement'
import clearElement from './utils/clearElement'
import './styles/style.scss'

export default class TreeViewNavigation extends EventManager {
  /**
   * @param {object} options - Configurações gerais.
   * @param {HTMLElement} options.container - Container HTML para plotagem do gráfico.
   * @param {object} options.data - Dados para plotagem do gráfico.
   * @param {function} [options.onRender] - Callback a ser executada ao fim da impressão do menu. Default: null
   * @param {function} [options.labelFormatter] - Callback de formatação dos labels. Default: null
   * @param {number} [options.depth] - Nível no qual a árvore iniciará colapsada. Default: null
   * @param {string[]|number[]} [options.selected] - Array de IDs de nós que irão iniciar selecionados. Default: []
   * @param {boolean} [options.allChecked] - Iniciar árvore com todos os nós selecionados. Default: false
   * @param {boolean} [options.selectable] - Exibir ou não as checkboxes de seleção dos nós. Default: true
   * @param {string} [options.switchIcon] - Tipo de ícone para expandir/colapsar ('arrow' | 'plus'). Default: 'arrow'
   * @param {boolean} [options.darkMode] - Ativa o modo dark para fundos escuros. Default: false
   */
  constructor(options) {
    super()
    // Verificações iniciais de requisitos
    if (!options) {
      throw new Error('A biblioteca precisa ser iniciada com parâmetros')
    }
    if (!options.container) {
      throw new Error('Container HTML não informado')
    }
    if (!options.data) {
      throw new Error('Dados não informados')
    }

    // Configurações iniciais
    this.settings = {
      container: null,
      data: null,
      onRender: () => {},
      labelFormatter: null,
      depth: null,
      selected: [],
      allChecked: false,
      selectable: true,
      switchIcon: 'arrow',
      darkMode: false,
      ...options
    }
    this.on('render', this.settings.onRender)

    // Verificando o container
    if (this.settings.container && typeof this.settings.container === 'object' && this.settings.container !== null && !isHTMLElement(this.settings.container)) {
      throw new Error('O objeto fornecido como container não é um elemento HTML válido.')
    } else if (this.settings.container && typeof this.settings.container === 'string') {
      this.settings.container = document.querySelector(this.settings.container)
      if (!this.settings.container) {
        throw new Error('Não há nenhum elemento para container válido com o seletor fornecido.')
      }
    }

    this.stage = this.settings.container
    this.stage.innerHTML = ''
    this.stage.className = `tree-v-nav${this.settings.darkMode ? ' tree-v-dark' : ''}`
    this.nodes = new Map()
    this.selected = []
    this.visible = []
    this.indeterminate = []

    this.loadTree()
  }

  /**
   * Monta a árvore completa
   */
  loadTree() {
    this.settings.data.forEach((node) => {
      const n = new Node({
        id: node.id,
        label: this.settings.labelFormatter ? this.settings.labelFormatter(node) : node.label,
        name: node.label,
        checked: this.settings.allChecked,
        selectable: this.settings.selectable,
        switchIcon: this.settings.switchIcon,
        metadata: node.metadata ?? null,
        level: 1,
        open: this.settings.depth === null || this.settings.depth > 1
      })
      this.bindEvents(n)
      this.nodes.set(node.id, { node: n, parents: [] })
      this.stage.appendChild(n.getElement())
      this.visible.push(n.id)
      if (this.settings.allChecked) {
        this.selected.push(n.id)
      }
      if (node.children && node.children.length) {
        this.loadChildren(n, node.children, [])
      }
    })
    // Checando se há nós a serem selecionados
    if (this.settings.selected.length && !this.settings.allChecked) {
      this.nodes.forEach((value, key) => {
        if (this.settings.selected.includes(key)) {
          value.node.toggleCheckbox(1)
        }
      })
    }
    this.emit('render', this.nodes)
  }

  /**
   * Função recursiva para montagem dos filhos
   * @param {Node} parent Nó pai
   * @param {object[]} children Array com os filhos
   * @param {string[]|number[]} parents IDs dos pais (todos os ancestrais)
   */
  loadChildren(parent, children, parents) {
    children.forEach((node) => {
      const n = new Node({
        id: node.id,
        label: this.settings.labelFormatter ? this.settings.labelFormatter(node) : node.label,
        name: node.label,
        checked: this.settings.allChecked,
        selectable: this.settings.selectable,
        switchIcon: this.settings.switchIcon,
        metadata: node.metadata ?? null,
        open: this.settings.depth === null || this.settings.depth > (parent.level + 1)
      })
      this.bindEvents(n)
      const _parents = [...parents, parent.id]
      this.nodes.set(node.id, { node: n, parents: _parents })
      parent.appendChild(n)
      if (parent.open) {
        this.visible.push(n.id)
      }
      if (this.settings.allChecked) {
        this.selected.push(n.id)
      }
      if (node.children && node.children.length) {
        this.loadChildren(n, node.children, _parents)
      }
    })
  }

  /**
   * Retorna os nós atualmente selecionados
   * @returns {string[]}
   */
  getSelected() {
    return [...this.selected]
  }

  /**
   * Retorna os nós com status indeterminado (que possue algum filho selecionado, mas não todos)
   * @returns {string[]}
   */
  getIndeterminate() {
    return [...this.indeterminate]
  }

  /**
   * Retorna os nós que estão sendo exibidos no momento (não colapsados)
   * @returns {string[]}
   */
  getVisible() {
    return [...this.visible]
  }

  /**
   * Retorna a instância de um nó pelo seu ID
   * @returns {string|number}
   */
  getNode(id) {
    return this.nodes.get(id)
  }

  /**
   * Manipula o evento change de um nó e dispara o mesmo evento na biblioteca.
   * @param {object} params Objeto no formato: { event: Event, node: Node}
   * @event change
   */
  onChange(params) {
    this.selected = []
    this.indeterminate = []
    this.nodes.forEach((value, key) => {
      value.node.checked && this.selected.push(key)
      value.node.indeterminate && this.indeterminate.push(key)
    })
    this.emit('change', params.node, params.event)
  }

  /**
   * Manipula o evento switch de um nó e dispara o mesmo evento na biblioteca.
   * @param {Node} node Nó pai expandido ou colapsado
   * @event switch
   */
  onSwitch(node) {
    this.visible = []
    this.nodes.forEach((value, key) => {
      value.node.visible && this.visible.push(key)
    })
    this.emit('switch', node)
  }

  /**
   * Manipula o evento click no label e dispara o evento 'click'
   * @param {Node} node Nó clicado
   * @event click
   */
  onClick(node) {
    this.emit('click', node)
  }

  /**
   * Manipula o evento labelenter no label e dispara o evento 'labelenter'
   * @param {Node} node Nó
   * @event labelenter
   */
  onLaberEnter(node) {
    this.emit('labelenter', node)
  }

  /**
   * Manipula o evento labelleave no label e dispara o evento 'labelleave'
   * @param {Node} node Nó
   * @event labelleave
   */
  onLabelLeave(node) {
    this.emit('labelleave', node)
  }

  /**
   * Aplica os listeners necessários à um nó
   * @param {Node} node Nó que receberá os listeners
   */
  bindEvents(node){
    node.on('switch', this.onSwitch.bind(this))
    node.on('change', this.onChange.bind(this))
    node.on('click', this.onClick.bind(this))
    node.on('mouseenter', this.onLaberEnter.bind(this))
    node.on('mouseleave', this.onLabelLeave.bind(this))
  }

  /**
   * Limpa a biblioteca e seus elementos
   */
  dispose() {
    clearElement(this.stage)
    this.stage.className = ''
  }
}
