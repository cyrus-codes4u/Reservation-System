
exports.up = function(knex) {
    return knex.schema.createTable("tables", (table) => {
        table.increments("table_id").primary();
        table.timestamps(true, true);
        table.string("table_name").notNullable();
        table.integer("capacity").notNullable();
        table.integer("reservation_id").defaultTo(null).unsigned();
        table
            .foreign("reservation_id")
            .references("reservation_id")
            .inTable("reservations")
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable("tables");
};
