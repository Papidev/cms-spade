import axios from 'axios'

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

export { getDataEndpoint, mergeNamesDescriptions, fetchData }
