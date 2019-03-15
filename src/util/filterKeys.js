
const filterKeys = (object, keys) => {
	let filtered = {}
	keys.forEach(key => filtered[key]=object[key])
	return filtered
}  

export default filterKeys