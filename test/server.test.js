const app = require(`../server`)
const chai = require(`chai`)
const chaiHttp = require(`chai-http`)

const expect = chai.expect
chai.use(chaiHttp)

describe(`Reality check`, () => {
  it(`true should be true`, () => {
    expect(true).to.be.true
  })

  it(`2 + 2 should equal 4`, () => {
    expect(2 + 2).to.eq(4)
  })
})

describe(`Express static`, () => {
  it(`GET request "/" should return index page`, () => {
    return chai
      .request(app)
      .get(`/`)
      .then(res => {
        expect(res).to.exist
        expect(res).to.have.status(200)
        expect(res).to.be.html
      })
  })
})

describe(`404 handler`, () => {
  it(`should respond with 404 when given a bad path`, () => {
    return chai
      .request(app)
      .get(`/bad/path`)
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404)
      })
  })
})

describe(`Notes`, () => {
  it(`should list notes on GET`, () => {
    return chai
      .request(app)
      .get(`/api/notes`)
      .then(res => {
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.body).to.be.a(`array`)
        expect(res.body.length).to.be.at.least(1)

        const expectedKeys = [`id`, `title`, `content`]
        res.body.forEach(item => {
          expect(item).to.be.a(`object`)
          expect(item).to.include.keys(expectedKeys)
        })
      })
  })

  it(`should add a note on POST`, () => {
    const newItem = { title: `coffee`, content: `is great` }
    return chai
      .request(app)
      .post(`/api/notes`)
      .send(newItem)
      .then(res => {
        expect(res).to.have.status(201)
        expect(res).to.be.json
        expect(res.body).to.be.a(`object`)
        expect(res.body).to.include.keys(`id`, `title`, `content`)
        expect(res.body.id).to.not.equal(null)
        expect(res.body).to.deep.equal(
          Object.assign(newItem, { id: res.body.id })
        )
      })
  })

  it(`should update notes on PUT`, () => {
    const updateData = {
      title: `foo`,
      content: `bar`,
    }

    return chai
      .request(app)
      .get(`/api/notes`)
      .then(res => {
        updateData.id = res.body[0].id
        return chai
          .request(app)
          .put(`/api/notes/${updateData.id}`)
          .send(updateData)
      })
      .then(res => {
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.body).to.be.a(`object`)
        expect(res.body).to.deep.equal(updateData)
      })
  })

  it(`should delete items on DELETE`, () => {
    return chai
      .request(app)
      .get(`/api/notes`)
      .then(res => {
        return chai.request(app).delete(`/api/notes/${res.body[0].id}`)
      })
      .then(res => {
        expect(res).to.have.status(204)
      })
  })
})
