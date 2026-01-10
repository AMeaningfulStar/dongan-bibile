import admin from 'firebase-admin'

const app =
  admin.apps[0] ??
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })

const adminAuth = admin.auth(app)
const adminDb = admin.firestore(app)

export { adminAuth, adminDb }
