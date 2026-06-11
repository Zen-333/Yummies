import { useState, useRef, useEffect } from "react"
import "../styles/editProfile.css"
import {useAuth} from "../context/AuthContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCamera } from "@fortawesome/free-solid-svg-icons"

interface editProfileProps{
    onClose: () => void;
    showActionMessageState: (inShow: boolean, inMsg: string, inOnDanger: () => void, inDangerStr: string) => void;
}

function EditProfile({onClose, showActionMessageState}: editProfileProps) {

    const {getProfile, updateProfile, deleteAccount} = useAuth();

    const [displayName, setDisplayName] = useState("");
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [ avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

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
            return;
        }

        setIsSaving(true);
        const errorMsg = await updateProfile(displayName, avatarFile ?? undefined);
        setIsSaving(false);
        if(errorMsg)
        {
            return;
        }
        if(avatarPreview) URL.revokeObjectURL(avatarPreview)
        onClose();
    }

    const handleDeleteClick = () => {
        showActionMessageState(
            true,
            "Permanently delete your account? All your recipes and data will be gone",
            async () => {
                const errorMsg = await deleteAccount();
                if(errorMsg)
                {
                    console.log(errorMsg);
                }
            },
            "Delete Account"
        );
        onClose();
    }

    const showAvatar = avatarPreview ?? currentAvatarUrl;

    return (
        <div className="editProfile__overlay">
            <div className="editProfile__container">
                
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

                    </div>

                    <div className="editProfile__actions">
                        <div className="editProfile__danger-zone">
                            <button type="button" className="btn btn--danger" onClick={handleDeleteClick}>
                                Delete Account
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