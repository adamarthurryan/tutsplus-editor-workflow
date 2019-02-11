const APP="tutsplus-editor-workflow"

export const get = () => JSON.parse(localStorage.getItem(APP+'state')) || undefined;

export function set (state, props) {
  let toSave = {}
  props.forEach(p => toSave[p] = state[p])
  localStorage.setItem(APP+'state', JSON.stringify(toSave))
}