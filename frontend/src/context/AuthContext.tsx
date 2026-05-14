import {createContext, useContext, useEffect, useState} from 'react'
import type {Session, User} from '@supabase/supabase-js'
import {supabase} from '../lib/supabase'

interface AuthContextType{
    user: User | null
    session: Session | null
    loading: boolean
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
}