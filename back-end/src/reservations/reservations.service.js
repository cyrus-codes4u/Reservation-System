const knex = require("../db/connection")

function list(date){
        return knex
            .from("reservations")
            .select("*")
            .where({reservation_date : date})
            .orderBy("reservation_time")
}

function read(id){
    return knex("reservations")
        .select("first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people", "reservation_id")
        .where({reservation_id: id})
        .first()
}

function create(reservation){
    return knex("reservations")
        .insert(reservation)
        .returning(["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"])
}

module.exports ={
    list,
    read,
    create,
}