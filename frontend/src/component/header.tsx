import "../styles/header.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Change this line:
import { faBlender } from "@fortawesome/free-solid-svg-icons";

function Header() {

  return (
    <> 
        <div className="header">
          <div className="container">
            <div className="logo">
              <FontAwesomeIcon icon={faBlender} />Yummies
            </div>
            <div className="buttons">
              <div className="addRecipe">
                <button className="addRecipe-btn">+ Add Recipe</button>
              </div>
              <div className="login">
                <button className="login-btn">Login</button>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default Header
