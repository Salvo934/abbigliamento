# Pagamenti con Stripe

Il checkout permette di pagare con **carta di credito/debito** tramite Stripe Checkout (redirect alla pagina sicura Stripe). Gli altri metodi (PayPal, bonifico) restano come opzioni senza integrazione reale.

## 1. Account Stripe

- Crea un account su [stripe.com](https://stripe.com) e attiva la modalità **test** per provare senza addebiti reali.
- Dalla [Dashboard Stripe](https://dashboard.stripe.com) → **Developers** → **API keys**: copia la **Secret key** (es. `sk_test_...`).

## 2. Variabili d’ambiente

- **In locale** (con `vercel dev`): crea o modifica `.env` e aggiungi  
  `STRIPE_SECRET_KEY=sk_test_...`
- **Su Vercel**: nel progetto → **Settings** → **Environment Variables** → aggiungi  
  `STRIPE_SECRET_KEY` con il valore della Secret key (Production: `sk_live_...`, Preview/Test: `sk_test_...`).

La chiave segreta viene usata solo dalle API in `/api` (serverless) e non deve essere esposta nel frontend.

## 3. Come funziona

1. Il cliente sceglie **Carta di credito / debito** al passo “Pagamento” e clicca **Ordina**.
2. L’ordine viene salvato su Firestore con `status: 'pending'`.
3. L’app chiama `/api/create-checkout-session` che crea una **Stripe Checkout Session** e restituisce l’URL della pagina di pagamento Stripe.
4. Il cliente viene reindirizzato a Stripe, inserisce i dati della carta e paga.
5. Stripe reindirizza a `/checkout/success?session_id=...`. La pagina verifica lo stato della sessione con `/api/get-session` e, se il pagamento è andato a buon fine, mostra la conferma e svuota il carrello.

## 4. Test in locale

Le API Stripe girano come **Vercel Serverless**. In locale:

- Esegui **`vercel dev`** (dopo `npm i -g vercel` e `vercel link`): così sia il frontend (Vite) sia le route `/api/*` sono attive.
- Oppure testa in produzione su Vercel dopo il deploy.

Con solo `npm run dev` le chiamate a `/api/create-checkout-session` e `/api/get-session` non sono disponibili (nessun server API).

## 5. Carte di test (modalità test Stripe)

In modalità test puoi usare ad esempio:

- Numero: **4242 4242 4242 4242**
- Scadenza e CVC: valori futuri qualsiasi
- Dettagli: [Stripe – Testing](https://docs.stripe.com/testing)
