
'use client';

import { useState, useEffect } from 'react';
import { supabase, type SupabaseUser } from '@/lib/supabaseClient';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AuthState {
  currentUser: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      console.error("Supabase client not initialized in useAuth hook. Auth will not work.");
      setLoading(false);
      return;
    }

    const getSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setCurrentUser(currentSession?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setCurrentUser(session?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_IN') {
          // You might want to redirect or perform actions upon sign-in
          // For example, router.push('/');
        }
        if (event === 'SIGNED_OUT') {
          // You might want to redirect or perform actions upon sign-out
          // For example, router.push('/login');
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { currentUser, session, loading };
}
