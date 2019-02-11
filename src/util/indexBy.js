
//converts the list to a hash map, indexed by the given field name
//assumes the given field has unique values
const indexBy = (list, fieldName) => list.reduce( (acc,item) => {
    acc[item[fieldName]]=item
    return acc
}, {} )

export default indexBy

