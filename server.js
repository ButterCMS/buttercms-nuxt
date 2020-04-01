const { loadNuxt, build } = require('nuxt')

const app = require('express')()
const isDev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3001
const Butter = require('buttercms')
const butter = Butter('132577962393d9b59a1115f257b66aae50b5a2c7')

async function start() {
  // We get Nuxt instance
  const nuxt = await loadNuxt(isDev ? 'dev' : 'start')

  app.get('/sitemap', (req, res) => {
    butter.feed.retrieve('sitemap').then((s) => {
      res.send(s.data.data)
    })
  })

  app.get('/atom', (req, res) => {
    butter.feed.retrieve('atom').then((s) => {
      res.send(s.data.data)
    })
  })

  app.get('/rss', (req, res) => {
    butter.feed.retrieve('rss').then((s) => {
      res.send(s.data.data)
    })
  })

  // Render every route with Nuxt.js
  app.use(nuxt.render)

  // Build only in dev mode with hot-reloading
  if (isDev) {
    build(nuxt)
  }

  // Listen the server
  app.listen(port, '0.0.0.0')
  console.log('Server listening on `localhost:' + port + '`.')
}

start()
