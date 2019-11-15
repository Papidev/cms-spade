function queryPlacesByName(name) {
  return `query {
    places(where: { Name: "${name}" }) {
      id
      Identifier
      Name
      Description
    }
  }`
}
function queryPlacesByIdentifier(identifier) {
  return `query {
    places(where: { Identifier: "${identifier}" }) {
      id
      Identifier
      Name
      Description
    }
  }`
}

export { queryPlacesByName, queryPlacesByIdentifier }
