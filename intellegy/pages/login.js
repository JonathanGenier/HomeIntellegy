import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import styles from '../styles/index.module.css'
import Login from '../components/Login'
import Register from '../components/Register'
import NavBar from '../components/NavBar'

export const getServerSideProps = async (context) => {
  let LoggedIn = false

  if (context.req?.cookies.auth) {
    if (context.req?.cookies.auth != "deleted") LoggedIn = true
  }

	return { props: {LoggedIn} }
}

export default function Index(props) {

  const [form, setForm] = useState({
    type: 'login'
  })

  const showRegister = () => {
    if (form.type !== 'register') {
      setForm({ type: 'register' })
    }
  }

  const showLogin = () => {
    if (form.type !== 'login') {
      setForm({ type: 'login' })
    }
  }

  const renderForm = () => {
    switch (form.type) {
      case 'login': return (<Login props={props} registerFunc={showRegister} />)
      case 'register': return (<Register homeFunc={showLogin}/>)
      default: return (<></>)
    }
  }

  return (
    <>
      <NavBar LoggedIn={props.LoggedIn}/>
      <div className={styles.container}>
        <Head>
          <title>Intellegy - Login</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* Forms */}
        <div className={styles.bottom}>
          {renderForm()}
        </div>
      </div>
    </>
  )
}
