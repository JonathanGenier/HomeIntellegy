// ===================================================================================================
//  Fichier     :   Login.js
//  Programmeur :   Jonathan Genier    3/9/2021
//  Modifié par :   
//  Description :   Ce composant contient le formulaire de connexion. Les utilisateurs utiliseront 
//                  ce formulaire pour s'authentifier.
// ===================================================================================================

import { Component, useEffect, useState } from 'react'
import react from 'react'
import axios from 'axios'
import router from 'next/router'
import { io } from 'socket.io-client'

import styles from '../styles/login.module.css'
import config from '../utils/config.json'

export default function LoginForm({ props, registerFunc }) {

    // Contient les informations entré par l'utilisateur.
    const [form, setForm] = useState({
        username: '',
        password: '',
    })

    // Si l'une de ces variable est vrai, on affiche
    // un message d'erreur qui lui est assigné.
    const [warning, setWarning] = useState({
        credentials: false,
        username: false,
        password: false
    })

    // Appelé lorsqu'un input ou un select du form change de valeur
    const handleChange = e => {
        const { target } = e
        const { name, value } = target

        setForm({ ...form, [name]: value })
    }

    // Envoie la soumission de la tentative de login au serveur.
    const handleSubmit = async e => {
        e.preventDefault()

        let credentials = false
        let username = (!form.username ? true : false)
        let password = (!form.password ? true : false)
        setWarning({ ...warning, credentials, username, password })

        // Si aucun des inputs est vide on procède à envoyer les données
        // au serveur. Si le compte existe dans la base de donnée, l'utilisateur
        // sera rediriger vers la page Lobby.
        if (username || password) {
            return console.log("Username or password is empty")
        }

        // TODO:  Encryption du mot de passe
        const url = '/api/user/authentication'

        axios.post(url, form).then(response => {

            if (response.status !== 200) {
                return console.log("Database returned with status: ", status)
            }

            let id = response.data.id

            // Invalid Credentials
            if (id === -1) {
                return setWarning({ ...warning, credentials: true })
            }

            // Création d'un socket
            let socket = io(config.wsAddress, { auth: { entityType: "user", entityId: id } })

            // On attend la confirmation du serveur. Si tous les informations
            // sont valide, on peut assigner un socket à ce client.
            socket.on('conn-confirmation', data => {
                console.log(data)
                props.updateSocket(socket)
                socket.emit('conn-confirmation', "\x1b[32mUser " + id + " is now connected to the server.\x1b[0m")
                router.push('/user')
            })
        }).catch(error => {
            console.log(error)
        })
    }

    // Affiche les messages d'erreur lorsque
    // un entrée de donnée n'est pas valide.
    const renderWarning = (type) => {

        let warningStr = ''

        switch (type) {
            case 'credentials': (warning.credentials ? warningStr = "Invalid credentials" : ''); break
            case 'username': (warning.username ? warningStr = "Type in your username" : ''); break
            case 'password': (warning.password ? warningStr = "Type in your password" : ''); break
            default: console.log("LOGIN: INVALID WARNING TYPE"); break;
        }

        if (warningStr) {
            return (<span className={styles.formWarning + " std-ft-sm"}>{warningStr}</span>)
        } else { return (<></>) }
    }

    // Modifie le css des input box 
    // lorsqu'il y a un message d'erreur
    const renderCSS = type => {
        let renderWarning = false

        switch (type) {
            case 'username': renderWarning = (warning.username || warning.credentials); break
            case 'password': renderWarning = (warning.password || warning.credentials); break
            default: console.log("REGISTER: INVALID CSS WARNING TYPE");
        }

        if (renderWarning) {
            return styles.formBw
        }

        return styles.formBn
    }

    return (
        <div className={styles.container + " std-ui-bg-clr std-borders"}>

            {/* Login Form */}
            <form className={styles.loginForm} onSubmit={handleSubmit} method='POST'>
                <h4 className={"ft-light"}>Sign in</h4>
                <hr className={styles.formHrBot} />
                {renderWarning('credentials')}

                {/* Username */}
                <span className={"std-ft-lg ft-light"}>Username</span>
                <input 
                    type="text" 
                    name='username' 
                    className={styles.formI + " std-ft-md " + (renderCSS('username'))} 
                    onBlur={handleChange}>
                </input>
                {renderWarning('username')}

                {/* Password */}
                <span className={"std-ft-lg ft-light"}>Password</span>
                <input 
                    type="password" 
                    name='password' 
                    className={styles.formI + " std-ft-md " + (renderCSS('password'))} 
                    onBlur={handleChange}>
                </input>
                {renderWarning('password')}
                <span href="" className={"ft-light link"}>Forgot password?</span>

                <button type='submit' className={styles.formBtn + " std-ft-md"} >Login</button>
            </form>

            {/* Register */}
            <div className={styles.registerBox}>
                <h4 className={"ft-light"}>Not a member?</h4>
                <hr className={styles.formHrBot} />

                <button className={styles.formBtn + " std-ft-md"} onClick={registerFunc}>Register</button>
            </div>
        </div>
    )
}
