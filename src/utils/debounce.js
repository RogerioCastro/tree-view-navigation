/**
 * Cria um debounce para impedir a execução contínua de uma ação
 * em um evento.
 *
 * @param {function} fn - Tempo em milissegundos.
 * @param {integer} [ms] - Tempo em milissegundos.
 *
 * @returns {function} Função de atraso.
 */
export default function debounce(fn, ms = 0) {
  let timeoutId
  return function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}