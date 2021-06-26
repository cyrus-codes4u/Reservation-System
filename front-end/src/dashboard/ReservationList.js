import React from "react";
import { formatAsTime, formatAsDate } from "../utils/date-time";
import { updateReservationStatus } from "../utils/api";


function ReservationList({reservations}){
    if(!reservations) {return null}
    const listOfReservations = reservations.map((reservation, index) => {
      const cancelHandle = (id) => {
        const response = window.confirm("Are you sure you want to cancel this reservation?\nThis action cannot be undone.")
        if(response){
          updateReservationStatus(id, "cancelled")
        }
      }

      if (reservation.status === "cancelled" || reservation.status === "finished") { return null}
      return (
        <li key= {`id_${index}`} > 
          <p>Name: {reservation.last_name}, {reservation.first_name} </p>
          <p>Date: {formatAsDate(reservation.reservation_date)}</p>
          <p>Time: {formatAsTime(reservation.reservation_time)} </p>
          <p>Party of {reservation.people}</p>
          <p data-reservation-id-status={reservation.reservation_id}>Status: {reservation.status}</p>
          
          {reservation.status==="booked" ? 
            <React.Fragment>
              <a className="btn btn-primary" href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a>
              <a className="btn btn-secondary" href={`/reservations/${reservation.reservation_id}/edit`}>Edit</a>
            </React.Fragment>
            : null }
  
          <button className="btn btn-danger" onClick={() => cancelHandle(reservation.reservation_id)}>Cancel</button>
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