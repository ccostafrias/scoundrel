const objectToArrayWithName = (obj) => {
  return Object.entries(obj).map(([key, value]) => ({
    name: key,
    ...value
  }))
}

export default objectToArrayWithName
