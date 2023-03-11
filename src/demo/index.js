import TreeViewNavigation from "../"
import data from './demo.json'

const el = document.querySelector('#tree')

const tree = new TreeViewNavigation({
  container: el,
  data,
  labelFormatter: (node) => {
    if (node.metadata.new) {
      return `${node.label} <small class="chip">NOVO</small>`
    }
    if (node.label === 'Mamíferos') {
      return `<strong>${node.label}</strong>`
    }
    return node.label
  },
  onRender: (nodes) => [
    console.log('renderizado:', nodes)
  ],
  selected: [2, 6, 7, 12],
  depth: 2
})

tree.on('switch', (params) => [
  console.log('switch:', params)
])
tree.on('change', (params) => [
  console.log('change:', params)
])
tree.on('click', (params) => [
  console.log('click:', params)
])
