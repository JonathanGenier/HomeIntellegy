import Head from 'next/head';
import styles from '../styles/Hub.module.css';
import { Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Switch from "react-switch";
import { useRouter } from "next/router";
import {clientAuthorization} from '../modules/authorization'
import NavBar from '../components/NavBar'
import axios from 'axios';

export const getServerSideProps = async (context) => {
    clientAuthorization(context)
    
    let hub = context.req.query
    let URL = "http://localhost:8000/api/device/retrieve"
    let devices = []

    if (hub.id_list_devices != undefined) {
        console.log(hub.id_list_devices)
        let response = await axios.post(URL, {devicesId: hub.id_list_devices})

        if (response.status !== 200) {
            let error = "API returned with status: " + status
            console.log(error)
        }

        if (!response.data.devices){
            console.log("No devices was found in the database.")
        }

        devices = response.data.devices
    }
    
    return { props: {hub, devices} }
  }

export default function Hub (props) {
    const {hub} = props
    const {devices} = props

    console.log(devices)
    const router = useRouter();
    const [renderState, setState] = useState('devices')

    let deviceTab_class = renderState == 'devices' ? styles.tab_active : styles.tab; //change tabs
    let groupsTab_class = renderState == 'groups' ? styles.tab_active : styles.tab; //change tabs

    var groups = devices.reduce(function (groups, device) {
        (groups[device.groupid] = groups[device.groupid] || []).push(device);
        return groups;
    }, {})

    const goBack = () => {
        router.push("/user");
    };

    const DeviceList = () => {
        if (devices.length == 0){
            return (
                <Card className={styles.card}>
                    <Card.Body>
                        <Card.Text>
                            no devices founds, please connect a device to your hub!
                    </Card.Text>
                    </Card.Body>
                </Card>
            )
        }
        return devices === undefined ? console.log("An error occured while loading the devices!") : devices.map(device => {
            return (
                <Card className={styles.card}>
                    <Card.Body>
                        <Card.Title>{device[0].name}</Card.Title>
                        <Card.Text>
                            add some info here
                    </Card.Text>
                        <Switch onChange={() => switchDevice(device.id)} checked={device.state} />
                    </Card.Body>
                </Card>
            )
        })
    }

    const GroupList = () => {
        return (
            <Card className={styles.card}>
                <Card.Body>
                    <Card.Text>
                        No device group was found. Once one has been created you will be able to find it here!
                </Card.Text>
                </Card.Body>
            </Card>
            )
    }

    function switchDevice(deviceid) {
        devices.find(({ id }) => id === deviceid).state = devices.find(({ id }) => id === deviceid).state ? false : true; //Toggle le state du device
    }

    function renderTabs() {
        if (renderState == "devices")
            return (
                <>
                    <div className={styles.cardContainer}>
                        <DeviceList />
                    </div>
                </>
            )
        else
            return (
                <div className={styles.cardContainer}>
                    <GroupList />
                </div>
            )
    }

    return (
        <div>
            <Head>
                <title>Intellegy - Hub</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavBar LoggedIn={true}/>
            <div className={styles.backBtn} onClick={goBack}>
                {"< Back"}
            </div>
            <h2 className={styles.title}>{hub.name}</h2>
            <div className={styles.tabs}>
                <button className={deviceTab_class} onClick={() => setState("devices")}>Devices</button>
                <button className={groupsTab_class} onClick={() => setState("groups")}>Groups</button>
            </div>
            {renderTabs()}
        </div>
    )
}