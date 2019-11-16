export default {
  methods: {
    queryPlacesByName(name) {
      return `query {
    places(where: { Name: "${name}" }) {
      id
      Identifier
      Name
      Description
    }
  }`
    },
    queryPlacesByIdentifier(identifier) {
      return `query {
    places(where: { Identifier: "${identifier}" }) {
      id
      Identifier
      Name
      Description
    }
  }`
    }
  }
}
