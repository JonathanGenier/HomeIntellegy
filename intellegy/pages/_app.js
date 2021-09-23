import '../styles/globals.css'
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }) {
  const [socket, setSocket] = useState(false);

  const updateSocket = newSocket => {
    setSocket(newSocket)
  }

  return <>
    <Component {...pageProps} socket={socket} updateSocket={updateSocket} />
  </>
}

export default MyApp
