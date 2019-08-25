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

async function fetchCms(name, lang) {
  try {
    const url = getDataEndpoint(lang, 'cms', 'fetch')
    console.log('fetch cms url : ' + url)
    const strapi = new Strapi(url)
    const risultato = await strapi.request('post', '/graphql', {
      data: {
        query: `query {
attractions (where: {
   
Name: "${name}"
}){
Description
}
}`
      }
    })

    if (typeof risultato.data.attractions[0] !== 'undefined') {
      return risultato.data.attractions[0].Description
    } else return 'Nessun risultato trovato'
  } catch (err) {
    console.log('fetch failed', err)
  }
}

export { getDataEndpoint, mergeNamesDescriptions, fetchData }
