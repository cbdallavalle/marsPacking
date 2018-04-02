const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.locals.title = 'Mars Packing List'

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.get('/', (request, response) => {

})

app.get('/api/v1/mars_items', async (request, response) => {
  try {
    const items = await database('items').select();
    return response.status(200).json(items);
  } catch (error) {
    return response.status(500).json({ error });
  }
})

app.post('/api/v1/mars_items', (request, response) => {
  const itemToAdd = request.body;

  for(let requiredParams of ['name', 'packed']) {
    if (!itemToAdd[requiredParams]) {
      return response
        .status(422)
        .send({ error: `You are missing a ${ requiredParams }`})
    }
  }

  database('items').insert(itemToAdd, 'id')
    .then(item => {
      return response.status(201).json({ id: item[0] })
    })
    .catch(error => {
      return response.status(500).json({ error: error.message })
    })
})

app.put('/api/v1/mars_items/:id', (request, response) => {
  const itemToUpdate = request.body;
  const { id } = request.params;

  for(let requiredParam of ['packed']) {
    if (!itemToUpdate[requiredParam]) {
      return response
        .status(422)
        .send({ error: `You are missing a ${ requiredParam }`})
    }
  }

  database('items').where('id', id).update({ ...itemToUpdate })
    .then( item => {
      response.status(201).json({ ...itemToUpdate })
    })
    .catch( error => {
      response.status(500).json({ error: 'Can only accept an update to whether the item is packed or not' })
    })
})

app.delete('/api/v1/mars_items/:id', async (request, response) => {
  const { id } = request.params;

  try {
    await database('items').where('id', id).del();
    return response.status(202).json({ id: id });
  } catch (error) {
    return response.status(500).json({ error: error.message })
  }
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server running on port 3000.`)
})

module.exports = app;