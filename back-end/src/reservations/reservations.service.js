const knex = require("../db/connection")

function list (){
    return knex("reservations")
        .select("first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people" )
        .orderBy("reservation_time")
        // .then((results) => {
        //     if(date){
        //         return results.filter((result) => result.date === date)
        //     }
        //     return results
        // })
}
function read(id){
    return knex("reservations")
        .select("first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people" )
        .where({reservation_id: id})
}


module.exports ={
    list,
    read
}