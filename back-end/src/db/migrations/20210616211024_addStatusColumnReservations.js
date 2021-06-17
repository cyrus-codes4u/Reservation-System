
exports.up = function(knex) {
  return knex.schema.table("reservations", function(table){
    table.string("status", "booked")
  })
    
};

exports.down = function(knex) {
  return knex.schema.table("reservations", function(table){
    table.dropColumn("status")
  })
};
