export function seed(knex) {
  return knex('images').del()
    .then(function () {
      return knex('images').insert([
        {
          id: 'img1',
          name: 'default_user.jpg',
          size: '1024',
          key: 'default_user.jpg',
          url: 'http://example.com/default_user.jpg',
          is_product: false
        },
        {
          id: 'img2',
          name: 'hamburger.jpg',
          size: '2048',
          key: 'hamburger.jpg',
          url: 'http://example.com/hamburger.jpg',
          is_product: true
        },
        {
          id: 'img3',
          name: 'pizza.jpg',
          size: '1536',
          key: 'pizza.jpg',
          url: 'http://example.com/pizza.jpg',
          is_product: true
        }
      ]);
    });
};