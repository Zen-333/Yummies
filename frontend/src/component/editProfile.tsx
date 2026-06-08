import { useState, useRef } from "react"
import "../styles/editProfile.css"

function EditProfile() {

    return (
        <>
            <div className="editProfile__overlay">
                <div className="editProfile__container">
                    <div className="editProfile__header">
                        <p className="editProfile__title">Edit Profile</p>
                        <button className="btn editProfile__closeBtn">X</button>
                    </div>
                    <div className="editProfile__avatar"></div>
                    <div className="editProfile__info">
                        <div className="editProfile__username editProfile__section">
                            <p className="editProfile__section-title">Username</p>
                            <input type="text" placeholder="Username" />
                        </div>
                        <div className="ueditProfile__avatarUrl editProfile__section">
                            <p className="editProfile__section-title">Profile Photo URL</p>
                            <input type="text" placeholder="Avatar image" />
                        </div>
                    </div>
                    <div className="editProfile__actions">
                        <button className="btn">Delete Account</button>
                        <button className="btn">Cancel</button>
                        <button className="btn">Save Changes</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditProfile;
