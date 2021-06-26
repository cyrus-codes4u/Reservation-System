import React, { useState } from "react";
import { useHistory } from "react-router-dom"
import { createTable } from "../utils/api"

function CreateTable(){
    const initialFormState = {
        table_name: "",
        capacity: 1,
    }
    const [formState,setFormState] = useState({...initialFormState})
    const history = useHistory()


    const updateForm = ({target}) => {
        setFormState({...formState, [target.name]: target.value})
    }

    const submitHandle = (event) => {
        event.preventDefault()
        createTable(formState)
            .then(() => history.push("/dashboard"))
    }
    const cancelHandle = () => {
        history.goBack()
    }
    
    return (
        <main>
            <form onSubmit={submitHandle}>
                <label htmlFor="table_name">Table Name</label>
                <input 
                    name="table_name"
                    type="text"
                    id ="table_name"
                    value = {formState.table_name}
                    onChange={updateForm}
                    required
                    autoFocus
                    autoCapitalize="true"
                />
                <label htmlFor="capacity">Capacity</label>
                <input 
                    name="capacity"
                    type="number"
                    id ="capacity"
                    value = {formState.capacity}
                    onChange={updateForm}
                    min="1"
                    required
                />
                <button type="submit">Submit</button>
                <button type="button" onClick={cancelHandle}>Cancel</button>
            </form>
        </main>
    )
}

export default CreateTable