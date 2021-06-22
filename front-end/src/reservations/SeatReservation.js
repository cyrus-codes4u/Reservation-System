import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, readReservation, seatReservation } from "../utils/api"

function SeatReservation({reservation_id}){
    const history = useHistory()
    const [formState, setFormState] = useState({table_id: null})
    
    const [reservation, setReservation] = useState()
    const [reservationError, setReservationError] = useState(null);
    const [tables,setTables] = useState([])
    const [tablesError, setTablesError] = useState(null);
    
    useEffect(loadReservation, [reservation_id])

    function loadReservation() {
        const abortController = new AbortController()
        setReservationError(null)
        readReservation( reservation_id, abortController.signal)
          .then(setReservation)
          .catch(setReservationError)
        return () => abortController.abort()
    }

    useEffect(loadTables, [])

    function loadTables(){
        const abortController = new AbortController()
        listTables(abortController.signal)
            .then(setTables)
            .catch(setTablesError)
        return () => abortController.abort()
    }

    const updateForm = ({target}) => {
        setFormState(target.value)
    }
    const handleCancel= () =>{
        history.goBack()
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        seatReservation(reservation_id, formState)
            .then(()=> history.push("/dashboard"))
    }
    if(!reservation){return null}

    const listOfTableOptions = tables.map((table) => {
        if(table.capacity < reservation.people) {return null}
        return (
            <option key={`table_${table.table_id}`} value={`${table.table_id}`}>{table.table_name} - {table.capacity}</option>
        )
    })

    return  (
        <React.Fragment>
            <ErrorAlert error={reservationError} />
            <ErrorAlert error={tablesError} />
            <h2>{reservation ? reservation.first_name : null}'s reservation for {reservation.people}</h2>
            <h4>Select a table:</h4>
            <form onSubmit={handleSubmit}>
                <select name = "table_id" onChange={updateForm} required >
                    {listOfTableOptions}
                </select>
                <button type="submit">Submit</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
            </form>
        </React.Fragment>
        
        
    )
}

export default SeatReservation