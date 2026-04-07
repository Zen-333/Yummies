import "../styles/header.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBlender, faPlus } from "@fortawesome/free-solid-svg-icons";

function Header() {

  return (
    <> 
        <div className="header">
          <div className="header__inner">
            <div className="header__logo">
              <FontAwesomeIcon icon={faBlender} />Yummies
            </div>
            <div className="header__actions">
              <div>
                <button className="btn--primary btn"><FontAwesomeIcon icon={faPlus} /> Add Recipe</button>
              </div>
              <div>
                <button className="btn--secondary btn">Login</button>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default Header
