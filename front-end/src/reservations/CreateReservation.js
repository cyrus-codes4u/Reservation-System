import React, { useState } from "react";
import { useHistory } from "react-router-dom"
import {createReservation} from "../../e2e/api"
import {today} from "../utils/date-time"

function CreateReservation(){
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: today(),
        reservation_time: "",
        people: 0,
    }
    const [formState, setFormState] = useState({...initialFormState})
    const history = useHistory()

    const updateForm = ({target}) => {
        setFormState({...formState, [target.name]: target.value})
    }
    const submitHandle = (event) => {
        event.preventDefault()
        createReservation(formState)
            .then(() => history.push("/dashboard"))
        
    }
    const cancelHandle = () => {
        history.goBack()
    }
    
    return (
        <form onSubmit={submitHandle}>
            <label for="first_name">First Name</label>
            <input 
                name="first_name"
                type="text"
                id ="first_name"
                value = {formState.first_name}
                onChange={updateForm}
                required
                autoFocus
                autoCapitalize
                autoComplete
            />
            <label for="last_name">Last Name</label>
            <input 
                name="last_name"
                type="text"
                id ="last_name"
                value = {formState.last_name}
                onChange={updateForm}
                required
                autoCapitalize
                autoComplete
            />
            <label for="mobile_number">Mobile Phone</label>
            <input
                name="mobile_number"
                type="tel"
                id ="mobile_number"
                placeholder="(123)-456-7890"
                value = {formState.mobile_number}
                onChange={updateForm}
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                required
                autoComplete
            />
            <label for="reservation_date">First Name</label>
            <input
                name="reservation_date"
                id ="reservation_date"
                type = "date"
                value = {formState.reservation_date}
                onChange={updateForm}
                required
            />
            <label for="reservation_time">First Name</label>
            <input
                name="reservation_time"
                id ="reservation_time"
                type ="time"
                value = {formState.reservation_time}
                onChange={updateForm}
                required
            />
            <input
                name="people"
                id ="people"
                type ="number"
                min="1"
                maz="6"
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