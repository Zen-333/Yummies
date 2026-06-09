import { useState, useRef } from "react"
import "../styles/editProfile.css"

interface editProfileProps{
    onClose: () => void;
}

function EditProfile({onClose}: editProfileProps) {

    return (
        <div className="editProfile__overlay">
            <div className="editProfile__container">
                
                <div className="editProfile__header">
                    <h2 className="editProfile__title">Edit Profile</h2>
                    <button type="button" className="btn" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="editProfile__avatar-container">
                    <img 
                        src="" 
                        alt="Current user avatar profile preview" 
                        className="editProfile__avatar-img"
                    />
                </div>

                <form className="editProfile__form">
                    <div className="editProfile__form-content">
                        
                        <div className="editProfile__field-group">
                            <label htmlFor="editProfile__input-username" className="editProfile__label">
                                Username
                            </label>
                            <input 
                                id="editProfile__input-username"
                                type="text" 
                                placeholder="Username" 
                                defaultValue="zzz"
                                required 
                                className="editProfile__input"
                            />
                        </div>

                        <div className="editProfile__field-group">
                            <label htmlFor="editProfile__input-avatarUrl" className="editProfile__label">
                                Profile Photo URL
                            </label>
                            <input 
                                id="editProfile__input-avatarUrl"
                                type="text" 
                                placeholder="Avatar image URL" 
                                defaultValue=""
                                required
                                className="editProfile__input"
                            />
                        </div>

                    </div>

                    <div className="editProfile__actions">
                        <div className="editProfile__danger-zone">
                            <button type="button" className="btn btn--danger">
                                Delete Account
                            </button>
                        </div>
                        <button type="button" className="btn btn--secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn--primary">
                            Save Changes
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default EditProfile;