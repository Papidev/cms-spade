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

async function getPlaceByName(name, lang) {
  let wikiResult
  let cmsResult = ''
  console.log('start getPlaceByName')
  cmsResult = await getPlaceByNameCms(name, lang)

  if (cmsResult !== null && cmsResult !== undefined) {
    console.log('Trovato record su CMS')
    return cmsResult
  } else {
    console.log('Trovato niente su CMS')
    wikiResult = await getPlaceByNameWiki(name, lang)
    return wikiResult
  }
}

async function getPlaceByNameCms(name, lang) {
  console.log('start getPlaceByNameCms ')
  const query = queryPlacesByName(name)
  console.log(query)
  try {
    const url = getDataEndpoint(lang, 'cms', 'query')
    const strapi = new Strapi(url)
    const response = await strapi.request('post', '/graphql', {
      data: {
        query
      }
    })
    const content = response.data.places[0]
    if (typeof content !== 'undefined') {
      console.log(
        'getPlaceByNameCms : content.Description ' + content.Description
      )
      return content.Description
    } else {
      console.log('getPlaceByNameCms : response vuota')
      return null
    }
  } catch (err) {
    console.log('fetch failed', err)
    return null
  }
}

async function getPlaceByNameWiki(name, lang) {
  console.log('start getPlaceByNameWiki ')
  // const query = queryPlacesByName(name)
  // console.log('query ' + query)
  try {
    const url = getDataEndpoint('en', 'wikipedia', 'query') + name

    console.log('url ' + url)
    const response = await axiosGet(url)
    // const strapi = new Strapi(url)
    // const response = await strapi.request('post', '/graphql', {
    //   data: {
    //     query
    //   }
    // })
    // const content = response.data.places[0]
    if (typeof response !== 'undefined') {
      console.log('getPlaceByNameWiki : response ')
      console.log(response)

      const page = Object.keys(response.data.query.pages)[0]
      const wikiContent = response.data.query.pages[page].extract
      return wikiContent
    } else {
      console.log('getPlaceByNameWiki : response vuota')
      return null
    }
  } catch (err) {
    console.log('fetch failed', err)
    return null
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

export {
  getDataEndpoint,
  mergeNamesDescriptions,
  axiosGet,
  queryCms,
  getPlaceByName
}
