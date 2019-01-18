//an array of trello cards
export function cards (state, action) {
    switch (action.type) {
      case 'add_card':
        return state.push(action.data)
      case 'clear_cards':
        return []
      default: 
        return state || []
    }
}
  

const loader = (key) => (state, action) => {
  switch (action.type) {  
    case `loading_${key}`:
      return Object.assign({}, state, {status: STATE_LOADING, error: null})

    case `done_loading_${key}`:
      return Object.assign({}, state, {status: STATE_DONE, error: null})

    case `error_loading_${key}`:
      return Object.assign({}, state, {status: STATE_ERROR, error: action.data})

    default:
      return state || {status: STATE_EMPTY, error: null}

  }
}

export const cardsLoader = loader('cards') 

export const STATE_EMPTY = "empty"
export const STATE_LOADING = "loading"
export const STATE_DONE = "done"
export const STATE_ERROR = "error"
