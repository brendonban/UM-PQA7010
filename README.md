# Counseling@UM website (Next.js)

Website for the counseling service of the Department of Educational Psychology and Counseling,
Faculty of Education, Universiti Malaya. Built with Next.js; data (registrations, trainees, events)
is stored in Firebase. Hosted on Vercel.

## What's where

| You want to change… | Edit this |
|---|---|
| Services, FAQ, hotlines, opening hours, address, supervisor | `lib/content.js` |
| Home page text and cards | `app/page.js` |
| Any other page | `app/<page>/page.js` (e.g. `app/team/page.js`) |
| Colours, fonts, spacing | `app/globals.css` |
| Logo and photos | `public/assets/` (see `README.txt` there) |
| Trainees, events, registrations | The staff console at `/admin` (no code needed) |

## 1. Put the code on GitHub
1. Create a new repository on github.com (e.g. `um-counseling-site`). Private is fine.
2. Upload everything in this folder **except** `node_modules` and `.next`
   (drag the files into *Add file → Upload files*, or use GitHub Desktop).

## 2. Set up Firebase (one time, ~15 minutes)
Use the centre's UM Google account so the data belongs to the centre.
1. <https://console.firebase.google.com> → **Create a project** → name it `um-counseling` (Analytics off).
2. Click the **Web `</>`** icon → register an app called `website`. Keep the `firebaseConfig` values for step 3.
3. **Build → Firestore Database → Create database** → location **asia-southeast1 (Singapore)** → production mode.
   Open the **Rules** tab, replace everything with the contents of `firestore.rules`, click **Publish**.
4. **Build → Authentication → Get started → Google → Enable → Save**.
5. **Firestore → Data → Start collection** `admins` → document ID = a staff member's Google email
   (exactly, e.g. `counselinglab@um.edu.my`) → add a field `name` → Save. Repeat for each staff member.

## 3. Deploy on Vercel
1. <https://vercel.com> → sign in with GitHub → **Add New → Project** → choose the repository.
   Vercel detects Next.js automatically; no settings to change.
2. Before clicking Deploy, open **Environment Variables** and add the six values from `.env.example`,
   filled in from your Firebase `firebaseConfig`:

   | Name | From firebaseConfig |
   |---|---|
   | `NEXT_PUBLIC_FIREBASE_API_KEY` | `apiKey` |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `projectId` |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
   | `NEXT_PUBLIC_FIREBASE_APP_ID` | `appId` |

3. Click **Deploy**. You'll get an address like `um-counseling-site.vercel.app`.
4. Back in Firebase: **Authentication → Settings → Authorized domains → Add domain** → add that address
   (and any custom domain later). Without this, staff sign-in won't work.

From now on, every change pushed to GitHub goes live automatically.
If you change environment variables later, redeploy in Vercel (Deployments → ⋯ → Redeploy).

## 4. Check it works
1. Open `/admin` (or click **Staff login** in the footer) → **Sign in with Google**.
2. Add a trainee and an event → check the Our Team and Events pages.
3. Send a test registration via **Register Now** → it should appear in the console.

Until Firebase is connected the site still works: it shows placeholder trainees and events, and the
registration form says "Registration is not connected yet". Preview the console with sample data at `/admin?demo=1`.

## Run it on your own computer (optional)
Requires Node.js 20 or newer.
```
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # open http://localhost:3000
```

## Protecting client data
Registrations contain personal and sensitive information.
- Only add staff who need it to the `admins` list; remove people when they leave.
- Don't share exported CSV files by email or chat; delete them when done.
- Agree with your department how long registrations are kept, in line with UM policy and the PDPA.
