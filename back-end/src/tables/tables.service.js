const knex = require("../db/connection")
//lists all table entries in the tables table
function list(){
    return knex("tables")
        .select("*")
        .orderBy("table_name")
}

//Returns the table entry with the matching table_id
function read(id){
    return knex("tables")
        .select("*")
        .where({table_id: id})
        .first()
}

//Creates a new table entry in the tables table in the database
function create(newTable){
    return knex("tables")
        .insert(newTable)
        .returning(["table_name", "capacity", "table_id"])
}

//Updates the reservation_id property of a table and seats a reservation
function update(id, updates){
    return knex.transaction ( (trx) => {
        return knex("reservations")
            .transacting(trx)
            .where({reservation_id: updates.reservation_id}) // the reservation status is updated to seated
            .update({status: "seated" })
            .then(() => {
                //then the reservation_id property of the table is updated to matched the seated reservation
                return knex("tables")
                    .where({table_id: id})
                    .update(updates) 
                    .returning(["table_name", "table_id", "capacity", "reservation_id"])                    
            })
    })
}

//Removes link between a reservation and a table as the reservation finishes
function remove(id){
    return knex.transaction( async (trx) => {
        //table where the reservation is seated
        const table = await knex("tables").where({table_id: id}).first()
        
        return knex("reservations")            
            .transacting(trx)
            .where({reservation_id: table.reservation_id })
            .update({status: "finished" }) // associated reservation status updated to finished
            .then(() => {
                // then the table is cleared -- has no associated reservation_id
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