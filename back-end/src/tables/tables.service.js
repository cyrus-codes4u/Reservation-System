const knex = require("../db/connection")

function list(){
    return knex("tables")
        .select("*")
        .orderBy("table_name")
}

function read(id){
    return knex("tables")
        .select("*")
        .where({table_id: id})
        .first()
}

function create(newTable){
    return knex("tables")
        .insert(newTable)
        .returning(["table_name", "capacity", "table_id"])
}

function update(id, updates){
    return knex("tables")
        .where({table_id: id})
        .update(updates)
        .returning(["table_name", "table_id", "capacity", "reservation_id"])
}

module.exports ={
    list,
    read,
    create,
    update
}