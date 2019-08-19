function getDataEndpoint(lang, source, operation) {
  return process.env.endpoints[source][lang][operation]
}

export { getDataEndpoint }
