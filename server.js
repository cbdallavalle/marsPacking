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


app.get('/', (request, response) => {

})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server running on port 3000.`)
})

module.exports = app;