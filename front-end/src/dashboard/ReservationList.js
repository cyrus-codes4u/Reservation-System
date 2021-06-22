import React from "react";
import { Link } from "react-router-dom";
import { formatAsTime } from "../utils/date-time";


function ReservationList({reservations}){
    if(!reservations) {return null}
    const listOfReservations = reservations.map((reserve, index) => {
        return (
          <li key= {`id_${index}`} > 
            <p>Name: {reserve.last_name}, {reserve.first_name} </p>
            <p>Date: {reserve.reservation_date}</p>
            <p>Time: {formatAsTime(reserve.reservation_time)} </p>
            <p>Party of {reserve.people}</p>
            <Link className="btn btn-primary" to={`/reservations/${reserve.reservation_id}/seat`}>Seat</Link>
          </li>
        )
      })

    return(
        <ol>
            {listOfReservations}
        </ol>
    )
}

export default ReservationList