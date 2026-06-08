import "../styles/accountOptions.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext"

interface AccountOptionsprops{
  onClose: () => void;
  onEdit: () => void
}

function AccountOptions({onClose, onEdit}: AccountOptionsprops) {
  const {signOut} = useAuth()
 
  const editProfile = () => {
    onEdit();
    onClose();
  }

  const onSignOut = () => {
    signOut();
    onClose();
  }

  return (
    <> 
      <div className="accountOptions__overlay" onClick={onClose}>
        <div className="accountOptions__container" onClick={(e) => e.stopPropagation()}>
          <div className="accountOptions__section accountOptions__header">
            <p className="accountOptions__name">Zen</p>
            <p className="accountOptions__myAccount">My Account</p>
          </div>

          <div className="accountOptions__section">
            <button type="button" className="btn accountOptions__btn" onClick={editProfile}><span className="accountOptions__icon"><FontAwesomeIcon icon={faGear} /></span>Edit Profile</button>
          </div>

          <div className="accountOptions__section">
              <button type="button" className="btn accountOptions__btn" onClick={onSignOut}><span className="accountOptions__icon"><FontAwesomeIcon icon={faArrowRightFromBracket} /></span>Log out</button>
          </div>

        </div>
      </div>
    </>
  )
}

export default AccountOptions
