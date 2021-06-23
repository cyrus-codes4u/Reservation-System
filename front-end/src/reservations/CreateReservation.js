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
    const history = useHistory()

    const updateForm = ({target}) => {
        setFormState({...formState, [target.name]: target.value})
    }
    const submitHandle = (event) => {
        event.preventDefault()
        createReservation(formState)
            .then(() => history.push(`/dashboard?date=${formState.reservation_date}`))
    }
    const cancelHandle = () => {
        history.goBack()
    }


    // const noTuesdays = (target) => { 
    //     const [year, month , day] = target.value.split("-")
        
    //     console.log(year, month, day)
    //     const date = new Date( year, month-1, day )
    //     if( date.getDay() === 2 ){
    //         setErrors( new Error("The restaurant is closed on Tuesdays. Please choose another date.")  )
    //     }
    //     if ( date < new Date()){
    //         setErrors( new Error("New reservations must be scheduled for a future date.")  )
    //     }else{
    //         setErrors(null)
    //     }
    // }
    
    // const openHours = (event) => {
    //     const [hour, minute] = event.target.value.split(":")
    //     if( parseInt(hour) > 21 || (parseInt(hour) >= 21 && parseInt(minute) >= 30) ){
    //         setError( (error) => error + "\nThe restaurant is closes at 10:30 PM. To allow adequate dining time we do not accept reservations for after 9:30 PM.")
    //     }
    //     if( parseInt(hour) < 10 || (parseInt(hour) <= 10 && parseInt(minute) <= 30) ){
    //         setError( (error) => error + "\nYour chosen reservation time is prior to restaurant opening. Please choose a time within opening hours." )
    //     } 
    //     else {
    //         updateForm(event)
    //     }
    // }
    // const errors = error.map((err, index) => { 
    //     return (<li key={`err_${index}`}><ErrorAlert  error = {err} /> </li> ) 
    // })

    return (
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
        
    )
}

export default CreateReservation