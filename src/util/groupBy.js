const collect = (collection, key, value) => collection[key] ? collection[key].push(value) : collection[key] = [value]  

const groupBy = (list, fieldName) => list.reduce( (acc,item) => {
    collect(acc, item[fieldName], item)
    return acc
}, {} )

export default groupBy

