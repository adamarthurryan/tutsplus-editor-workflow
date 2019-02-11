//creates a data store with add, add multiple and clear transitions
// this could have a primary key field
const data = (key, keyPlural) => (state, action) => {
  switch (action.type) {
    case `add_${key}`:
      return state.push(action.data)
    case `add_${keyPlural}`:
      return state.concat(action.data)
    case `clear_${keyPlural}`:
      return []
    default: 
      return state || []
  }
}

//creates a loader data store with loading, done loading, error loading, and empty states
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

//an array of trello cards
export const cards = data('card', 'cards')
//an array of content spaces
export const spaces = data('space', 'spaces')
//an array of keywords
export const keywords = data('keyword', 'keywords')

export const posts = data('post', 'posts')


export const cardsLoader = loader('cards') 
export const spacesLoader = loader('spaces') 
export const keywordsLoader = loader('keywords') 
export const postsLoader = loader('posts')

export const STATE_EMPTY = "empty"
export const STATE_LOADING = "loading"
export const STATE_DONE = "done"
export const STATE_ERROR = "error"

