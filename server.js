`use strict`;

const express = require(`express`);
const data = require(`./db/notes`);

const app = express()
app.use(express.static(`public`))

app.get(`/api/notes`, (req, res) => {
  const notes = data.filter((val) => {
    if (req.query.searchTerm) {
      return (
        val.title.toLowerCase().includes(req.query.searchTerm.toLowerCase()) ||
        val.content.toLowerCase().includes(req.query.searchTerm.toLowerCase())
      )
    }
    return true
  })
  res.json(notes)
})

app.get(`/api/notes/:id`, (req, res) => {
  const note = data.find((val) => val.id === Number(req.params.id))
  res.json(note)
})

app.listen(3000, function() {
  console.info(`Server listening on ${this.address().port}`)
}).on(`error`, err => {
  console.error(err)
})