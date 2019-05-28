export const toFixed = number => {
  return number.toFixed(2).replace(/\.?0+$/, '')
}
