export function seed(knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        {
          name: 'Admin User',
          email: 'admin@example.com',
          password: '$2b$10$hashedpassword', // Use a hashed password in real scenario
          status: true,
          image_id: 'img1'
        },
        {
          name: 'John Doe',
          email: 'john@example.com',
          password: '$2b$10$hashedpassword',
          status: true,
          image_id: null
        }
      ]);
    });
};