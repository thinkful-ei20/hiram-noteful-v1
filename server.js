// External libraries
const express = require(`express`)
const morgan = require(`morgan`)
// Config
const { PORT } = require(`./config`)

const app = express()
app.use(morgan(`dev`))
app.use(express.static(`public`))
app.use(express.json())

/**
 * Routers
 */
const notesRouter = require(`./routers/notes.router`)
app.use(`/api`, notesRouter)

/**
 * Errors
 */

app.use((req, res) => {
  const err = new Error(`Not found`)
  err.status = 404
  res.status(404).json({ message: `Not Found` })
})

app.use((err, req, res) => {
  res.status(err.status || 500)
  res.json({
    message: err.message,
    error: err,
  })
})

/**
 * Start server
 */

app
  .listen(PORT, function() {
    console.info(`Server listening on ${this.address().port}`)
  })
  .on(`error`, err => {
    console.error(err)
  })
