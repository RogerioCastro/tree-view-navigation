import EventManager from './events'
import createElement from '../utils/createElement'
import generateId from '../utils/generateId'
import addClass from '../utils/addClass'
import removeClass from '../utils/removeClass'

/**
 * Estrutura HTML de um nó:
 * <div class="tree-v-node" data-node-id="G06F3/0481">
 *    <div class="tree-v-header">
 *      <span class="tree-v-switch"></span>
 *      <div class="tree-v-checkbox">
 *        <input id="6408a1aa9eb258e3ab836588" type="checkbox">
 *        <label for="6408a1aa9eb258e3ab836588"></label>
 *      </div>
 *      <span class="tree-v-label">G06F3/0481</span>
 *    </div>
 *    <div class="tree-v-children">
 *      <!-- nós filhos -->
 *    </div>
 * </div>
 */

export default class Node extends EventManager {
  constructor(attributes) {
    super()
    this.attributes = {
      indeterminate: false,
      checked: false,
      open: true,
      selectable: true,
      level: 1,
      classNode: 'tree-v-node',
      classHeader: 'tree-v-header',
      classSwitch: 'tree-v-switch',
      classCheckbox: 'tree-v-checkbox',
      classLabel: 'tree-v-label',
      classChildren: 'tree-v-children',
      classNoChildren: 'tree-v-single',
      classCollapsed: 'tree-v-closed',
      switchIcon: 'arrow',
      animationDuration: 150,
      ...attributes
    }
    this.elements = {
      main: null,
      header: null,
      switch: null,
      checkbox: null,
      checkboxInput: null,
      checkboxLabel: null,
      label: null,
      children: null
    }
    this.id = this.attributes.id ?? generateId()
    this.children = []
    this.parent = null
    this.visible = true
    this.metadata = this.attributes.metadata
    this.open = this.attributes.open
    this.indeterminate = this.attributes.indeterminate
    this.checked = this.attributes.checked
    this.level = this.attributes.level

    this.render()
  }

  /**
   * Monta e renderiza o nó e seus elementos
   */
  render() {
    // Elemento principal (container)
    this.elements.main = createElement('div', {
      className: `${this.attributes.classNode} ${this.attributes.classNoChildren}`,
      'data-node-id': this.id
    })
    if (!this.open) {
      addClass(this.elements.main, this.attributes.classCollapsed)
    }
    // Cabeçalho do nó
    this.elements.header = createElement('div', {
      className: this.attributes.classHeader
    })
    // Switch
    this.elements.switch = createElement('span', {
      className: `${this.attributes.classSwitch} tree-v-${this.attributes.switchIcon}`
    })
    if (!this.open) {
      addClass(this.elements.switch, this.attributes.classCollapsed)
    }
    // Checkbox container (customizado)
    this.elements.checkbox = createElement('div', {
      className: this.attributes.classCheckbox
    })
    const inputId = generateId()
    this.elements.checkboxInput = createElement('input', {
      id: inputId,
      type: 'checkbox',
      indeterminate: this.attributes.indeterminate,
      checked: this.attributes.checked
    })
    this.elements.checkboxLabel = createElement('label', {
      for: inputId
    })
    this.elements.checkbox.appendChild(this.elements.checkboxInput)
    this.elements.checkbox.appendChild(this.elements.checkboxLabel)
    // Label do nó
    this.elements.label = createElement('span', {
      className: this.attributes.classLabel,
      innerHTML: this.attributes.label
    })
    // Nós filhos
    this.elements.children = createElement('div', {
      className: this.attributes.classChildren
    })
    // Inserindo os elementos em seus containers
    this.elements.header.appendChild(this.elements.switch)
    if (this.attributes.selectable) {
      this.elements.header.appendChild(this.elements.checkbox)
    }
    this.elements.header.appendChild(this.elements.label)
    this.elements.main.appendChild(this.elements.header)
    this.elements.main.appendChild(this.elements.children)

    // Eventos
    this.elements.switch.addEventListener('click', this.onSwitch.bind(this), false)
    this.elements.label.addEventListener('click', this.onLabelClick.bind(this), false)
    this.elements.label.addEventListener('mouseover', this.onLabelOver.bind(this), false)
    this.elements.label.addEventListener('mouseout', this.onLabelOut.bind(this), false)
    if (this.attributes.selectable) {
      this.elements.checkboxInput.addEventListener('input', this.onCheckboxInput.bind(this), false)
    }
  }

  /**
   * Retorna um elemento HTML da classe
   * @param {string} [key] Nome do elemento HTML a ser retornado ou 'main', caso NULL. Default: null
   * @returns {HTMLElement}
   */
  getElement(key = null) {
    return this.elements[key] ?? this.elements.main
  }

  /**
   * Atribui um label ao nó
   * @param {string} label Texto ou HTML a ser exibido como label do nó.
   */
  setLabel(label) {
    this.elements.label.innerHTML = label
  }

  /**
   * Adiciona um nó como filho (no elemento children).
   * @param {Node} child Objeto do nó filho.
   */
  appendChild(child) {
    child.parent = this
    child.level = this.level + 1
    this.children.push(child)
    this.elements.children.appendChild(child.getElement())
    removeClass(this.elements.main, this.attributes.classNoChildren)
  }

  /**
   * Retorna um metadado do nó ou todos se nenhuma key for informada.
   * @param {string} [key] Nome/chave do metadado do nó ou todos, caso NULL. Default: null.
   * @returns {object|any}
   */
  getData(key = null) {
    return this.metadata[key] ?? this.metadata
  }

  /**
   *
   * @param {number} duration Informa qual será a duração da animação (no css).
   * @param {function} callback Função de animação.
   */
  animation(duration, callback) {
    requestAnimationFrame(() => {
      callback.enter()
      requestAnimationFrame(() => {
        callback.active()
        setTimeout(() => {
          callback.leave()
        }, duration)
      })
    })
  }

  /**
   * Oculta os filhos do nó e dispara o evento 'collapse'
   * @event collapse
   * @returns
   */
  collapse() {
    if (!this.open) {
      return
    }
    this.open = false
    this.updateVisibilityStatus(this.children, false)
    const element = this.getElement('children')
    const height = element.scrollHeight
    const callback = {
      enter: () => {
        element.style.height = `${height}px`
        element.style.opacity = 1
      },
      active: () => {
        element.style.height = 0
        element.style.opacity = 0
      },
      leave: () => {
        element.style.height = ''
        element.style.opacity = ''
        addClass(this.getElement(), this.attributes.classCollapsed)
      }
    }
    addClass(this.getElement('switch'), this.attributes.classCollapsed)
    this.animation(this.attributes.animationDuration, callback)
    this.emit('collapse', this)
    this.emit('switch', this)
  }

  /**
   * Exibe os filhos do nó e dispara o evento 'expand'
   * @event expand
   * @returns
   */
  expand() {
    if (this.open) {
      return
    }
    this.open = true
    this.updateVisibilityStatus(this.children)
    const element = this.getElement('children')
    const height = element.scrollHeight
    const callback = {
      enter: () => {
        element.style.height = 0
        element.style.opacity = 0
      },
      active: () => {
        element.style.height = `${height}px`
        element.style.opacity = 1
      },
      leave: () => {
        element.style.height = ''
        element.style.opacity = ''
        removeClass(this.getElement(), this.attributes.classCollapsed)
      }
    }
    removeClass(this.getElement('switch'), this.attributes.classCollapsed)
    this.animation(this.attributes.animationDuration, callback)
    this.emit('expand', this)
    this.emit('switch', this)
  }

  /**
   * Manipula o evento clique no switch de exibição/ocultação dos filhos
   * e dispara o evento 'switch'
   * @event switch
   */
  onSwitch() {
    if (this.open) {
      this.collapse()
    } else {
      this.expand()
    }
    // this.emit('switch', { open: this.open, node: this})
  }

  /**
   * Manipula o evento click no label
   * e dispara o evento 'click'
   * @event click
   */
  onLabelClick() {
    this.emit('click', this)
  }

  /**
   * Manipula o evento mouseover no label
   * e dispara o evento 'mouseover'
   * @event mouseover
   */
  onLabelOver() {
    this.emit('mouseover', this)
  }

  /**
   * Manipula o evento mouseout no label
   * e dispara o evento 'mouseout'
   * @event mouseout
   */
  onLabelOut() {
    this.emit('mouseout', this)
  }

  /**
   * Manipula o evento input (change) no checkbox
   * e dispara o evento 'change'
   * @event change
   */
  onCheckboxInput(event) {
    this.indeterminate = event.target.indeterminate
    this.checked = event.target.checked
    this.updateFamilyStatus()
    this.emit('change', { event, node: this})
  }

  /**
   * Simula o click no checkbox ou muda seu estado para indeterminado, se force é nulo
   * o comportamento é um simples toggle.
   * @param {number} [force] Força o estado do checkbox: 0 - unchecked, 1 - checked, -1 - indeterminate. Default: null
   * @param {boolean} [dispatchEvent] Indica se o evento 'input' será disparado ou não. Default: true
   * @event input
   */
  toggleCheckbox(force = null, dispatchEvent = true) {
    if ((force === 1 && this.checked) || (force === 0 && !this.checked && !this.indeterminate)) {
      return
    }
    const event = new Event('input')
    this.elements.checkboxInput.indeterminate = false
    if (force !== null && typeof force === 'number') {
      if (force === -1) {
        this.elements.checkboxInput.checked = false
        this.elements.checkboxInput.indeterminate = true
      } else {
        this.elements.checkboxInput.checked = force === 1 ? true : false
      }
    } else {
      this.elements.checkboxInput.checked = !this.elements.checkboxInput.checked
      // this.elements.checkboxInput.click()
    }
    if (dispatchEvent) {
      this.elements.checkboxInput.dispatchEvent(event)
    } else {
      this.indeterminate = this.elements.checkboxInput.indeterminate
      this.checked = this.elements.checkboxInput.checked
    }
  }

  /**
   * Atualiza o estado de todos os nós ligados ao nó marcado ou desmarcado (descendentes e ancestrais)
   */
  updateFamilyStatus() {
    // Atualizando os descendentes
    const force = this.checked ? 1 : 0
    this.updateDecendants(this.children, force)
    // Atualizando os ancestrais
    this.updateAncestors(this.parent)
  }

  /**
   * Função recursiva para percorrer e atualizar a visibilidade de todos os descendentes (filhos dos filhos etc...)
   * @param {Node[]} children Nós filhos diretos
   * @param {number} visibility Indica o estado repassado para verificação dos próximos
   */
  updateVisibilityStatus(children, visibility = true) {
    children.forEach((child) => {
      visibility = visibility && child.parent.open
      child.visible = visibility
      if (child.children.length) {
        this.updateVisibilityStatus(child.children, visibility)
      }
    })
  }

  /**
   * Função recursiva para percorrer e atualizar todos os descendentes (filhos dos filhos etc...)
   * @param {Node[]} children Nós filhos diretos
   * @param {number} force Indica o estado a ser aplicado em todos os descendentes
   */
  updateDecendants(children, force) {
    children.forEach((child) => {
      child.toggleCheckbox(force, false)
      if (child.children.length) {
        this.updateDecendants(child.children, force)
      }
    })
  }

  /**
   * Função recursiva para percorrer e atualizar todos os ancestrais (pais dos pais etc...)
   * @param {Node} parent Nó pai
   */
  updateAncestors(parent) {
    if (parent === null) {
      return
    }
    let all = true
    let some = false
    parent.children.forEach((sinbling) => {
      all = all && sinbling.checked
      some = some || sinbling.checked || sinbling.indeterminate
    })
    const force = all ? 1 : some ? -1 : 0
    parent.toggleCheckbox(force, false)
    this.updateAncestors(parent.parent)
  }
}
