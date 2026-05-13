export function seed(knex) {
  return knex('products').del()
    .then(function () {
      return knex('products').insert([
        {
          description: 'Hamburger',
          size: 'Medium',
          price: 1500, // cents or whatever
          url: 'http://example.com/hamburger',
          unit: 1,
          image_id: 'img2'
        },
        {
          description: 'Margherita Pizza',
          size: 'Large',
          price: 2500,
          url: 'http://example.com/pizza',
          unit: 1,
          image_id: 'img3'
        },
        {
          description: 'Soda',
          size: '350ml',
          price: 500,
          url: 'http://example.com/soda',
          unit: 1,
          image_id: null
        }
      ]);
    });
};