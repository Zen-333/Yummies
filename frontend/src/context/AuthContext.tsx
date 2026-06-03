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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

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
    const signUpWithEmail = async (email: string, password: string, avatarFile?: File): Promise<string | null> => {
        const { data, error } = await supabase.auth.signUp({ email, password })

        if (error) return error.message
        if (!data.user) return 'Sign up failed — no user returned.'

        if (avatarFile) {
            const ext = avatarFile.name.split('.').pop() ?? 'jpg'
            const filePath = `${data.user.id}/avatar.${ext}`

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, avatarFile, { cacheControl: '3600', upsert: true })

            if (uploadError) {
                // Avatar upload failed but account was created — not fatal.
                // Return null (success) but the avatar just won't be set.
                console.error('Avatar upload failed:', uploadError.message)
                return null
            }

            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(uploadData.path)

            // Store the avatar URL in the user's metadata so you can access it
            // anywhere via supabase.auth.getUser() → user.user_metadata.avatar_url
            await supabase.auth.updateUser({
                data: { avatar_url: urlData.publicUrl }
            })
        }

        return null
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}