import css from './css'

/**
 * Cria um elemento DOM com vários atributos
 * via: https://github.com/usablica/intro.js
 *
 * @param {String} tagName
 * @param {Object} attrs
 * @return Elemento
 */
export default function _createElement (tagName, attrs) {
  const element = document.createElement(tagName)

  attrs = attrs || {}

  // atributos que precisam ser inseridos por meio da função 'setAttribute'
  const setAttRegex = /^(?:role|data-|aria-|for)/

  for (const k in attrs) {
    const v = attrs[k]

    if (k === 'style') {
      css(element, v)
    } else if (k.match(setAttRegex)) {
      element.setAttribute(k, v)
    } else {
      element[k] = v
    }
  }

  return element
}
