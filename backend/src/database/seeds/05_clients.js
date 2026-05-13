export function seed(knex) {
  return knex('clients').del()
    .then(function () {
      return knex('clients').insert([
        {
          name: 'Sample Client',
          cpf: '12345678901',
          address: 'Sample Street, 123',
          email: 'client@example.com',
          password: '$2b$10$hashedpassword',
          neighborhood: 'Center',
          city: 'São Paulo',
          phone: '11999999999',
          birth_date: '1990-01-01',
          card_number: '1234567890123456',
          card_expiry: '12/25',
          cvc: '123'
        }
      ]);
    });
};