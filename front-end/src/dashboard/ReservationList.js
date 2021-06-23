import React from "react";
import { formatAsTime } from "../utils/date-time";


function ReservationList({reservations}){
    if(!reservations) {return null}
    const listOfReservations = reservations.map((reservation, index) => {
      return (
        <li key= {`id_${index}`} > 
          <p>Name: {reservation.last_name}, {reservation.first_name} </p>
          <p>Date: {reservation.reservation_date}</p>
          <p>Time: {formatAsTime(reservation.reservation_time)} </p>
          <p>Party of {reservation.people}</p>
          <p data-reservation-id-status={reservation.reservation_id}>Status: {reservation.status}</p>
          {reservation.status==="booked" ? 
            <a className="btn btn-primary" href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a>
            : null }
          <a className="btn btn-secondary" href={`/reservations/${reservation.reservation_id}/edit`}>Edit</a>
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