import React from 'react'
import { Link } from 'react-router-dom'
import styles from './navbar.module.css'

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <ul className={styles.links}>
                <li className={styles.linksElt}>
                    <Link to="/">Home</Link>
                </li>
                <li className={styles.linksElt}>
                    <Link to ="/remind-dues">Exchequer</Link>
                </li>
                <li className={styles.linksElt}>
                    <Link to = "/study-carrels">Academics</Link>
                </li>
                <li className={styles.linksElt}>
                    <Link to='/budget-tracker'>Live Budget Tracker</Link>
                </li>
            </ul>
        </nav>
    )
}
export default Navbar