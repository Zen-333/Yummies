import "../styles/actionConfirmation.css"

interface props{
  msg: string,
  onDanger: () => void,
  onCancel: () => void
}

function ActionConfirmation({msg, onDanger, onCancel}: props) {

  return (
    <> 
    <div className="actionConfirm__overlay">
        <div className="actionConfirm__container" onClick={(e) => e.stopPropagation()}> {/* The click ends here. Do not tell my parents (the overlay) that I was clicked. */}
            <div className="actionConfirm__message">{msg}</div>
            <div className="actionConfirm__buttons">
                <button className="btn--secondary btn" onClick={onCancel}>Cancel</button>
                <button className="btn--danger btn" onClick={onDanger}>Delete</button>
            </div>
        </div>
    </div>
    </>
  )
}

export default ActionConfirmation;