import { useState, useRef, useEffect } from "react"
import "../styles/editProfile.css"
import {useAuth} from "../context/AuthContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCamera } from "@fortawesome/free-solid-svg-icons"

interface editProfileProps{
    onClose: () => void;
}

function EditProfile({onClose}: editProfileProps) {

    const {getProfile, updateProfile, deleteAccount} = useAuth();

    const [displayName, setDisplayName] = useState("");
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [ avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const avatarInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getProfile().then(profile => {
            if(profile)
            {
                setDisplayName(profile.display_name ?? "");
                setCurrentAvatarUrl(profile.avatar_url);
            }
        })
    },[])

    const handleAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;
        if(avatarPreview) URL.revokeObjectURL(avatarPreview);
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
        e.target.value = "";
    }

    const handleSave = async () => {
        if(!displayName.trim())
        {
            setError("Display name cannot be empty.")
            return;
        }

        setError(null);
        setIsSaving(true);
        const errorMsg = await updateProfile(displayName, avatarFile ?? undefined);
        setIsSaving(false);
        if(errorMsg)
        {
            setError(errorMsg)
            return;
        }
        if(avatarPreview) URL.revokeObjectURL(avatarPreview)
        onClose();
    }

    const handleDelete = async () => {
        if(!window.confirm("Permanently delete your account? this cannot be undone.")) return;
        setIsDeleting(true);
        const errorMsg = await deleteAccount();
        setIsDeleting(false);
        if(errorMsg) setError(errorMsg);
        onClose();
    }

    const showAvatar = avatarPreview ?? currentAvatarUrl;

    return (
        <div className="editProfile__overlay" onClick={onClose}>
            <div className="editProfile__container" onClick={(e) => e.stopPropagation()}>
                
                <div className="editProfile__header">
                    <h2 className="editProfile__title">Edit Profile</h2>
                    <button type="button" className="btn" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="editProfile__avatar-container" onClick={() => avatarInputRef.current?.click()}>
                    {showAvatar ? (
                        <img src={showAvatar} alt="Avatar" className="editProfile__avatar-img"/>
                    ): (<div className="editProfile__avatar-placeholder">
                        <FontAwesomeIcon icon={faCamera}/>
                    </div>)}
                    <input ref={avatarInputRef}
                     type="file"
                     accept="image/*" 
                     style={{display: "none"}}
                     onChange={handleAvatarPick}/>
                </div>

                <form className="editProfile__form">
                    <div className="editProfile__form-content">
                        
                        <div className="editProfile__field-group">
                            <label htmlFor="editProfile__input-username" className="editProfile__label">
                               Display Name
                            </label>
                            <input 
                                id="editProfile__input-username"
                                type="text" 
                                placeholder="Your name" 
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
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
                            <button type="button" className="btn btn--danger" onClick={handleDelete} disabled={isDeleting}>
                                {isDeleting ? "Deleting..." : "Delete Account"}
                            </button>
                        </div>
                        <button type="button" className="btn btn--secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn--primary" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default EditProfile;