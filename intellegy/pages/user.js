import Head from "next/head";
import styles from "../styles/user.module.css";
import { useState } from 'react'
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useRouter } from "next/router";
import { clientAuthorization } from '../modules/authorization'
import NavBar from '../components/NavBar'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

export const getServerSideProps = async (context) => {
	clientAuthorization(context)

	const cookie = context.req?.headers.cookie
	let URL = "http://localhost:8000/api/user/hubs"
	let hubs = []

	const response = await axios.get(URL , {
		headers: { cookie }
	})

	if (response.status !== 200) {
		let error = "API returned with status: " + status
		console.log(error)
	}

	let user = jwt_decode(context.req?.cookies.auth)
	console.log("User", user)
	hubs = response.data.hubs

	return { props: {hubs, user} }
}

export default function User(props) {
	const router = useRouter();
	const {hubs} = props
	const {user} = props.user

	console.log(user)
	const gotoHub = hub => { 
		router.push({
			pathname: "/hub",
			query: hub
		});
	};

	const [newHub, setNewHub] = useState({
		name: '',
		serial_number: '',
		password: ''
	})

	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [showAlert, setShowAlert] = useState(false);
	const [alertVariant, setAlertVariant] = useState("danger")
	const [alertMessage, setAlertMessage] = useState("Temporary alert information for testing purposes.")
	

	const handleSubmit = async e => {
		e.preventDefault()

		if (!newHub.serial_number) {
			return console.log("serial_number is empty")
		}

		if (!newHub.password) {
			return console.log("password is empty")
		}

		const URL = '/api/hub/bindUser'

		

        axios.post(URL, newHub).then(response => {

			setShowAlert(true)

            if (response.status !== 200) {
				setAlertVariant("danger")
				setAlertMessage("An error occured while adding the hub to your account! Error Code: " + response.status)
                console.log("Database returned with status: ", status)
            }

			else if (!response.data.success) {
				setAlertVariant("danger")
				setAlertMessage("An error occured while adding the hub to your account! Error Code: " + response.status)
				console.log(response.data.message)
			}
			
			else {
				setAlertVariant("success")
				setAlertMessage("The hub was added successfully to the your account!")
			}

			handleClose()
        }).catch(error => {
            console.log(error)
        })
		}
		

	const handleChange = e => {
		const { target } = e
        const { name, value } = target

        setNewHub({ ...newHub, [name]: value })
	}

	const hubList = () => {
		return hubs === undefined
			? "no hubs"
			: hubs.map((hub) => {
				return (
					<tr onClick={() => {gotoHub(hub[0])}}>
						<td>{hub[0].name}</td>
					</tr>
				);
			});
	};

	return (
		<>
			<NavBar LoggedIn={true}/>
			<div className={styles.container}>
				<Head>
					<title>Intellegy - User</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Alert variant={alertVariant} className={styles.alert} show={showAlert} onClose={() => setShowAlert(false)} dismissible>
					{alertMessage}
				</Alert>
				<div className={styles.hubList}>
					<table className={styles.tableList}>
						<tr>
							<th>Hub List</th>
						</tr>
						{hubList()}
					</table>
					<button className={styles.addBtn} onClick={handleShow}>+</button>
				</div>
				<div className={styles.hubSettings}>
					<h2>User settings</h2>
					<div className={styles.settingsForm}>
						<label>Customer Name:</label>
						<span>{user.firstName} {user.lastName}</span>
						<br/>

						<label>Billing Address:</label>
						<span>{user.address}, {user.city}, {user.postalCode}, {user.region}, {user.country}</span>
						<br/>
					</div>
				</div>
			</div>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Add a new hub device!</Modal.Title>
				</Modal.Header>
				<Form onSubmit={handleSubmit}>
					<Modal.Body>
						<Form.Group controlId="formBasicName">
							<Form.Label>Hub Name</Form.Label>
							<Form.Control type="name" name="name" placeholder="Enter Name. ex: 580 Oaf Lane" onChange={handleChange}/>
							<Form.Text className="text-muted">This can be what ever you want.</Form.Text>
						</Form.Group>

						<Form.Group controlId="formBasicSerial">
							<Form.Label>Serial Number</Form.Label>
							<Form.Control type="name" name="serial_number" placeholder="Enter Serial Numer"  onChange={handleChange} />
							<Form.Text className="text-muted">This number can be found at the back of your hub device.</Form.Text>
						</Form.Group>

						<Form.Group controlId="formBasicIp">
							<Form.Label>Hub Password</Form.Label>
							<Form.Control type="ip" name="password" placeholder="Enter your hub password" onChange={handleChange} />
							<Form.Text className="text-muted">The password can be found at the back of your hub device.</Form.Text>
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>Close</Button>
						<Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
}
