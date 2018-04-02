const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return a index.html when visiting the homepage', () => {
    return chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200);
      response.should.be.html;
    })
    .catch(error => {
      throw error
    });
  });

  it('should return a 404 if the requested page is not found', () => {
    return chai.request(server)
    .get('/IWANTTOBELEIVE')
    .then(response => {
      response.should.have.status(404)
    })
    .catch(error => {
      throw error
    });
  });
});

describe('API Routes', () => {
  
  beforeEach( done => {
    database.migrate.rollback()
    .then( () => {
      database.migrate.latest()
      .then( () => {
        return database.seed.run()
        .then( () => {
          done();
        });
      });
    });
  });

  describe('GET /api/v1/mars_items', () => {
    it('should return all of the items in the test database', () => {
      return chai.request(server)
      .get('/api/v1/mars_items')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);        
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Astro Suit');
      });
    });
  });

  describe('POST /api/v1/mars_items', () => {
    it('should create a new item and return the unique id', () => {
      return chai.request(server)
      .post('/api/v1/mars_items')
      .send({
        name: 'Dana Scully',
        packed: 'false'
      })
      .then(response => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(3);
      })
      .catch( error => {
        throw error
      });
    });

    it('should create return a 422 status code if no name is provided', () => {
      return chai.request(server)
      .post('/api/v1/mars_items')
      .send({
        // name: 'Dana Scully',
        packed: 'false'
      })
      .then(response => {
        response.should.have.status(422);
        response.body.error.should.equal('You are missing a name');
      })
      .catch( error => {
        throw error
      });
    });

    it('should create return a 422 status code if no packed status is provided', () => {
      return chai.request(server)
      .post('/api/v1/mars_items')
      .send({
        name: 'Dana Scully',
        // packed: 'false'
      })
      .then(response => {
        response.should.have.status(422);
        response.body.error.should.equal('You are missing a packed');
      })
      .catch( error => {
        throw error
      });
    });

    it('should return a 500 if a key value pair is provided that is not recognized', () => {
      return chai.request(server)
      .post('/api/v1/mars_items')
      .send({
        name: 'space booties',
        packed: 'true',
        areYourSpaceBootiesCute: 'You bet! They got flowers and aliens on em'
      })
      .then(response => {
        response.should.have.status(500);
        response.body.error.should.equal('insert into "items" ("areYourSpaceBootiesCute", "name", "packed") values ($1, $2, $3) returning "id" - column "areYourSpaceBootiesCute" of relation "items" does not exist');
      })
      .catch( error => {
        throw error
      });
    });
  });

  describe('PUT /api/v1/mars_items/:id', () => {
    it('should update an item and return what was updated', () => {
      return chai.request(server)
      .put('/api/v1/mars_items/2')
      .send({
        packed: 'true'
      })
      .then(response => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('packed');
        response.body.packed.should.equal('true');
      })
      .catch( error => {
        throw error
      });
    });

    it('should return a 422 if no packed is provided', () => {
      return chai.request(server)
      .put('/api/v1/mars_items/2')
      .send({
        // packed: 'true'
      })
      .then(response => {
        response.should.have.status(422);
        response.body.error.should.equal('You are missing a packed');
      })
      .catch( error => {
        throw error
      });
    });

    it('should return a 500 if a key value pair is provided that is not recognized', () => {
      return chai.request(server)
      .put('/api/v1/mars_items/2')
      .send({
        packed: 'true',
        inSpace: 'SOOOOOOONNNNN'
      })
      .then(response => {
        response.should.have.status(500);
        response.body.error.should.equal('Can only accept an update to whether the item is packed or not');
      })
      .catch( error => {
        throw error
      });
    });
  });

  describe('DELETE /api/v1/mars_items/:id', () => {
    it('should delete an item from the database and return the id of the deleted item', () => {
      return chai.request(server)
      .del('/api/v1/mars_items/1')
      .then(response => {
        response.should.have.status(202);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal('1');
      });
    });
  });
});