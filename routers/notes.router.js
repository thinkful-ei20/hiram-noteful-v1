const express = require(`express`)
const router = express.Router()

// Internal libraries
const data = require(`../db/notes`)
const simDB = require(`../db/simDB`)
// In-Memory Database
const notes = simDB.initialize(data)

router.get(`/notes`, (req, res, next) => {
  const { searchTerm } = req.query
  notes
    .filter(searchTerm)
    .then(list => res.json(list))
    .catch(err => next(err))
})

router.get(`/notes/:id`, (req, res, next) => {
  notes
    .find(req.params.id)
    .then(note => (note ? res.json(note) : next()))
    .catch(err => next(err))
})

router.put(`/notes/:id`, (req, res, next) => {
  const id = req.params.id

  const updateObj = {}
  const updateFields = [`title`, `content`]

  updateFields.forEach(field => {
    if (field in req.body) updateObj[field] = req.body[field]
  })

  notes
    .update(id, updateObj)
    .then(item => (item ? res.json(item) : next()))
    .catch(err => next(err))
})

router.post(`/notes`, (req, res, next) => {
  const { title, content } = req.body

  const newItem = { title, content }
  if (!newItem.title) {
    const err = new Error(`Missing 'title' in request body`)
    err.status = 400
    return next(err)
  }

  notes
    .create(newItem)
    .then(item =>
      res
        .location(`http://${req.headers.host}/notes/${item.id}`)
        .status(201)
        .json(item)
    )
    .catch(err => next(err))
})

router.delete(`/notes/:id`, (req, res, next) => {
  notes
    .delete(Number(req.params.id))
    .then(() => res.status(204).end())
    .catch(err => {
      err.status(500)
      next(err)
    })
})

module.exports = router
