export const formatName = name => {
  // prefix-display-name
  const matchArray = name.match(/^\w+-(.+)$/)
  return (matchArray ? matchArray[1] || name : name) // display-name
    .split('-') // ['display', 'name']
    .map(word => word[0].toUpperCase() + word.substr(1).toLowerCase()) // ['Display', 'Name']
    .join(' ') // Display Name
}
