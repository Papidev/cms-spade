export default function({ $axios, redirect }) {
  $axios.onRequest((config) => {
    console.log('Axios request to ' + config.url)
  })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    console.log('Error axios ' + error)
    if (code === 400) {
      redirect('/400')
    }
  })
}
