import "../styles/actionConfirmation.css"

function ActionConfirmation() {

  return (
    <> 
    <div className="actionConfirm__overlay">
        <div className="actionConfirm__container">
            <div className="actionConfirm__message"></div>
            <div className="actionConfirm__buttons">
                <button className="btn--secondary btn">Cancel</button>
                <button className="btn--danger btn">Delete</button>
            </div>
        </div>
    </div>
    </>
  )
}

export default ActionConfirmation;