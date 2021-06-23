import React from "react";
import { Link } from "react-router-dom";
import { formatAsTime } from "../utils/date-time";


function ReservationList({reservations}){
    if(!reservations) {return null}
    const listOfReservations = reservations.map((reservation, index) => {
      if(reservation.status === "finished") { return null }
      return (
        <li key= {`id_${index}`} > 
          <p>Name: {reservation.last_name}, {reservation.first_name} </p>
          <p>Date: {reservation.reservation_date}</p>
          <p>Time: {formatAsTime(reservation.reservation_time)} </p>
          <p>Party of {reservation.people}</p>
          <p data-reservation-id-status={reservation.reservation_id}>Status: {reservation.status} </p>
          {reservation.status==="booked" ? 
            <Link className="btn btn-primary" to={`/reservations/${reservation.reservation_id}/seat`}>Seat</Link>
            : null }
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