import Head from 'next/head'
import styles from '../styles/index.module.css'
import NavBar from '../components/NavBar'
import {Carousel} from 'react-bootstrap'
import jwt_decode from 'jwt-decode'

export const getServerSideProps = async (context) => {
  let LoggedIn = false

  if (context.req?.cookies.auth) {
    if (context.req?.cookies.auth != "deleted") LoggedIn = true
  }

	return { props: {LoggedIn} }
}

export default function Index(props) {

  return (
    <>
    <NavBar LoggedIn={props.LoggedIn}/>
    <div className={styles.container}>
      <Head>
          <title>Intellegy - Home</title>
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <Carousel className={styles.carousel} fade>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../images/Image1.png?text=First slide&bg=373940"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>Stay connected everywhere!</h3>
            <p>With our platform you can connect and control your smart devices from anywhere.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../images/Image2.png?text=Second slide&bg=282c34"
            alt="Second slide"
          />

          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../images/slide3.jpg?text=Third slide&bg=20232a"
            alt="Third slide"
          />

          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
    </>
  )
}
