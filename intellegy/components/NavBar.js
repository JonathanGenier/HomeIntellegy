import React from 'react'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import Link from 'next/link'
import styles from '../styles/NavBar.module.css'
import axios from 'axios'
import { useRouter } from "next/router";

export default function nav( {LoggedIn} ) {

    const router = useRouter();

    const handleLogout = async () => {
        let URL = '/api/user/logout'
        const response = await axios.post(URL)
        
        // Retourne si on ne recoit pas un status 201
        if (response.status !== 200) {
            let error = "Database returned with status: " + status
            console.log(error)
            return console.log(error)
        }

        router.push("/");
    }

    if(LoggedIn == true){
        return (
            <Navbar sticky="top" className={styles.navbar}>
                <Navbar.Collapse>
                    <img src="../Images/intellegy.png" className={styles.logo} />
                    <Nav className={styles.nav}>
                        <Link href="/">
                            <a className={styles.link}>Home</a>
                        </Link>
                        <Link href="/user">
                            <a className={styles.link}>User</a>
                        </Link>
                        <Link href="">
                            <a className={styles.link} onClick={handleLogout}>Logout</a>
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
    else {
        return (
            <Navbar sticky="top" className={styles.navbar}>
                <Navbar.Collapse>
                    <img src="../Images/intellegy.png" className={styles.logo} />
                    <Nav className={styles.nav}>
                        <Link href="/">
                            <a className={styles.link}>Home</a>
                        </Link>
                        <Link href="/login">
                            <a className={styles.link}>Login</a>
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }

    
}
