## Synopsis

This application was a 5 hour exam to complete Mod4 of the Front End Program at Turing School of Software & Design. The requirements can be found [here](https://gist.github.com/robbiejaeger/6cf4ec7702d73540f8f0345268f2a8fe). 

The goal of the application was to create a Node Express backend using KNEX with a frontend where users can create a packing list for their trip to mars. The user's list is stored in a postgres database, and is updated via user interactions. Check out the live site on Heroku [here](https://dallavalle-mars-packing-list.herokuapp.com/).

## Motivation

I have two cats who I would totally bring to space with me. Hence, the cat theme!

## Installation

Clone the repo and run ```npm install```. 

The developer must create their own database, so install postgresql and run ```psql``` in your terminal. Then ```CREATE DATABASE mars_packing_list```. Exit out of psql with the command ```\q```. 

Run these two commands in the root project folder ```knex migrate:make initial``` and ```knex seed:run```. This seeds the database with initial list data. Now, the developer can start the server using ```node server.js```. Now the application will be running on the developer's local host.

Users now have access to all GET/POST/PUT/DELETE requests.

## API Reference

### GET

```GET '/api/v1/mars_items'```

Users will receive a list of all the items in the database and their unique ids.

### POST

```POST '/api/v1/mars_items'```

In order to successfully create a new item, the request body must be an object that contains two key value pairs: ```name``` must be a ```string``` and ```packed``` must be a string of ```true``` or ```false```.

Body example:
``` 
{
  "name": "Space Booties",
  "packed": "false"
}
```

### DELETE

```DELETE '/api/v1/mars_items/:id'```

In order to successfully delete an item, the ```:id``` in the request URL must be replaced with an item's unique id.

### PUT

```PUT '/api/v1/mars_items/:id'```

In order to successfully update an item, the ```:id``` in the request URL must be replaced with an item's unique id. The body must be an object with one key value pairs: ```packed``` and a ```string``` of either ```true``` or ```false```.

Body example:
``` 
{
  "packed": "true"
}
```

## Tests

In order to run the tests, the developer must create a new test database. Cloning the repo and run ```npm install```. Then in postgres, create a new database with the command ```CREATE DATABASE mars_packing_list_test```. Users can now run ```npm test  ``` for a complete testing suite.
