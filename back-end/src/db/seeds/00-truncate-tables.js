exports.seed = function (knex) {
  return knex.raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
    .then(() => {
      knex.raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")
    })
};
