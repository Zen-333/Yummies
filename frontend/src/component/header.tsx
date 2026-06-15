import "../styles/header.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBlender, faPlus, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext"

interface HeaderProps { onAddClick: () => void; onShowLogin: () => void; onEditProfile: () => void }

function Header({ onAddClick, onShowLogin, onEditProfile }: HeaderProps) {
    const { user, profile } = useAuth()
    const avatarUrl = profile?.avatar_url ?? null

  return (
    <> 
        <div className="header">
          <div className="header__inner">
            <div className="header__logo">
              <FontAwesomeIcon icon={faBlender} />Yummies
            </div>
            <div className="header__actions">
                <button className="btn--primary btn" onClick={onAddClick}>
                    <FontAwesomeIcon icon={faPlus} /> Add Recipe
                </button>

                {user ? (
                    <button className="header__avatar-btn btn" onClick={onEditProfile}>
                        {avatarUrl ? (
                            <img src={avatarUrl} className="header__avatar-img" />
                        ) : (<FontAwesomeIcon icon={faCircleUser} className="header__avatar-icon" />)}
                    </button>
                ) : (
                    <button className="btn--secondary btn" onClick={onShowLogin}>
                        Login
                    </button>
                )}
            </div>
          </div>
        </div>
    </>
  )
}

export default Header
