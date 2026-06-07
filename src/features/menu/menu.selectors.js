export function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
}

export function matchesQuery(item, query) {
  const q = normalizeText(query)

  if (!q) return true

  const haystack = [
    item.name,
    item.description,
    item.category,
  ]
    .map(normalizeText)
    .join(" ")

  return haystack.includes(q)
}

export function filterMenuItems({
  items,
  categoryId,
  query,
}) {
  return (items || []).filter((item) => {
    if (item.available === false) {
      return false
    }

    const categoryOk =
      !categoryId ||
      categoryId === "all" ||
      item.category === categoryId

    return categoryOk && matchesQuery(item, query)
  })
}