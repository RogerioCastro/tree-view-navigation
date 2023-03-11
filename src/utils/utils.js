/**
 * Fornece uma forma cross-browser para obter as dimensões da tela
 * via: http://stackoverflow.com/questions/5864467/internet-explorer-innerheight
 *
 * @returns {Object} Atributos largura e altura { width, height }
 */
export function getWindowSize () {
  if (window.innerWidth !== undefined) {
    return { width: window.innerWidth, height: window.innerHeight, element: window }
  } else if (document && document.documentElement?.clientWidth !== undefined) {
    const D = document.documentElement
    return { width: D.clientWidth, height: D.clientHeight, element: D }
  } else {
    const D = document.body
    return { width: D.clientWidth, height: D.clientHeight, element: D }
  }
}

export const colors = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#f032e6',
  '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3',
  '#808000', '#ffd8b1', '#000075', '#808080',
  '#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#ff7f00',
  '#cab2d6', '#6a3d9a', '#b15928', 'rgb(174,227,154)', '#fdbf6f',
  'rgb(39,91,82)', 'rgb(65,216,244)', 'rgb(91,61,172)', 'rgb(101,139,251)',
  'rgb(75,79,122)', 'rgb(252,194,251)', 'rgb(208,50,163)', 'rgb(185,126,172)',
  'rgb(120,40,87)', 'rgb(191,214,250)', 'rgb(6,165,108)', 'rgb(99,239,133)',
  'rgb(131,151,109)', 'rgb(125,68,0)', 'rgb(255,116,60)', 'rgb(252,183,144)',
  'rgb(174,48,31)', 'rgb(242,192,41)', 'rgb(255,28,93)',
  '#63b598', '#ce7d78', '#ea9e70', '#a48a9e', '#c6e1e8', '#648177', '#0d5ac1',
  '#f205e6', '#1c0365', '#14a9ad', '#4ca2f9', '#a4e43f', '#d298e2', '#6119d0',
  '#d2737d', '#c0a43c', '#f2510e', '#651be6', '#79806e', '#61da5e', '#cd2f00',
  '#9348af', '#01ac53', '#c5a4fb', '#996635', '#b11573', '#4bb473', '#75d89e',
  '#2f3f94', '#2f7b99', '#da967d', '#34891f', '#b0d87b', '#ca4751', '#7e50a8',
  '#c4d647', '#e0eeb8', '#11dec1', '#289812', '#566ca0', '#ffdbe1', '#2f1179',
  '#935b6d', '#916988', '#513d98', '#aead3a', '#9e6d71', '#4b5bdc', '#0cd36d',
  '#250662', '#cb5bea', '#228916', '#ac3e1b', '#df514a', '#539397', '#880977',
  '#f697c1', '#ba96ce', '#679c9d', '#c6c42c', '#5d2c52', '#48b41b', '#e1cf3b',
  '#5be4f0', '#57c4d8', '#a4d17a', '#225b8', '#be608b', '#96b00c', '#088baf',
  '#f158bf', '#e145ba', '#ee91e3', '#05d371', '#5426e0', '#4834d0', '#802234',
  '#6749e8', '#0971f0', '#8fb413', '#b2b4f0', '#c3c89d', '#c9a941', '#41d158',
  '#fb21a3', '#51aed9', '#5bb32d', '#807fb', '#21538e', '#89d534', '#d36647',
  '#7fb411', '#0023b8', '#3b8c2a', '#986b53', '#f50422', '#983f7a', '#ea24a3',
  '#79352c', '#521250', '#c79ed2', '#d6dd92', '#e33e52', '#b2be57', '#fa06ec',
  '#1bb699', '#6b2e5f', '#64820f', '#1c271', '#21538e', '#89d534', '#d36647',
  '#7fb411', '#0023b8', '#3b8c2a', '#986b53', '#f50422', '#983f7a', '#ea24a3',
  '#79352c', '#521250', '#c79ed2', '#d6dd92', '#e33e52', '#b2be57', '#fa06ec',
  '#1bb699', '#6b2e5f', '#64820f', '#1c271', '#9cb64a', '#996c48', '#9ab9b7',
  '#06e052', '#e3a481', '#0eb621', '#fc458e', '#b2db15', '#aa226d', '#792ed8',
  '#73872a', '#520d3a', '#cefcb8', '#a5b3d9', '#7d1d85', '#c4fd57', '#f1ae16',
  '#8fe22a', '#ef6e3c', '#243eeb', '#1dc18', '#dd93fd', '#3f8473', '#e7dbce',
  '#421f79', '#7a3d93', '#635f6d', '#93f2d7', '#9b5c2a', '#15b9ee', '#0f5997',
  '#409188', '#911e20', '#1350ce', '#10e5b1', '#fff4d7', '#cb2582', '#ce00be',
  '#32d5d6', '#17232', '#608572', '#c79bc2', '#00f87c', '#77772a', '#6995ba',
  '#fc6b57', '#f07815', '#8fd883', '#060e27', '#96e591', '#21d52e', '#d00043',
  '#b47162', '#1ec227', '#4f0f6f', '#1d1d58', '#947002', '#bde052', '#e08c56',
  '#28fcfd', '#bb09b', '#36486a', '#d02e29', '#1ae6db', '#3e464c', '#a84a8f',
  '#911e7e', '#3f16d9', '#0f525f', '#ac7c0a', '#b4c086', '#c9d730', '#30cc49',
  '#3d6751', '#fb4c03', '#640fc1', '#62c03e', '#d3493a', '#88aa0b', '#406df9',
  '#615af0', '#4be47', '#2a3434', '#4a543f', '#79bca0', '#a8b8d4', '#00efd4',
  '#7ad236', '#7260d8', '#1deaa7', '#06f43a', '#823c59', '#e3d94c', '#dc1c06',
  '#f53b2a', '#b46238', '#2dfff6', '#a82b89', '#1a8011', '#436a9f', '#1a806a',
  '#4cf09d', '#c188a2', '#67eb4b', '#b308d3', '#fc7e41', '#af3101', '#ff065',
  '#71b1f4', '#a2f8a5', '#e23dd0', '#d3486d', '#00f7f9', '#474893', '#3cec35',
  '#1c65cb', '#5d1d0c', '#2d7d2a', '#ff3420', '#5cdd87', '#a259a4', '#e4ac44',
  '#1bede6', '#8798a4', '#d7790f', '#b2c24f', '#de73c2', '#d70a9c', '#25b67',
  '#88e9b8', '#c2b0e2', '#86e98f', '#ae90e2', '#1a806b', '#436a9e', '#0ec0ff',
  '#f812b3', '#b17fc9', '#8d6c2f', '#d3277a', '#2ca1ae', '#9685eb', '#8a96c6',
  '#dba2e6', '#76fc1b', '#608fa4', '#20f6ba', '#07d7f6', '#dce77a', '#77ecca'
]

export function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Formata um número inteiro para acrescentar ponto nas casas de milhares.
 *
 * @param {integer} number - Número a ser formatado.
 *
 * @returns {string} Número formatado como string para ser exibido.
 */
export function formatNumber(number) {
  return new Intl.NumberFormat('pt-BR').format(number);
}

/**
 * Aplica regras CSS a um elemento DOM
 * via: https://www.javascripttutorial.net/dom/css/add-styles-to-an-element/
 *
 * @param {Object} element
 * @param {Object|string} style
 */
export function css (element, style) {
  for (const property in style) {
    element.style[property] = style[property]
  }
}

/**
 * Cria um elemento DOM com vários atributos
 * via: https://github.com/usablica/intro.js
 *
 * @param {String} tagName
 * @param {Object} attrs
 * @return Elemento
 */
export function createElement (tagName, attrs) {
  const element = document.createElement(tagName)

  attrs = attrs || {}

  // atributos que precisam ser inseridos por meio da função 'setAttribute'
  const setAttRegex = /^(?:role|data-|aria-)/

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

/**
 * Função que aguarda um determinado tempo para devolver a promise e
 * pode ser utilizada para aplicar um delay à execução de instruções.
 * Exemplo: sleep(2000).then(() => { console.log('Hello world!') })
 *
 * @param {integer} ms - Tempo em milissegundos.
 *
 * @returns {Promise} Promise.
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Remove todos os elementos dentro de outro elemento HTML informado
 * @param {Object} parent HTMLElement a ser limpo
 */
export function clearElement (parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}

export const debounce = (fn, ms = 0) => {
  let timeoutId
  return function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}
