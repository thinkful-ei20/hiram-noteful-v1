`use strict`;

// External libraries
const express = require(`express`);
// Middleware
const { requestLogger } = require(`./middleware/logger`);
// Internal libraries
const data = require(`./db/notes`);
const simDB = require(`./db/simDB`);
// In-Memory Database
const notes = simDB.initialize(data);
// Config
const { PORT } = require(`./config`);

const app = express();
app.use(express.static(`public`));
app.use(requestLogger);
app.use(express.json());

/**
 * Endpoints
 */

app.get(`/api/notes`, (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm, (err, list) => {
    if (err) return next(err);
    res.json(list);
  });
});

app.get(`/api/notes/:id`, (req, res, next) => {
  const note = notes.find(req.params.id, (err, item) => {
    if (err) return next(err);
    res.json(item);
  });
});

app.put(`/api/notes/:id`, (req, res, next) => {
  const id = req.params.id;

  const updateObj = {};
  const updateFields = [`title`, `content`];

  updateFields.forEach(field => {
    if (field in req.body) updateObj[field] = req.body[field];
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) return next(err);
    if (item) res.json(item);
    else next();
  });
});

/**
 * Errors
 */

app.use((req, res, next) => {
  const err = new Error(`Not found`);
  err.status = 404;
  res.status(404).json({ message: `Not Found` });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

/**
 * Start server
 */

app
  .listen(PORT, function() {
    console.info(`Server listening on ${this.address().port}`);
  })
  .on(`error`, err => {
    console.error(err);
  });
