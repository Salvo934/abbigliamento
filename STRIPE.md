# Pagamenti con Stripe

Il checkout con **Carta di credito / debito** usa **Stripe Checkout**: il cliente viene reindirizzato alla pagina sicura Stripe, paga e torna al sito sulla pagina di conferma. Gli altri metodi (PayPal, bonifico) non usano Stripe e mostrano la conferma direttamente.

## 1. Account e chiavi

- Crea un account su [stripe.com](https://stripe.com) e attiva la modalità **Test** (toggle in alto a destra nella Dashboard).
- Vai in **Developers → API keys** e copia:
  - **Publishable key** (es. `pk_test_...`) → per il frontend (opzionale se non usi Stripe.js).
  - **Secret key** (es. `sk_test_...`) → **solo server**, mai nel frontend.

## 2. Variabili d’ambiente

- **In locale** (per provare i pagamenti): crea o modifica `.env` e aggiungi:
  - `STRIPE_SECRET_KEY=sk_test_...`
  - (Opzionale) `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`
- **Su Vercel**: nel progetto → **Settings → Environment Variables** → aggiungi `STRIPE_SECRET_KEY` (e opzionalmente `VITE_STRIPE_PUBLISHABLE_KEY`). Poi **Redeploy**.

## 3. Test in locale

Con **`npm run dev`** partono sia il frontend (Vite su http://localhost:3000) sia un server API locale (porta 3001) che gestisce le route Stripe. I pagamenti con carta funzionano subito in locale.

- **`npm run dev`** — tutto in uno: sito + API Stripe (consigliato).
- **`npm run dev:vite`** — solo il sito (le API Stripe non rispondono).
- **`npm run dev:api`** — usa Vercel in locale (se preferisci l’ambiente Vercel).

## 4. Carte di test (modalità Test Stripe)

- Numero: **4242 4242 4242 4242**
- Scadenza e CVC: valori futuri qualsiasi.
- Altre carte test: [Stripe – Testing](https://docs.stripe.com/testing).

## 5. Flusso

1. Il cliente sceglie **Carta di credito / debito** e clicca **Ordina**.
2. L’ordine viene salvato su Firestore con `status: 'pending'`.
3. L’app chiama `/api/create-checkout-session`, Stripe crea la sessione e restituisce l’URL.
4. Redirect a Stripe → il cliente paga.
5. Stripe reindirizza a `/checkout/success?session_id=...`. La pagina verifica con `/api/get-session` e, se il pagamento è andato a buon fine, mostra la conferma e svuota il carrello.
