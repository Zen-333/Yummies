import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
    user: User | null
    session: Session | null
    loading: boolean
    signInWithGoogle: () => Promise<void>
    signInWithEmail: (email: string, password: string) => Promise<string | null>
    signUpWithEmail: (email: string, password: string, avatarFile?: File) => Promise<string | null>
    signOut: () => Promise<void>
    getProfile: () => Promise<{ display_name: string | null; avatar_url: string | null } | null>
    updateProfile: (displayName: string, avatarFile?: File) => Promise<string | null>
    deleteAccount: () => Promise<string | null>
    profile: { display_name: string | null; avatar_url: string | null } | null
    refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)



export function AuthProvider({ children }: { children: React.ReactNode }) {
    
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null } | null>(null)
    
    const refreshProfile = async () => {
        const {data: {session: currentSession}} = await supabase.auth.getSession()
        if(!currentSession) {setProfile(null); return}
        const {data} = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('user_id', currentSession.user.id)
            .single()
        setProfile(data ?? null);
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)

            if(session)
            {
                supabase
                    .from('profiles')
                    .select('display_name, avatar_url')
                    .eq('user_id', session.user.id)
                    .single()
                    .then(({data}) => setProfile(data ?? null))
            } else{
                setProfile(null);
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        })
    }

    // Returns null on success, or an error message string on failure.
    const signInWithEmail = async (email: string, password: string): Promise<string | null> => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) return error.message
        return null
    }

    // Returns null on success, or an error message string on failure.
    // If an avatarFile is provided, it uploads it to the 'avatars' bucket and
    // saves the public URL into the user's metadata so it's accessible anywhere.
    const signUpWithEmail = async (email: string, password: string, avatarFile?: File): Promise<string | null> => 
    {
        const { data, error } = await supabase.auth.signUp({ email, password })

        if (error) return error.message
        if (!data.user) return 'Sign up failed — no user returned.'

        if (avatarFile) {
            const ext = avatarFile.name.split('.').pop() ?? 'jpg'
            const filePath = `${data.user.id}/avatar.${ext}`

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, avatarFile, { cacheControl: '3600', upsert: true })

            if (!uploadError && uploadData) {
                const { data: urlData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(uploadData.path)

                const avatarUrl = urlData.publicUrl

                // Store in auth metadata (accessible via user.user_metadata.avatar_url)
                await supabase.auth.updateUser({ data: { avatar_url: avatarUrl } })

                // Also update the profiles table row that the trigger just created
                await supabase
                    .from('profiles')
                    .update({ avatar_url: avatarUrl })
                    .eq('user_id', data.user.id)
            } else if (uploadError) {
                console.error('Avatar upload failed:', uploadError.message)
                // Not fatal — account created, avatar just won't be set
            }
        }

        return null
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    const getProfile = async () => {
        const {data, error} = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('user_id', user?.id)
            .single()
        if(error) return null
        return data;
    }

    const updateProfile = async (displayName: string, avatarFile?: File): Promise<string | null> => {
        if(!user) return 'Not authenticated';

        let avatarUrl: string | undefined;

        if(avatarFile)
        {
            const ext = avatarFile.name.split('.').pop() ?? 'jpg';
            const filePath = `${user.id}/avatar.${ext}`

            const {data: uploadData, error: uploadError} = await supabase.storage
                .from('avatars')
                .upload(filePath, avatarFile, {cacheControl: '3600', upsert: true});
            
            if(uploadError) return uploadError.message;

            const {data: urlData} = supabase.storage
                .from('avatars')
                .getPublicUrl(uploadData.path)
            
            avatarUrl = urlData.publicUrl;    
        }

        const updates: {display_name: string; avatar_url?: string} = {display_name: displayName}
        if(avatarUrl) updates.avatar_url = avatarUrl;

        const {error} = await supabase
            .from('profiles')
            .update(updates)
            .eq('user_id', user.id);

        if(error) return error.message;
        await refreshProfile();

        if(avatarUrl) {
            await supabase.auth.updateUser({data: {avatar_Url: avatarUrl}})
        }
        
        return null
    }

    const deleteAccount = async (): Promise<string | null> => {
        const {data: {session}} = await supabase.auth.getSession();
        if(!session) return 'Not authenticated'

        const response = await fetch('/api/user/account', {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${session.access_token}`}
        })

        if(!response.ok)
        {
            try{
                const data = await response.json();
                return data.message ?? "Failed to delete account"
            }catch
            {
                return `server error: ${response.status}`
            }
        }

        await supabase.auth.signOut();
        return null;
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, getProfile, updateProfile, deleteAccount, profile, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}