# Shop App

E-commerce full-stack con frontend Angular, backend Ruby on Rails in modalità API e database PostgreSQL. Permette login con Google, carrello, checkout, storico ordini e aree dedicate a vendor e admin.


## Indice

1. [Prerequisiti](#1-prerequisiti)
2. [Configurazione](#2-configurazione)
3. [Avvio con Docker](#3-avvio-con-docker)
4. [Architettura](#4-architettura)


## 1. Prerequisiti

- Docker Engine
- make

## 2. Configurazione

Clonare il repository e creare il file `.env` dal template:

```bash
git clone https://github.com/CIaudi0/psw.git shop
cd shop
cp .env.template .env
```

Compilare poi nel file `.env` le credenziali:

```bash
GOOGLE_CLIENT_ID=<clientid>
GOOGLE_CLIENT_SECRET=<secret>
SECRET_KEY_BASE=<stringa casuale>
```

Client ID e secret si creano in Google Cloud Console (API e servizi → Credenziali → ID client OAuth2, tipo Applicazione web), con URI di reindirizzamento `http://localhost:3000/auth/google_oauth2/callback`.

`SECRET_KEY_BASE` è la chiave con cui il backend firma i token JWT e serve solo per la versione di produzione (`make prod`); in sviluppo Rails usa una chiave locale. Si genera con:

```bash
openssl rand -hex 64
```

## 3. Avvio con Docker

```bash
make dev     # avvia database, backend e frontend in sviluppo
make seed    # inserisce utenti e prodotti di esempio
```

- Database: all'avvio il backend esegue `bin/rails db:prepare`, che crea il database e applica le migrazioni. Il seed (`make seed`) cancella e ricrea i dati di esempio.
- Backend: http://localhost:3000 (la pagina `/up` risponde se è attivo)
- Frontend in sviluppo, con ricaricamento automatico: http://localhost:4200

Per la versione di produzione (frontend compilato e servito da nginx, database `shop_production` separato, migrazioni e seed eseguiti al primo avvio):

```bash
make prod    
```

Altri comandi:

```bash
make down             # ferma i container
make logs             # mostra i log
make test             # test del backend
make test-frontend    # test del frontend (con make dev avviato)
```

Utenti creati dal seed:

- `claudio.astolfi@edu.unife.it` (admin, accesso con Google)
- `claudio00astolfi@gmail.com` (vendor, accesso con Google, proprietario di metà dei prodotti)

Chi accede con Google per la prima volta viene creato con ruolo `user`; l'admin può cambiargli ruolo dalla dashboard.

## 4. Architettura

### Modelli del dominio

- **User – Cart** (1 a 1): ogni utente ha un solo carrello, creato alla prima richiesta.
- **Cart – CartItem** (1 a molti): un carrello ha molte righe; ogni riga appartiene a un solo carrello.
- **Product – CartItem** (1 a molti): un prodotto può comparire nelle righe di molti carrelli; ogni riga si riferisce a un solo prodotto. Di conseguenza tra Cart e Product c'è una relazione molti a molti, che passa da CartItem.
- **User – Order** (1 a molti): un utente può fare molti ordini; ogni ordine appartiene a un solo utente.
- **Order – OrderItem** (1 a molti): un ordine è composto da molte righe; ogni riga appartiene a un solo ordine.
- **Product – OrderItem** (1 a molti): un prodotto può comparire in molte righe d'ordine; ogni riga d'ordine si riferisce a un solo prodotto. Order e Product sono legati molti a molti, attraverso OrderItem.
- **User – Product** (1 a molti, come vendor): un utente con ruolo vendor può mettere in vendita molti prodotti; ogni prodotto ha al massimo un vendor.

- `User`: email, nome, cognome e ruolo (`user`, `vendor`, `admin`).
- `Product`: titolo, descrizione, prezzo, prezzo originale e flag sconto, stock, foto e vendor proprietario.
- `Cart`: il carrello dell'utente.
- `CartItem`: una riga del carrello (prodotto, quantità, prezzo unitario). Chi non è loggato usa un carrello in `localStorage`, unito a quello del server al login.
- `Order`: utente, totale, stato (`in_lavorazione`, `spedito`, `consegnato`), metodo di spedizione (`standard`, `express`) e copia dei dati cliente e dell'indirizzo al momento dell'acquisto.
- `OrderItem`: prodotto, quantità e prezzo bloccato al momento dell'ordine.

### Flusso login → carrello → checkout → ordine

1. Catalogo: `GET /products`, pubblico, con ricerca per titolo, filtro "Solo sconti" e paginazione.
2. Carrello: da non loggati i prodotti restano nel browser, da loggati vengono salvati con `POST /cart/items`. La pagina `/cart` mostra righe e totale.
3. "Procedi al checkout" porta al login se l'utente non è autenticato.
4. Login: `GET /auth/google_oauth2`. Dopo Google il backend reindirizza a `/login/success?token=...` con un token JWT valido 24 ore, che Angular salva in `localStorage` e allega a ogni richiesta con l'interceptor. Subito dopo il carrello locale viene unito a quello del server con `POST /cart/sync`. Il logout cancella il token.
5. Checkout: nome, cognome ed email si precompilano con `GET /auth/me`; il form invia `POST /orders` con cliente, indirizzo e metodo di spedizione. In una transazione il backend controlla lo stock, crea `Order` e `OrderItem`, scala lo stock e svuota il carrello.
6. Ordini: `/orders` mostra lo storico e `/orders/:id` il dettaglio.

I permessi sono controllati dal backend, le guard di Angular servono a nascondere le pagine non accessibili.

### API REST

Prodotti (pubblici):

- `GET /products`: elenco dei prodotti, con parametri `q` (ricerca), `sale` (solo sconti), `page` e `per_page` (paginazione)
- `GET /products/:id`: dettaglio di un prodotto

Autenticazione:

- `GET /auth/google_oauth2`: avvia il login con Google
- `GET /auth/google_oauth2/callback`: ritorno da Google, crea il token e reindirizza al frontend
- `GET /auth/me`: dati dell'utente loggato

Carrello (solo utenti loggati):

- `GET /cart`: stato del carrello
- `POST /cart/items`: aggiunge un prodotto (`productId`, `quantity`)
- `PATCH /cart/items/:id`: cambia la quantità di una riga
- `DELETE /cart/items/:id`: rimuove una riga
- `POST /cart/sync`: unisce il carrello del browser a quello del server

Ordini (solo utenti loggati):

- `GET /orders`: ordini dell'utente, con filtri `status`, `from` e `to`
- `GET /orders/:id`: dettaglio di un ordine
- `POST /orders`: crea l'ordine dal carrello

Vendor (vendor e admin):

- `POST /vendor/products`: crea un prodotto
- `PATCH /vendor/products/:id`: modifica un prodotto
- `DELETE /vendor/products/:id`: elimina un prodotto

Admin (solo admin):

- `GET /admin/users`: elenco degli utenti
- `PATCH /admin/users/:id`: cambia il ruolo di un utente
- `DELETE /admin/users/:id`: elimina un utente

Gli errori hanno sempre la forma `{ "errors": ["messaggio"] }`, con questi status:

- `400`: parametro mancante
- `401`: utente non autenticato o token non valido
- `403`: ruolo non sufficiente
- `404`: risorsa inesistente o di un altro utente
- `422`: dati non validi (validazione fallita, stock insufficiente, carrello vuoto)
- `500`: errore imprevisto

### Scelte progettuali

- **Si parte dal frontend dei lab.** L'app Angular è quella costruita a lezione sulla shop-mock-api; il backend Rails ha sostituito il mock, mantenendo i nomi dei campi del mock.
- **Login con Google e token JWT.** Google OAuth2 serve solo a riconoscere l'utente al momento del login. Poi il backend emette un suo token JWT (valido 24 ore, firmato con `secret_key_base`), che Angular salva in `localStorage` e l'interceptor allega a ogni richiesta. 
- **Permessi controllati dal backend.** A ogni richiesta l'utente e il suo ruolo vengono riletti dal database; carrello e ordini si cercano sempre a partire dall'utente loggato.
- **L'ordine è una copia.** Dati del cliente, indirizzo e prezzo di ogni riga vengono copiati nell'ordine al momento dell'acquisto, così l'ordine resta corretto anche se poi cambiano il profilo o il prezzo del prodotto. Il totale lo calcola sempre il backend dal carrello salvato.
- **Carrello anche senza login.** Chi non è loggato usa un carrello nel `localStorage`, che al login viene unito a quello del server.

### Funzionalità avanzate

1. Area vendor e admin: il vendor crea, modifica ed elimina i propri prodotti, stock incluso; l'admin gestisce tutti i prodotti e assegna i ruoli agli utenti. Protezione nel backend (`require_vendor!`, `require_admin!`) e nel frontend (`vendorGuard`, `adminGuard`).
2. Storico ordini avanzato: filtri per stato e intervallo di date, pagina di dettaglio con prodotti, quantità, prezzi, indirizzo e spedizione.
