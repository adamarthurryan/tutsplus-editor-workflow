import {capitalize} from './util/capitalize'

const dataActions = (key, keyPlural) => ({
    [`add${capitalize(key)}`]: (item) => ({type:`add_${key}`, data:item}),
    [`add${capitalize(keyPlural)}`]: (items) => ({type:`add_${keyPlural}`, data:items}),
    [`clear${capitalize(keyPlural)}`]: () => ({type: `clear_${keyPlural}`})
})

const loadingActions = (key) => ({
    [`loading${capitalize(key)}`]: () => ({type: `loading_${key}`}),
    [`doneLoading${capitalize(key)}`]: () => ({type: `done_loading_${key}`}),
    [`errorLoading${capitalize(key)}`]: (error) => ({type: `error_loading_${key}`, data: error})
})

const cardActions = dataActions('card', 'cards')
const spaceActions = dataActions('space', 'spaces')
const keywordActions = dataActions('keyword', 'keywords')
const postActions = dataActions('post', 'posts')

const cardLoadingActions = loadingActions('cards')
const spaceLoadingActions = loadingActions('spaces')
const keywordLoadingActions = loadingActions('keywords')
const postLoadingActions = loadingActions('posts')

function loadTrelloCsv(csv) {
    var formData  = new FormData();
    formData.append("trelloCsv", csv)

    return async function (dispatch, getState) {
        await fetch('/api/trello', {
            method: 'POST',
            body: formData
        })
    
        dispatch(startLoadingCards())    
    }
}
/*    return async function (dispatch, getState) {
 
        dispatch(cardActions.clearCards())
        dispatch(cardLoadingActions.loadingCards())
        
        try { 
            let cards = await trelloCsvIngest(csv)
            dispatch(cardActions.addCards(cards))
            dispatch(cardLoadingActions.doneLoadingCards(cards))
        }
        catch (error) {
            dispatch(cardLoadingActions.errorLoadingCards(error))
            console.log(error)
        }
    }
*/

const startLoadingSpaces = () => {
    console.log(spaceLoadingActions)
    console.log(spaceActions)
    let getQueryString = (getState) => "/api/spaces"

    let transformloaded = undefined

    return startLoading(getQueryString, transformloaded, {
        add:spaceActions.addSpaces, 
        errorLoading:spaceLoadingActions.errorLoadingSpaces, 
        loading:spaceLoadingActions.loadingSpaces, 
        doneLoading: spaceLoadingActions.doneLoadingSpaces, 
        clear: spaceActions.clearSpaces
    })
}
  
const startLoadingPosts = () => {
    let getQueryString = (getState) => "/api/posts"

    let transformloaded = undefined

    return startLoading(getQueryString, transformloaded, {
        add:postActions.addPosts, 
        errorLoading:postLoadingActions.errorLoadingPosts, 
        loading:postLoadingActions.loadingPosts, 
        doneLoading: postLoadingActions.doneLoadingPosts, 
        clear: postActions.clearPosts
    })
}

const startLoadingCards = () => {
    let getQueryString = (getState) => "/api/trello"

    let transformloaded = undefined

    return startLoading(getQueryString, transformloaded, {
        add: cardActions.addCards, 
        errorLoading: cardLoadingActions.errorLoadingCards, 
        loading: cardLoadingActions.loadingCards, 
        doneLoading: cardLoadingActions.doneLoadingCards, 
        clear: cardActions.clearCards
    })
}

const startLoadingKeywords = () => {
    let getQueryString = (getState) => "/api/keywords"

    let transformloaded = undefined

    return startLoading(getQueryString, transformloaded, {
        add:keywordActions.addKeywords, 
        errorLoading:keywordLoadingActions.errorLoadingKeywords, 
        loading:keywordLoadingActions.loadingKeywords, 
        doneLoading: keywordLoadingActions.doneLoadingKeywords, 
        clear: keywordActions.clearKeywords
    })
}

const startLoading = (getQueryString, transformLoaded=undefined, {add, errorLoading, loading, doneLoading, clear}) => {

    return function (dispatch, getState) {
   
      dispatch(clear())
      dispatch(loading(0,0))
  
      const queryString = getQueryString(getState)
  
      fetch(queryString)
        .then(response => {
          if (!response.ok)
            throw new Error(`Server returned ${response.status}`)
          else if (response.headers.get('content-type').indexOf("application/json")===-1)
            throw new Error(`Server returned non-JSON data (${response.headers.get('content-type')})`)
          else
            return response.json()
        })
        .then(loadedData => {
  
          if (transformLoaded)
            loadedData = transformLoaded(loadedData)
  
          dispatch(loading())
          dispatch(add(loadedData))
          dispatch(doneLoading())
        })
        .catch(error => {
          dispatch(errorLoading(error))
          console.log(error)
        })
  
    }
  }
  

export default Object.assign({}, 
    cardActions, cardLoadingActions, 
    spaceActions, spaceLoadingActions, 
    keywordActions, keywordLoadingActions,
    {loadTrelloCsv, startLoadingKeywords, startLoadingPosts, startLoadingSpaces, startLoadingCards}
)
