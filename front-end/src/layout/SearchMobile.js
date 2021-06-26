import React, { useState } from "react";
import ErrorAlert from "./ErrorAlert";
import ReservationList from "../dashboard/ReservationList";
import { listReservations } from "../utils/api"

function SearchMobile(){
    const initialFormState = { mobile_number: "" }
    const [formState, setFormState] = useState({...initialFormState})
    const [reservations, setReservations] = useState([])
    const [reservationsError, setReservationsError] = useState(null)


    const updateForm = ({target}) => {
        setFormState({ mobile_number: target.value})
    }

    const submitHandle = (event) => {
        event.preventDefault()
        const abortController = new AbortController()
        setReservationsError(null)
        listReservations({...formState}, abortController.signal)
            .then(setReservations)
            .catch(setReservationsError)
        return () => abortController.abort()
    }
    
    return(
        <main>
            <form onSubmit={submitHandle}>
                <label htmlFor="mobile_number">Enter a customer's phone number</label>
                <input
                    name="mobile_number"
                    type="tel"
                    id ="mobile_number"
                    placeholder="(123)-456-7890"
                    value = {formState.mobile_number}
                    onChange={updateForm}
                    pattern="/\[0-9\/\.\(\)\-]/g"
                    required
                />
                <button type="submit" className="btn btn-primary">Find</button>
            </form>
            <ErrorAlert error={reservationsError} />
            {reservations.length ? <ReservationList reservations={reservations} /> : <p>No reservations found</p>}
        </main>
    )
}

export default SearchMobile