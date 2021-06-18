const knex = require("../db/connection")

function list(date){
    return knex
        .from("reservations")
        .select("first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people", "reservation_id", "status")
        .whereNot({status: "finished"})
        .andWhere({reservation_date : date})
        .orderBy("reservation_time")
}

function read(id){
    return knex("reservations")
        .select("first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people", "reservation_id", "status")
        .where({reservation_id: id})
        .first()
}

function create(reservation){
    return knex("reservations")
        .insert(reservation)
        .returning(["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people", "reservation_id", "status"])
}

function update(id, updates){
    return knex("reservations")
        .where({reservation_id: id})
        .update(updates)
        .returning(["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people", "reservation_id", "status"])
        .then((results) => results[0] )
}

module.exports ={
    list,
    read,
    create,
    update
}