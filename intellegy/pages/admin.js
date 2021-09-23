import { clientAuthorization } from '../modules/authorization';
import { Component, useEffect, useState } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import styles from '../styles/Admin.module.css'

// TODO: On devra vérifier si l'utilisateur est ADMIN ou TECHNICIEN
export const getServerSideProps = async (context) => {
    clientAuthorization(context)
    return { props: {} }
}

// Permet d'ajouter, de configurer et d'enregistrer les hubs à la base de donnée. Ceci sera fait
// par un employé (techniciens) et ce sera fait avant qu'un hub soit vendu à un client.
// Lorsqu'un hub tentera de se connecter au serveur web, il devra s'authentifier avec son 
// Serial Number et son mot de passe. Finalement le mot de passe de ce hub pourra être changer
// par le propriétaire du hub. 
export default function Admin(props) {

    const [data, setData] = useState({
        serial_number: '',
        password: '',
    })

    const [state, setState] = useState({
        message: '',
    })

    const generate = e => {
        let serial_number = uuidv4()
        let password = uuidv4()

        setData({ ...data, serial_number, password })
        setState({ ...state, message: '' })
    }

    const createDevice = async e => {
        let url = "/api/device/registration"

        const response = await axios.post(url)

        if (response.status !== 201) {
            let message = "Database returned with status: " + status
            return setState({ ...state, message })
        }

        if (!response.data.registered) {
            return setState({ ...state, message: "Device creation or bind failed" })
        }

        return setState({ ...state, message: "Device created & binded" })
        
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const url = '/api/hub/registration'

        axios.post(url, data).then(response => {
            if (response.status !== 201) {
                let message = "Database returned with status: " + status
                return setState({ ...state, message })
            }

            if (response.data.registered) {
                return setState({ ...state, message: "Registration successfull" })
            }

            return setState({ ...state, message: "Registration failed" })
        }).catch(error => {
            let message = "Hub registration error: " + error
            return setState({ ...state, message })
        })
    }

    return (
        <div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.label}>Serial Number :</label>
                <label>{data.serial_number}</label>
                <label className={styles.label}>Password :</label>
                <label>{data.password}</label>
                <button type="button" className={styles.button} onClick={generate}>Generate Credentials</button>
                <button type="submit" className={styles.button}>Add hub</button>
            </form>
            <button onClick={createDevice}>Create Device</button>
            <label>{state.message}</label>
        </div>
    );

}
