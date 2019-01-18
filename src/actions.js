
export const addCard = (items) => ({type: 'add_card', data:card})
export const clearCards = () => ({type: 'clear_cards'})


export const loadingCards = () => ({type: 'loading_cards'})
export const doneLoadingCards = () => ({type: 'done_loading_cards'})
export const errorLoadingCards = (error) => ({type: 'error_loading_cards', data: error})
