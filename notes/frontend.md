# Plans

Frontend: A modern frontend framework like React or Angular to handle the web application part of the system. This will be where customers interact with the app, view their balances, and make transactions. This part of the system will communicate with the backend using an API.

Backend: A server-side application that manages the core logic of the system. This includes managing user accounts, transaction processing, and storing data in a database. You could use Node.js with a framework like Express or NestJS for the backend.

Database: A database to store all the data used by the system. You could use a relational database like MySQL or PostgreSQL to store user information, transaction history, and other data.

Payment Gateway: A payment gateway that can handle the exchange of cryptocurrencies for fiat currencies. This is essential for accepting payments in traditional currencies, which can then be converted into cryptocurrencies. Examples of payment gateways that support cryptocurrency payments include BitPay, Coinbase Commerce, and CoinPayments.

Wallet: A cryptocurrency wallet to store cryptocurrencies securely. You could use an existing wallet like Coinbase or Blockchain.info, or develop your own wallet.

Web Dashboard: A separate web application that provides a dashboard for merchants to manage their accounts, view transactions, and perform other administrative tasks.

API: A RESTful API that allows the frontend and web dashboard to communicate with the backend. This API should handle all authentication and authorization for users, and should be secured using HTTPS and token-based authentication.

Security: A comprehensive security strategy to protect the system against potential threats, including secure coding practices, SSL/TLS encryption, two-factor authentication, and regular security audits.

Integration with blockchain networks: Integration with blockchain networks such as Bitcoin and Ethereum to facilitate transactions.

DevOps: A comprehensive DevOps strategy that includes automated testing, continuous integration and deployment, and regular backups of the database.

## Payment Listener (Webhook)

Viewing key import

## Front-end Architecture

### Public Routes:

- Landing Page (marketing copy)
- Login Route (SSO redirect/OAuth2 flow)
- Registration Route (SSO redirect/OAuth2 flow)

### Authed Routes

- Dashboard
- Store Management Page
  - Where merchants can create, edit and manage their stores
    - Inside of a store, they should be able to add products, set prices and customise the look and feel of their store (colours, etc)
- Product Management Page
  - Create, edit and manage their products. Set prices, descriptions, images, etc
  - Square/Block for inspiration and BTCPayServer
- Checkout Page
  - Where customers complete their purchases
  - Initially, this is a flow started from the Dashboard page.
- Payment Processing Page
  - Invoice component/form
  - (later on iframe/React component/API connection, etc)
- Sales report page
  - Sales by day, week or month as well as details about individual transactions
- Profile Page (SSO redirect for account info like name, etc)
  - Business info - address, details, etc
- Settings Page
  - Choose language, base currency, etc
- Help Page
  - FAQ, contact, documentation, API docs

