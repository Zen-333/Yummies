import "../styles/successMessage.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

interface SuccessMessageProps {
  success: boolean;
  message: string;
}

function SuccessMessage({success, message}: SuccessMessageProps) {
    return (
    <>
        {
            success ? (
                <div className="successMessage__container successMessage__success">
                    <p className="successMessage__message successMessage__message--success">
                        <FontAwesomeIcon icon={faCircleCheck} /> {message}
                    </p>
                </div>
            ) : (
                <div className="successMessage__container successMessage__fail">
                    <p className="successMessage__message successMessage__message--fail">
                        <FontAwesomeIcon icon={faCircleXmark} /> {message}
                    </p>
                </div>
            )
        }

    </>
    );
}

export default SuccessMessage;
