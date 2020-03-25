let nextNodeRef = 1

export function uniqueId() {
  return (nextNodeRef++).toString()
}
