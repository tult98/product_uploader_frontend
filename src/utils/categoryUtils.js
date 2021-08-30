export const formatCategoriesData = (rawCategories) => {
  const categories = rawCategories.map((rawCategory) => {
    return {
      id: rawCategory.value,
      name: rawCategory.label,
    }
  })

  return categories
}
