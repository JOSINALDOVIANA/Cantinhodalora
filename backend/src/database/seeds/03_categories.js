export function seed(knex) {
  return knex('categories').del()
    .then(function () {
      return knex('categories').insert([
        {
          description: 'Foods'
        },
        {
          description: 'Drinks'
        },
        {
          description: 'Desserts'
        }
      ]);
    });
};