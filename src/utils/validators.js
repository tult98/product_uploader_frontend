export const validateSKU = (sku, variations, errors, setErrors) => {
  variations.map((variation) => {
    if (!variation.sku || variation.sku === '') {
      setErrors({ ...errors, sku: null })
    }
    let count = 0
    for (const variation of variations) {
      if (variation.sku === sku) {
        count += 1
      }
    }
    count > 1 ? setErrors({ ...errors, sku: 'SKU is duplicated' }) : setErrors({ ...errors, sku: null })
  })
}
