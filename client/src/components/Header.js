import React from "react"
import { Link} from "react-router-dom"
import logo from "./../assets/logo.svg"

const Header = () => (
    <>
    <nav>
        <div className="logo">
            <Link to="/"><img src={logo} alt="Logo"/></Link>
        </div>
        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/browse">Browse</Link>
            </li>
            <li>
                <Link to="/create">Create</Link>
            </li>
            <li>
                <Link to="/track">Track</Link>
            </li>
        </ul>
    </nav>
    </>
)

export default Header