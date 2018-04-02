exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('items').del()
    .then(function () {
      // Inserts seed entries
      return Promise.all([
        knex('items').insert({
          name: 'Astro Suit',
          packed: false
        }, 'id'),
        knex('items').insert({
          name: 'my cat\'s astro suits',
          packed: true
        })
      ])
      .then(() => console.log('Seeding complete'))
      .catch( error => console.log(`Error seeding: ${ error.message }`))
    });
};