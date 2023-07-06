import { NavLink } from "react-router-dom"
import './header.scss'
const Header = () => {
    return (
        <header className="header">
            <div className="title">
                <span className="part_first">Stop to Remember <span className="part_Second">your Ongoing Thoughts</span></span>                
            </div>
            <nav className="navbar">
                <ul className="btn_row">
                    <li>
                        <NavLink activeClassName="active"  to="/voice-recorder" className="btn_nav_links">Voice Record</NavLink>
                    </li>
                    <li>
                        <NavLink  activeClassName="active" to="/voice-list" className="btn_nav_links">Voice List</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header