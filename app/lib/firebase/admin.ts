import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

export const firebaseAdmin =
  getApps()[0] ??
  initializeApp({
    credential: applicationDefault(),
  })

export const auth = getAuth()
