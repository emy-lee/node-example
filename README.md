# ENGLISH

This repository is used for the test program by candidates for the open position of "developer full stack" at Kopjra Srl.

The total estimated time to complete the test is about 4 hours.

# Common guidelines and delivery methods

It 'been given a dummy application in Node.js on Express 4, no front-end, which responds only to the `GET / hello`. Please extend the application, following the guidelines indicated in the year specific. The solution will also perform input validation (both front-end and back-end) and contain the test classes. There is no set deadline for delivery.

1. Perform a fork of this repository;
1. Perform the exercise by following the description and deliveries indicated;
1. If you have any questions, please open un'issue the repository itself;
1. At the end of the changes make a Pull Request.

# General description

The purpose of the application is to create a simple application that allows the sale of a single financial instrument.

All users can purchase and sale transactions (subject to verification of their cash for purchases and possession of the instrument for its sales). I do not allow short selling operations.

Cornerstone of the application is the book (book) containing proposals for the purchase and sale with its price and volume. Please visit the following page of the Italian Stock Exchange for more information: http://www.borsaitaliana.it/notizie/sotto-la-lente/il-book.htm

## Simplifying assumptions

1. It will be used a single currency notional divided into cents;
1. As already indicated, there is a single financial instrument to trade on the platform;
1. There is no concept of a user with administrator privileges: all users are "unprivileged", each of which has access only to its own resources;
1. There is no registration page but only to login;
1. The inclusion of new users or editing / removal of existing users (including the loading of the initial portfolio for each user) will eventually hand by intervening directly on the data storage.

# Specific Directives to the front end

The front-end will be a Single Page Application developed preferably React to use the RESTful API provided by the back-end. We recommend the use of Bootstrap to the templating base.

The UI will simply allow the use of the functionality described above. The evaluation of the UX is not a specific objective of the test.

# Specific Directives to the back-end

The backend will expose RESTful API and will be developed using Express 4. Interactions on the underlying database will be simulated using mock objects provided with exercise.

All calls API RESTful backend must accept a content type "application / json" and * must * respond with content of the same type.

Possibly static content can be served directly from Express, but it is absolutely forbidden pre-rendering of HTML by the back-end.

Choose the model preferred authentication.








----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
# ITALIAN

Il presente repository è utilizzato per la prova di programmazione da parte dei candidati per la posizione aperta di "sviluppatore full stack" presso Kopjra Srl.

Il tempo complessivo stimato per completare la prova è di circa 4 ore.

# Direttive comuni e modalità di consegna

E' stata fornita una applicazione dummy in Node.js su Express 4, senza front-end, che risponde esclusivamente alla chiamata `GET /hello`. Si prega di estendere l'applicazione, seguendo le direttive indicate nell'esercizio specifico. La soluzione dovrà effettuare anche la validazione dell'input (sia lato front-end che back-end) e contenere le classi di test. Non è prevista una deadline per la consegna.

1. Effettuare un fork del presente repository;
1. Eseguire l'esercizio seguendo la descrizione e le consegne indicate;
1. Se si hanno delle domande, si prega di aprire un'issue sul repository stesso;
1. Al termine delle modifiche effettuare una Pull Request.

# Descrizione generale

Lo scopo dell'applicazione è quello di creare una semplice applicazione che permetta la compravendita di un solo strumento finanziario.

Tutti gli utenti possono effettuare operazioni di compravendita (previa verifica delle loro disponibilità liquide per gli acquisti ed il possesso dello strumento per le relative vendite). Non sono permesse operazioni di vendita allo scoperto.

Elemento cardine dell'applicazione è il libro (book) contenente le proposte di acquisto e vendita con relativo prezzo e volume. Si visiti la seguente pagina di Borsa Italiana per ulteriori informazioni: http://www.borsaitaliana.it/notizie/sotto-la-lente/il-book.htm

## Ipotesi semplificative

1. Sarà utilizzata una sola valuta fittizia divisibile in centesimi;
1. Come già indicato, esiste un unico strumento finanziario da scambiare sulla piattaforma;
1. Non esiste il concetto di utente con privilegi di amministratore: tutti gli utenti sono "unprivileged", ognuno dei quali ha accesso esclusivamente alle proprie risorse;
1. Non è prevista la pagina di registrazione ma solo quella di login;
1. L'inserimento di nuovi utenti o la modifica/rimozione degli utenti già esistenti (ivi incluso il caricamento del portafoglio iniziale per ogni utente) avverrà eventualmente a mano intervenendo direttamente sul data storage.

# Direttive specifiche per il front-end

Il front-end dovrà essere una Single Page Application sviluppata preferibilmente in React che utilizzi le API RESTful messe a disposizione dal back-end. Si consiglia l'utilizzo di Bootstrap per il templating di base.

La UI dovrà semplicemente permettere l'utilizzo delle funzionalità descritte in precedenza. La valutazione della UX non è un obiettivo specifico della prova.

# Direttive specifiche per il back-end

Il back-end dovrà esporre delle API RESTful e dovrà essere sviluppato utilizzando Express 4. Le interazioni sul database sottostante dovranno essere simulate utilizzando i mock object forniti con l'esercizio.

Tutte le chiamate sulle API RESTful del back-end devono accettare un contenuto di tipo "application/json" e *devono* rispondere con un contenuto dello stesso tipo.

Eventualmente i contenuti statici potranno essere serviti direttamente da Express ma è assolutamente vietato il pre-rendering dell'HTML da parte del back-end.

Si scelga il modello di autenticazione preferito.
