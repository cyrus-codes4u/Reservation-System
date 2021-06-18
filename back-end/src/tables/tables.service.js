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
    return knex.transaction ( (trx) => {
        return knex("reservations")
            .transacting(trx)
            .where({reservation_id: updates.reservation_id})
            .update({status: "seated" })
            .then(() => {
                return knex("tables")
                    .where({table_id: id})
                    .update(updates)
                    .returning(["table_name", "table_id", "capacity", "reservation_id"])                    
            })
    })
}

function remove(id){
    return knex.transaction( async (trx) => {
        const table = await knex("tables").where({table_id: id}).first()
        return knex("reservations")            
            .transacting(trx)
            .where({reservation_id: table.reservation_id })
            .update({status: "finished" })
            .then(() => {
                return knex("tables")
                    .where({table_id: id})
                    .update({reservation_id: null})
                    .returning(["table_name", "table_id", "capacity", "reservation_id"])
            })
    })
}

module.exports ={
    list,
    read,
    create,
    update,
    remove,
}