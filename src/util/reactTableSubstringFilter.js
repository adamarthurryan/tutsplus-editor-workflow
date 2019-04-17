

export default (filter, row, column) => typeof row[filter.id] === "string" ? row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) >= 0 : false