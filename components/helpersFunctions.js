import axios from 'axios'
import Strapi from 'strapi-sdk-javascript/build/main'
import { queryPlacesByName, queryPlacesByIdentifier } from './helpersGraph'

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

async function axiosGet(url) {
  try {
    const response = await axios.get(url)
    return response
  } catch (err) {
    console.log(err)
  }
}

async function queryCms(attribute, searchString, lang, url) {
  let query
  try {
    const strapi = new Strapi(url)
    if (attribute === 'Identifier')
      query = queryPlacesByIdentifier(searchString)
    else query = queryPlacesByName(searchString)

    console.log(query)
    const response = await strapi.request('post', '/graphql', {
      data: {
        query
      }
    })

    const content = response.data.places[0]
    if (typeof content !== 'undefined') {
      console.log('Description ' + content.Description)
      return content
    } else return null
  } catch (err) {
    console.log('fetch failed', err)
    return null
  }
}

export { getDataEndpoint, mergeNamesDescriptions, axiosGet, queryCms }
