// ===================================================================================================
//  Fichier     :   Register.js
//  Programmeur :   Jonathan Genier    3/9/2021
//  Modifié par :   
//  Description :   Ce composant contient le formulaire d'enregistrement. Les utilisateurs utiliseront 
//                  ce formulaire pour se créer un compte utilisateur.
// ===================================================================================================

import { useState } from 'react'
import axios from 'axios'
import style from '../styles/login.module.css'

import styles from '../styles/register.module.css'
import countries from '../utils/countries.json'

export default function RegisterForm({ homeFunc }) {

    // Contient les informations entré par l'utilisateur.
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        email: '',
        dob: '',
        country: '',
        region: '',
        confirm: '',
        city: '',
        address: '',
        postalCode: '',
        regionType: '',
        year: '',
        month: '',
        day: ''
    })

    // Si l'une de ces variable est vrai, on affiche
    // un message d'erreur qui lui est assigné.
    const [warning, setWarning] = useState({
        bad_registration: false,
        username_empty: false,
        email_empty: false,
        email_format: false,
        password_empty: false,
        confirm_empty: false,
        confirm_match: false,
        country_empty: false,
        region_empty: false,
        dob_empty: false,
        dob_age: false
    })

    // Si l'une de ces variable est vrai, on affiche
    // un message qui lui est assigné.
    const [passwordPolicy, setPasswordPolicy] = useState({
        characters: true,
        uppercase: true,
        lowercase: true,
        number: true,
        symbol: true
    })

    // Appelé lorsqu'un input ou un select du form change de valeur
    const handleChange = e => {
        const { target } = e
        const { name, value } = target

        if (name === 'country' && value !== 'none') {
            let regionType = countries[value].regionType
            setForm({ ...form, [name]: value, regionType })
        } else {
            setForm({ ...form, [name]: value })
        }
    }

    // Envoie la soumission de la tentative de login au serveur.
    const handleSubmit = async e => {
        e.preventDefault()

        let username_empty = (form.username ? false : true)
        let email_empty = (form.email ? false : true)
        let password_empty = (form.password ? false : true)
        let confirm_empty = (form.confirm ? false : true)
        let country_empty = (form.country ? false : true)
        let region_empty = (form.region ? false : true)
        let dob_empty = (form.year && form.month && form.day ? false : true)
        let format = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        let email_format = ((email_empty ? false : !format.test(form.email)))
        let confirm_match = ((password_empty || confirm_empty ? false : form.password !== form.confirm))
        let dob_age = !validateAge()

        setWarning({ ...warning, username_empty, email_empty, email_format, password_empty, confirm_empty, confirm_match, country_empty, region_empty, dob_empty, dob_age })

        // Si tous les inputs sont valide, on procède à envoyer une requête vers le serveur.
        // Les inputs sont valides lorsqu'il on du contenu et que ce dernier est formatté correctement.
        if (username_empty || email_empty || password_empty || confirm_empty || validatePassword()
            || country_empty || region_empty || dob_empty || dob_age || email_format || confirm_match) {
            return
        }

        let data = {
            username: form.username,
            password: form.password,
            firstName: form.firstName, 
            lastName: form.lastName,
            email: form.email,
            dob: form.year + '-' + form.month + "-" + form.day + ' 00:00:00',
            country: form.country,
            region: form.region,
            city: form.city,
            address: form.address,
            postalCode: form.postalCode,
        }

        let path = '/api/user/registration'
        await axios.post(path, data).then(response => {

            if (response.status !== 201) {
                let error = "Request returned with status: " + status
                return console.log(error)
            }

            console.log(response.data.registered)
            
            if (!response.data.registered) {
                return setWarning({ ...warning, bad_registration: true })
            }

            
            homeFunc()
        }).catch(error => {
            console.log(error)
        })
    }

    // Vérifie le mot de passe entrée par l'utilisateur
    const validatePassword = e => {

        let value

        if (e) {
            value = e.target.value
        } else {
            value = form.password
        }

        let format = ''

        // Longueur
        let characters = (value.length >= 8 ? false : true)

        // Lettre majuscule
        format = /[A-Z]/
        let uppercase = (format.test(value) ? false : true)

        // Lettre minuscule
        format = /[a-z]/
        let lowercase = (format.test(value) ? false : true)

        // Chiffre
        format = /\d/
        let number = (format.test(value) ? false : true)

        // Symboles
        format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
        let symbol = (format.test(value) ? false : true)

        setPasswordPolicy({ characters, uppercase, lowercase, number, symbol })
        return characters && uppercase && lowercase && number && symbol
    }

    // Vérifie si l'utilisateur est majeur dans sa région (Province, État, etc)
    // Retourne faux si l'utilisateur est mineur; vrai si il est majeur.
    const validateAge = () => {
        if (form.region && form.year && form.month && form.day) {
            let legalAge = countries[form.country].regions[form.region].legalAge
            let today = new Date();
            let age = today.getFullYear() - form.year;

            if (today.getMonth() + 1 < form.month
                || (today.getMonth() + 1 == form.month && today.getDate() < form.day)) {
                age--;
            }

            if (age < legalAge) {
                return false
            }
        }

        return true
    }

    // Génère une liste de pays (provenant de utils/countries.json)
    const generateCountries = () => {
        let values = [];
        values.push(<option disabled hidden key='none' value='none'>Select your country</option>);
        values.push(Object.keys(countries).map(country => <option key={country} value={country}>{country}</option>))

        return values;
    }

    // Génère une liste des régions (Province ou état) dépendant du pays choisis
    const generateRegions = () => {
        let values = [];
        if (form.country) {
            values.push(<option disabled hidden key='none' value='none'>Select your {form.regionType.toLowerCase()}</option>);
            Object.keys(countries[form.country].regions).forEach(region => {
                values.push(<option key={region} value={region}>{region}</option>)
            })
        }

        return values;
    }

    // Génère une liste d'année (100 ans)
    const generateYears = () => {
        let range = new Date().getFullYear() - 100
        let years = [...Array(101).keys()];
        let values = [];
        values.push(<option disabled hidden key='none' value='none'>YYYY</option>)
        values.push(years.map(year => <option key={year + range} value={year + range}>{year + range}</option>))

        return values;
    }

    // Génère une liste des mois
    const generateMonths = () => {
        let values = [];
        var months = [...Array(12 + 1).keys()];
        months.shift()
        values.push(<option disabled hidden key='none' value='none'>MM</option>)
        values.push(months.map(month => <option key={month} value={month}>{month}</option>))

        return values;
    }

    // Génère une liste de jours dépendant du mois.
    const generateDays = () => {
        let range = 31;
        let month = form.month;
        let year = form.year;
        let values = [];

        // Mois de 30 jours
        if (month == 4 || month == 6 || month == 9 || month == 11) {
            range = 30
        }

        // Mois de février, on vérifie si c'est une année bisextile.
        else if (month == 2) {
            if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
                range = 29
            } else {
                range = 28
            }
        }

        // Mois de 31 jours
        else {
            range = 31
        }

        let days = [...Array(range + 1).keys()];
        days.shift()
        values.push(<option disabled hidden key='none' value='none'>DD</option>)
        values.push(days.map(day => <option key={day} value={day}>{day}</option>))

        return values;
    }

    // Affiche le select box des regions lorsqu'un
    // pays a été choisis par l'utilisateur.
    const renderRegion = () => {
        if (!form.country) {
            return (<></>)
        }

        return (
            <>
                <span className={"std-ft-lg ft-light"}>{form.regionType}</span>
                <select name='region' defaultValue='none' className={"form-i std-ft-md " + (renderCSS('region'))} onChange={handleChange}>
                    {generateRegions()}
                </select>
                {renderWarning('region_empty')}
            </>
        )
    }

    // Affiche les messages d'erreur lorsque
    // un entrée de donnée n'est pas valide.
    const renderWarning = (type) => {
        let warningStr = ''

        switch (type) {
            case 'bad_registration': (warning.bad_registration ? warningStr = "Not able to create account" : ''); break
            case 'username_empty': (warning.username_empty ? warningStr = "Type in your username" : ''); break
            case 'email_empty': (warning.email_empty ? warningStr = "Type in your email" : ''); break
            case 'email_format': (warning.email_format ? warningStr = "Type in a valid email" : ''); break
            case 'password_empty': (warning.password_empty ? warningStr = "Type in your password" : ''); break
            case 'confirm_empty': (warning.confirm_empty ? warningStr = "Confirm your password" : ''); break
            case 'confirm_match': (warning.confirm_match ? warningStr = "Passwords do not match" : ''); break
            case 'country_empty': (warning.country_empty ? warningStr = "Select your country" : ''); break
            case 'region_empty': (warning.region_empty ? warningStr = ("Select your " + form.regionType.toLowerCase()) : ''); break
            case 'dob_empty': (warning.dob_empty ? warningStr = "Select your date of birth" : ''); break
            case 'dob_age': (warning.dob_age ? warningStr = ("You must be of legal age in your " + form.regionType.toLowerCase()) : ''); break
            default: console.log("REGISTER: INVALID WARNING TYPE")
        }

        if (!warningStr) {
            return (<></>)
        }

        return (<span className={styles.warning + " std-ft-sm form-warning"}>{warningStr}</span>)
    }

    // Modifie le css des input box 
    // lorsqu'il y a un message d'erreur
    const renderCSS = type => {
        let renderWarning = false

        switch (type) {
            case 'username': renderWarning = (warning.username_empty || warning.bad_registration); break
            case 'email': renderWarning = (warning.email_empty || warning.email_format || warning.bad_registration); break
            case 'password': renderWarning = (warning.password_empty || warning.confirm_match); break
            case 'confirm': renderWarning = (warning.confirm_empty || warning.confirm_match); break
            case 'country': renderWarning = (warning.country_empty); break
            case 'region': renderWarning = (warning.region_empty); break
            case 'dob': renderWarning = (warning.dob_empty || warning.dob_age); break
            default: console.log("REGISTER: INVALID CSS WARNING TYPE");
        }

        if (renderWarning) {
            return style.formBw
        }

        return style.formBn
    }

    // Affiche les messages qui aide les utilisateurs 
    // à créer un mot de passe sécuritaire.
    const renderPasswordPolicy = (type) => {

        let policyStr = ''

        switch (type) {
            case 'characters': (passwordPolicy.characters ? policyStr = "- At least 8 characters" : ''); break
            case 'uppercase': (passwordPolicy.uppercase ? policyStr = "- 1 uppercase" : ''); break
            case 'lowercase': (passwordPolicy.lowercase ? policyStr = "- 1 lowercase" : ''); break
            case 'number': (passwordPolicy.number ? policyStr = "- 1 number" : ''); break
            case 'symbol': (passwordPolicy.symbol ? policyStr = "- 1 symbol" : ''); break
            default: console.log("REGISTER: INVALID PASSWORD POLICY TYPE")
        }

        if (policyStr) {
            return (<span className={"std-ft-sm form-warning"}>{policyStr}</span>)
        } else { return (<></>) }
    }

    return (
        <div className={styles.container + " std-ui-bg-clr std-borders"}>

            {/* Register Form */}
            <form className={styles.registerForm}>

                {/* Account */}
                <h4 className={"ft-light"}>Register</h4>
                <hr className={style.formHrTop} />
                {renderWarning('bad_registration')}

                {/* First Name */}
                <span className={"std-ft-lg ft-light"}>First Name</span>
                <input
                    type="text"
                    name='firstName'
                    className={styles.formI + " std-ft-md ft-light " + (renderCSS('firstName'))}
                    onBlur={handleChange}>
                </input>
                {renderWarning('firstName_empty')}

                {/* Last Name */}
                <span className={"std-ft-lg ft-light"}>Last Name</span>
                <input
                    type="text"
                    name='lastName'
                    className={styles.formI + " std-ft-md ft-light " + (renderCSS('lastName'))}
                    onBlur={handleChange}>
                </input>
                {renderWarning('lastName_empty')}

                {/* Username */}
                <span className={"std-ft-lg ft-light"}>Username</span>
                <input
                    type="text"
                    name='username'
                    className={styles.formI + " std-ft-md ft-light " + (renderCSS('username'))}
                    onBlur={handleChange}>
                </input>
                {renderWarning('username_empty')}

                {/* Email */}
                <span className={"std-ft-lg ft-light"}>Email</span>
                <input 
                    type="text" 
                    name='email' 
                    className={styles.formI + " std-ft-md ft-light " + (renderCSS('email'))} 
                    onBlur={handleChange}>
                </input>
                {renderWarning('email_empty')}
                {renderWarning('email_format')}

                {/* Password */}
                <span className={"std-ft-lg ft-light"}>Password</span>
                <input 
                    type="password" 
                    name='password' 
                    className={styles.formI + " std-ft-md ft-light " + (renderCSS('password'))} 
                    onChange={validatePassword} 
                    onBlur={handleChange}>
                </input>
                {renderWarning('password_empty')}

                {/* Password Policy */}
                <div className={styles.passwordPolicy}>
                    {renderPasswordPolicy('characters')}
                    {renderPasswordPolicy('uppercase')}
                    {renderPasswordPolicy('lowercase')}
                    {renderPasswordPolicy('number')}
                    {renderPasswordPolicy('symbol')}
                </div>

                {/* Confirm Password */}
                <span className={"std-ft-lg ft-light"}>Confirm Password</span>
                <input 
                    type="password" 
                    name="confirm" 
                    className={styles.formI + " std-ft-md ft-light " + (renderCSS('confirm'))} 
                    onBlur={handleChange}>
                </input>
                {renderWarning('confirm_empty')}
                {renderWarning('confirm_match')}

                {/* City */}
                <span className={"std-ft-lg ft-light"}>City</span>
                <input
                    type="text"
                    name='city'
                    className={styles.formI + " std-ft-md ft-light " + (renderCSS('city'))}
                    onBlur={handleChange}>
                </input>
                {renderWarning('city_empty')}

                {/* Address */}
                <span className={"std-ft-lg ft-light"}>Address</span>
                <input
                    type="text"
                    name='address'
                    className={styles.formI + " std-ft-md ft-light " + (renderCSS('address'))}
                    onBlur={handleChange}>
                </input>
                {renderWarning('address_empty')}

                {/* Postal code */}
                <span className={"std-ft-lg ft-light"}>Postal Code</span>
                <input
                    type="text"
                    name='postalCode'
                    className={styles.formI + " std-ft-md ft-light " + (renderCSS('postalCode'))}
                    onBlur={handleChange}>
                </input>
                {renderWarning('postalCode_empty')}

                {/* Country */}
                <span className={"std-ft-lg ft-light"}>Country</span>
                <select 
                    name='country' 
                    defaultValue='none' 
                    className={styles.formI + "std-ft-md ft-light" + (renderCSS('country'))} 
                    onChange={handleChange}>
                    {generateCountries()}
                </select>
                {renderWarning('country_empty')}

                {/* Region */}
                {renderRegion()}

                {/* Date of birth */}
                <span className={"std-ft-lg ft-light"}>Date of birth</span>
                <div className={styles.dobContainer}>
                    <select 
                        name='year' 
                        defaultValue='none' 
                        className={styles.formI + " form-i std-ft-md " + (renderCSS('dob'))} 
                        onChange={handleChange}>
                        {generateYears()}
                    </select>
                    <select 
                        name='month' 
                        defaultValue='none' 
                        className={styles.formI + " form-i std-ft-md " + (renderCSS('dob'))} 
                        onChange={handleChange}>
                        {generateMonths()}
                    </select>
                    <select 
                        name='day' 
                        defaultValue='none' 
                        className={styles.formI + " form-i std-ft-md " + (renderCSS('dob'))} 
                        onChange={handleChange}>
                        {generateDays()}
                    </select>
                </div>
                {renderWarning('dob_empty')}
                {renderWarning('dob_age')}

                {/* Submit button */}
                <hr className={"form-hr-top"} />
                <button type='submit' className={styles.formBtn + " form-btn std-ft-md"} onClick={handleSubmit}>Create account</button>
            </form>
        </div>
    )
}