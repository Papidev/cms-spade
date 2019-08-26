import axios from 'axios'
import Strapi from 'strapi-sdk-javascript/build/main'

function getDataEndpoint(lang, source, operation) {
  return process.env.endpoints[source][lang][operation]
}

function mergeNamesDescriptions(names, descriptions) {
  const result = []
  for (let i = 0; i < names.length; i++) {
    result.push({
      id: i,
      name: names[i],
      description: descriptions[i]
    })
  }
  return [{ data: result }]
}

async function fetchData(url) {
  try {
    const response = await axios.get(url)
    return response
  } catch (err) {
    console.log(err)
  }
}

async function queryCms(name, lang) {
  try {
    const url = getDataEndpoint(lang, 'cms', 'query')
    const strapi = new Strapi(url)

    const query = `query {
      places(where: { Name: "${name}" }) {
        id
        Identifier
        Name
        Description
      }
    }`

    const response = await strapi.request('post', '/graphql', {
      data: {
        query
      }
    })

    const content = response.data.places[0]
    if (typeof content !== 'undefined') {
      console.log('Description ' + content.Description)
      return content.Description
    } else return 'Nessun response trovato'
  } catch (err) {
    console.log('fetch failed', err)
  }
}

export { getDataEndpoint, mergeNamesDescriptions, fetchData, queryCms }
