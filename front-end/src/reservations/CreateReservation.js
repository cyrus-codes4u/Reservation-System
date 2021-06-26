import React, { useState } from "react";
import { useHistory } from "react-router-dom"
import { createReservation } from "../utils/api"
import {today} from "../utils/date-time"
import ErrorAlert from "../layout/ErrorAlert";

function CreateReservation(){
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: today(),
        reservation_time: "",
        people: 0,
        status: "booked"
    }
    const [formState, setFormState] = useState({...initialFormState})
    const [validation, setValidation] = useState([])
    const history = useHistory()

    const updateForm = ({target}) => {
        setFormState({...formState, [target.name]: target.value})
    }
    const submitHandle = (event) => {
        event.preventDefault()
        setValidation([])
        noTuesdays()
        openHours()
        createReservation(formState)
            .then(() => history.push(`/dashboard?date=${formState.reservation_date}`))
            .catch(console.log)
    }
    const cancelHandle = () => {
        history.goBack()
    }

    const noTuesdays = () => { 
        const [year, month , day] = formState.reservation_date.split("-")
        const date = new Date( year, month-1, day )

        if( date.getDay() === 2 ){
            setValidation([...validation, "The restaurant is closed on Tuesdays. Please choose another date."])
        }
        if ( date < new Date()){
            setValidation([...validation, "New reservations must be scheduled for a future date."])
        }
    }
    
    const openHours = () => {
        const [hour, minute] = formState.reservation_time.split(":")
        if( parseInt(hour) > 21 || (parseInt(hour) >= 21 && parseInt(minute) >= 30) ){
            setValidation([...validation,"The restaurant is closes at 10:30 PM. To allow adequate dining time we do not accept reservations for after 9:30 PM."])
        }
        if( parseInt(hour) < 10 || (parseInt(hour) <= 10 && parseInt(minute) <= 30) ){
            setValidation([...validation,"Your chosen reservation time is prior to restaurant opening. Please choose a time within opening hours."])
        }
    }

    return (
        <main>
            <ErrorAlert error ={validation.length ? validation.join("\n"): null} />
            <form onSubmit={submitHandle}>
                <label htmlFor="first_name">First Name</label>
                <input 
                    name="first_name"
                    type="text"
                    id ="first_name"
                    value = {formState.first_name}
                    onChange={updateForm}
                    required
                    autoFocus
                    autoCapitalize="true"
                    autoComplete="true"
                />
                <label htmlFor="last_name">Last Name</label>
                <input 
                    name="last_name"
                    type="text"
                    id ="last_name"
                    value = {formState.last_name}
                    onChange={updateForm}
                    required
                    autoCapitalize="true"
                    autoComplete="true"
                />
                <label htmlFor="mobile_number">Mobile Phone</label>
                <input
                    name="mobile_number"
                    type="tel"
                    id ="mobile_number"
                    placeholder="(123)-456-7890"
                    value = {formState.mobile_number}
                    onChange={updateForm}
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    required
                    autoComplete="true"
                />
                <label htmlFor="reservation_date">Date</label>
                <input
                    name="reservation_date"
                    id ="reservation_date"
                    type = "date"
                    value = {formState.reservation_date}
                    onChange={updateForm}
                    min= {today()}
                    required
                />
                <label htmlFor="reservation_time">Time</label>
                <input
                    name="reservation_time"
                    id ="reservation_time"
                    type ="time"
                    value = {formState.reservation_time}
                    onChange={updateForm}
                    required
                />
                <label htmlFor="people">Party Size</label>
                <input
                    name="people"
                    id ="people"
                    type ="number"
                    min="1"
                    max="6"
                    value = {formState.people}
                    onChange={updateForm}
                    required
                />
                <button type="submit">Submit</button>
                <button type="button" onClick={cancelHandle}>Cancel</button>
            </form>
            {formState.reservation_date}
        </main>
    )
}

export default CreateReservation