import { useState, useEffect } from 'react'
import create from 'zustand'

import { firebase } from '/src/auth'
import { getUser } from '/src/services/user'

const useUserStore = create(set => ({
  user: null,
  signingUp: false,
  fireState: {fireLoaded: false, fireUser: null},
  setFireState: fireState => set(() => ({ fireState })),
  setSigningUp: signingUp => set(() => ({ signingUp })),
  setUser: user => set({ user }),
}))

const useAuth = () => {
  const { fireState, setFireState, signingUp, setSigningUp, user, setUser } = useUserStore()
  const {fireLoaded, fireUser} = fireState
  const [fetching, setFetching] = useState(false)

  // Log user in w/ firebase
  const signIn = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  }

  // Log user out w/ firebase
  const signOut = () => {
    setFireState({ fireLoaded: true, fireUser: null })
    return firebase.auth().signOut()
  }

  // When the firebase auth state changes, get the user from the backend
  useEffect(() => {
    return firebase.auth().onAuthStateChanged(fireUser => {
      console.log('Auth state changed', fireUser)
      setFireState({ fireLoaded: true, fireUser })
    })
  }, [])

  useEffect(() => {
    if (fireUser !== null && !signingUp) {
      setFetching(true)
      getUser(fireUser.uid)
        .then(({ user }) => setUser(user))
        .then(() => setFetching(false))
    }
  }, [fireUser, signingUp])

  return {
    user: fireUser ? user : null,
    loading: fetching || !fireLoaded || (fireUser && !user),
    signIn,
    signOut,
    setSigningUp,
  }
}

export default useAuth
