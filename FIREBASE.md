# Configurazione Firebase

## 1. Crea un progetto su [Firebase Console](https://console.firebase.google.com)

- Aggiungi un’app **Web** e copia la configurazione (apiKey, authDomain, projectId, ecc.).

## 2. Variabili d’ambiente

Copia `.env.example` in `.env` e compila con i valori del tuo progetto:

```bash
cp .env.example .env
```

In `.env` imposta:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## 3. Domini autorizzati (importante per desktop / localhost)

Per far funzionare Firebase anche su **desktop** e in sviluppo locale:

- Vai in **Authentication** → **Settings** → **Authorized domains**.
- Assicurati che ci siano:
  - `localhost` (per `npm run dev` su desktop)
  - Il dominio di produzione (es. `tuosito.web.app`).

Senza `localhost` in autorizzati, Auth e a volte le chiamate Firestore possono fallire su desktop.

## 4. Authentication

Nella console Firebase: **Authentication** → **Sign-in method** → abilita **Email/Password**.

## 5. Firestore

- **Firestore Database** → Crea database (modalità produzione o test).
- Le collection usate dall’app sono:
  - `products` – catalogo (opzionale; se vuota l’app usa i dati in `src/data/products.js`).
  - `orders` – ordini salvati al checkout.
  - `users` – profili utente (nome, cognome, telefono, email) salvati alla registrazione; documento `users/{uid}`.

Regole di esempio per sviluppo (adatta in produzione):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{id} { allow read: if true; allow write: if false; }
    match /categories/{id} { allow read: if true; allow write: if false; }
    match /orders/{id} {
      allow read, write: if request.auth != null;
      allow create: if true;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Funzionalità integrate

- **Login / Registrazione**: Firebase Auth (email/password), recupero password. Alla registrazione si inseriscono nome, cognome, telefono, email e password; email e password vanno in Auth, nome/cognome/telefono/email in Firestore `users/{uid}`.
- **Prodotti**: lettura da Firestore `products`; fallback su `src/data/products.js`.
- **Carrello e checkout**: carrello in memoria; al completamento l’ordine viene salvato in Firestore `orders` (con `userId` se l’utente è loggato).
