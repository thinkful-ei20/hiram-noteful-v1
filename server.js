`use strict`;

const express = require(`express`);
const data = require(`./db/notes`);

const app = express();
app.use(express.static(`public`));

app.get(`/api/notes`, (req, res) => {
  const searchTerm = req.query.searchTerm;
  res.json(searchTerm ? data.filter(note => note.title.toLowerCase().includes(searchTerm)) : data);
});

app.get(`/api/notes/:id`, (req, res) => {
  const note = data.find(val => val.id === Number(req.params.id));
  res.json(note);
});

app
  .listen(3000, function() {
    console.info(`Server listening on ${this.address().port}`);
  })
  .on(`error`, err => {
    console.error(err);
  });
