import "../styles/header.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBlender, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext"

interface HeaderProps { onAddClick: () => void; }

function Header({onAddClick}: HeaderProps) {
  const {user, signInWithGoogle, signOut} = useAuth()

  return (
    <> 
        <div className="header">
          <div className="header__inner">
            <div className="header__logo">
              <FontAwesomeIcon icon={faBlender} />Yummies
            </div>
            <div className="header__actions">
                    {user && (
                        <button className="btn--primary btn" onClick={onAddClick}>
                            <FontAwesomeIcon icon={faPlus} /> Add Recipe
                        </button>
                    )}
                    {user ? (
                        <button className="btn--secondary btn" onClick={signOut}>
                            Sign Out
                        </button>
                    ) : (
                        <button className="btn--secondary btn" onClick={signInWithGoogle}>
                            Login with Google
                        </button>
                    )}
                </div>
          </div>
        </div>
    </>
  )
}

export default Header
