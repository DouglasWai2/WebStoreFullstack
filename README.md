# WebStoreFullstack

Marketplace fullstack com backend em Node.js/Express/MongoDB e frontend em React/Vite. O projeto cobre cadastro/login, lojas, catálogo, carrinho, cálculo de frete, checkout com Stripe, pedidos, avaliações e área do vendedor.

## Estrutura

```text
.
├── backend/   # API Express, MongoDB/Mongoose, Stripe, S3 e Melhor Envio
└── WebStoreF/ # Frontend React + Vite + Tailwind
```

## Como Iniciar

### Requisitos

- Node.js 18
- npm
- MongoDB acessível via URI
- Conta/credenciais para serviços usados pela API:
  - Stripe
  - AWS S3
  - Gmail SMTP ou conta compatível com Nodemailer
  - Melhor Envio sandbox
  - Google OAuth para login social no frontend

### Backend

```bash
cd backend
npm install
npm run dev
```

Servidor padrão: o backend sobe na porta definida em `PORT` e expõe a API em `/api/v1`.

Exemplo:

```env
PORT=5000
BASE_URL=http://localhost:5000
ORIGIN=http://localhost:3000
MONGODB_URI=mongodb+srv://...
SECRET_JWT_TOKEN=access-token-secret
REFRESH_TOKEN_SECRET=refresh-token-secret
STRIPE_KEY=sk_test_...
STRIPE_WHSEC=whsec_...
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_BUCKET=webstore-api-images
EMAIL_USER=...
EMAIL_PASS=...
MELHORENVIO_CLIENT_SECRET=...
MELHORENVIO_ACCESS_TOKEN=...
ENCRYPTION_SECRET_KEY=...
ENCRYPTION_SECRET_IV=...
ENCRYPTION_METHOD=aes-256-cbc
```

Scripts:

```bash
npm start # node index.js
npm run dev # nodemon index.js
npm test # não há testes configurados; o script atual retorna erro
```

### Frontend

```bash
cd WebStoreF
npm install
npm run dev
```

Servidor Vite: `http://localhost:3000`.

Exemplo:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_DOMAIN=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=...
STRIPE_KEY=pk_test_...
```

Scripts:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```
## Frontend

### Stack

- React 18
- Vite 5
- React Router DOM 6
- Tailwind CSS
- Axios
- Stripe React SDK
- Google OAuth
- Font Awesome
- Lottie

### Inicialização

O entrypoint é `src/main.jsx`, que envolve a aplicação em `GoogleOAuthProvider` usando `VITE_GOOGLE_CLIENT_ID`.

`src/App.jsx` monta o roteamento com `createBrowserRouter`, sincroniza usuário logado por `/user`, usa `localStorage.accessToken` e integra carrinho local com a API quando o login acontece.


## Backend

### Stack

- Express 4
- MongoDB/Mongoose
- JWT com access token e refresh token em cookie
- Multer + multer-s3 para upload de imagens
- Stripe Payment Intents e webhooks
- Melhor Envio sandbox para cálculo de frete
- Nodemailer para verificação de e-mail
- express-rate-limit

### Base URL

Todas as rotas abaixo são relativas a:

```text
/api/v1
```

Rotas de autenticação usam:

```text
/api/v1/auth
```

### Autenticação

Rotas privadas exigem:

```http
Authorization: Bearer <accessToken>
Cookie: refreshToken=<refreshToken>
```

O login grava os cookies `refreshToken` e `loggedin` com `sameSite: none` e `secure: true`. Em ambiente local via HTTP, isso pode exigir ajuste de configuração ou execução em HTTPS para o navegador aceitar cookies `secure`.

Quando o access token expira, o frontend chama `GET /auth/refresh`, atualiza `localStorage.accessToken` e repete a requisição original.

### Rate Limits

- Catálogo: 400 requests por 15 minutos.
- Loja: 300 requests por 15 minutos.
- Limitadores default/user existem no código, mas nem todos estão aplicados no `index.js`.

### Rotas Gerais

#### `GET /`

Health check.

Response `200`:

```text
Server OK
```

#### `GET /ip`

Retorna o IP detectado pelo Express.

Response `200`:

```text
<ip>
```

## Backend: Auth

### `POST /auth/register`

Cadastra usuário e envia e-mail de verificação.

Request body:

```json
{
  "name": "Ana",
  "lastName": "Silva",
  "email": "ana@example.com",
  "phone": "11999999999",
  "password": "Senha@123"
}
```

Response `201`: usuário criado serializado em JSON.

Erros:

```json
{ "message": "Password less than 6 characters" }
```

```json
{ "message": "already registered", "err": { "email": 1 } }
```

### `GET /auth/register/user/verify/:id/:token`

Confirma o e-mail do usuário.

Response `200`:

```text
email verified sucessfully
```

Erros:

```text
Invalid link
```

Observação: o frontend também possui a rota `/register/user/verify?id=...&token=...`, mas a API implementada espera `:id/:token` na URL.

### `POST /auth/login`

Login com e-mail e senha.

Request body:

```json
{
  "email": "ana@example.com",
  "password": "Senha@123"
}
```

Response `200`:

```json
{
  "authorization": "<accessToken>",
  "name": "Ana",
  "lastName": "Silva",
  "email": "ana@example.com",
  "isVerified": true
}
```

Cookies:

- `refreshToken`
- `loggedin`

Erros:

```json
{ "success": false, "error": "missing params" }
```

```json
{ "success": false, "error": "User does not exist" }
```

```json
{ "success": false, "error": "Wrong password" }
```

### `POST /auth/login/google`

Login/cadastro via Google OAuth.

Request body: objeto retornado por `useGoogleLogin`, usando pelo menos `access_token`.

```json
{
  "access_token": "<googleAccessToken>"
}
```

Response `200`: mesmo formato de `/auth/login`.

### `GET /auth/refresh`

Rotaciona o refresh token e gera novo access token.

Request: cookie `refreshToken`.

Response `200`:

```json
{
  "accessToken": "<newAccessToken>"
}
```

Erros:

```text
Access Denied. No refresh token provided.
```

```text
Invalid refresh token
```

### `GET /auth/logout`

Remove o refresh token salvo no usuário e limpa cookies.

Response `200`:

```text
User Logged Out succesfully
```

Sem cookie:

```text
No cookie provided, user already logged out
```

## Backend: Usuário

### `GET /user` privado

Retorna dados do usuário autenticado sem `password` e `refreshTokens`, com `address` populado.

Response `200`:

```json
{
  "_id": "userId",
  "name": "Ana",
  "lastName": "Silva",
  "email": "ana@example.com",
  "phone": "11999999999",
  "role": "Costumer",
  "confirmedEmail": true,
  "address": []
}
```

### `POST /user/interests`

Recebe lista de IDs de produtos e retorna interesses derivados de tags e categorias de lojas.

Request body:

```json
["productId1", "productId2"]
```

Response `200`:

```json
{
  "interest": ["Games", "Notebook"],
  "storeInterests": ["Informática"]
}
```

### `POST /user/update` privado

Atualiza campos enviados no usuário autenticado.

Request body:

```json
{
  "name": "Ana",
  "lastName": "Souza",
  "cpf": "12345678901",
  "birth": "1995-01-10"
}
```

Response `200`:

```text
User data updated
```

### `POST /user/like_store` privado

Alterna curtida em uma loja.

Request body:

```json
{
  "storeId": "storeId"
}
```

Response `200`:

```json
{
  "likes": 12,
  "liked": true
}
```

### `POST /user/address` privado

Salva endereço do usuário e marca como principal.

Request body:

```json
{
  "address": {
    "cep": "01001000",
    "street": "Praça da Sé",
    "number": "100",
    "neighborhood": "Sé",
    "city": "São Paulo",
    "state": "SP",
    "CPF": "12345678901",
    "recieverName": "Ana Silva",
    "nickname": "Casa",
    "country": "Brasil"
  }
}
```

Response `200`:

```text
Address saved successfully
```

### `GET /user/address/set/:address_id` privado

Define o endereço como principal.

Response `200`:

```text
Main address altered successfully
```

### `GET /user/address/delete/:address_id` privado

Remove endereço do usuário.

Response `200`:

```text
Address deleted successfully
```

### `POST /user/cart` privado

Atualiza ou sincroniza carrinho.

Adicionar:

```json
{
  "action": "add",
  "productId": "productId",
  "quantity": 1
}
```

Atualizar quantidade:

```json
{
  "action": "update",
  "productId": "productId",
  "quantity": 2
}
```

Remover:

```json
{
  "action": "remove",
  "productId": ["productId1", "productId2"]
}
```

Sincronizar carrinho local:

```json
{
  "action": "sync",
  "products": [
    { "product": "productId", "quantity": 2 }
  ]
}
```

Response `200` para sync:

```json
{
  "message": "Cart synced successfully",
  "cart": [
    {
      "product": {
        "_id": "productId",
        "title": "Produto",
        "price": 100,
        "discount": 0,
        "thumbnail": "https://..."
      },
      "quantity": 2
    }
  ]
}
```

Response `200` para outras ações:

```text
Cart updated successfully
```

### `GET /user/orders` privado

Lista pedidos do usuário autenticado.

Response `200`: array de pedidos com produtos populados em `items.products.product` contendo `title` e `thumbnail`.

## Backend: Catálogo

### Query filters

Algumas listagens aceitam:

| Query | Descrição |
| --- | --- |
| `search` | Busca em `title` e `tags` |
| `fromDate`, `toDate` | Intervalo por `createdAt` ou `legacyCreatedAt` |
| `fromRating`, `toRating` | Intervalo de avaliação |
| `minPrice`, `maxPrice` | Intervalo de preço |
| `category` | Tag/categoria |
| `title` | Busca por título |
| `sortBy`, `order` | Ordenação, exemplo `sortBy=price&order=1` |
| `from`, `to` | `skip` e `limit` |
| `page` | Página de 30 itens em busca geral |

### `POST /catalog/new-product` privado multipart

Cria produto para a loja do usuário autenticado.

Content-Type: `multipart/form-data`

Campos:

```json
{
  "title": "Notebook X",
  "description": "Descrição do produto",
  "brand": "Marca",
  "model": "Modelo",
  "tags": ["Notebook", "Informática", "Eletrônicos"],
  "genre": "Opcional",
  "features": ["16 GB RAM", "SSD 512 GB"],
  "price": 3999.9,
  "dimensions": {
    "weight": 2.1,
    "height": 10,
    "length": 35,
    "width": 25
  },
  "files[]": ["imagem1", "imagem2"]
}
```

Response `200`:

```text
Product saved successfully
```

### `GET /catalog/all-products/:storeid`

Lista produtos de uma loja. Aceita query filters.

Response `200`:

```json
[
  {
    "_id": "productId",
    "title": "Notebook X",
    "thumbnail": "https://...",
    "brand": "Marca",
    "price": 3999.9,
    "rating": 4.5,
    "sells": 10,
    "discount": 0.1
  }
]
```

### `GET /catalog/product/:productId`

Detalhes do produto.

Response `200`:

```json
{
  "_id": "productId",
  "title": "Notebook X",
  "description": "Descrição",
  "brand": "Marca",
  "model": "Modelo",
  "tags": ["Notebook"],
  "features": ["16 GB RAM"],
  "thumbnail": "https://...",
  "images": ["https://..."],
  "price": 3999.9,
  "discount": 0,
  "rating": 4.5,
  "dimensions": {
    "weight": 2.1,
    "height": 10,
    "length": 35,
    "width": 25
  },
  "store": {
    "_id": "storeId",
    "storeName": "Loja",
    "storeImage": "https://...",
    "likes": 4,
    "rating": [5]
  },
  "ratings": []
}
```

### `GET /catalog/products/search/result`

Busca produtos no catálogo com paginação de 30 itens e query filters.

Exemplo:

```text
/catalog/products/search/result?search=notebook&page=1&sortBy=price&order=1
```

Response `200`:

```json
{
  "products": [],
  "countQuery": 0
}
```

## Backend: Busca

### `GET /search?search=<texto>`

Autocomplete/busca rápida para navbar.

Response `200`:

```json
{
  "products": [
    { "_id": "productId", "title": "Notebook X", "thumbnail": "https://..." }
  ],
  "stores": [
    { "_id": "storeId", "storeName": "Loja", "storeImage": "https://..." }
  ],
  "tags": [
    { "_id": "Notebook" }
  ]
}
```

## Backend: Loja

### `GET /store/my-store` privado

Retorna a loja do usuário autenticado.

Response `200`:

```json
{
  "_id": "storeId",
  "storeImage": "https://...",
  "storeDescription": "Descrição",
  "storeName": "Minha Loja",
  "storeAddress": {},
  "products": [],
  "cpf": "12345678901",
  "cnpj": null,
  "storeBanner": [],
  "categories": [],
  "likes": 0
}
```

### `GET /store/:storename/:storeid`

Retorna uma loja pública por nome e ID.

Response `200`: mesmo formato de `/store/my-store`.

Erros:

```text
No store found, wrong link!
```

```text
Broken link
```

### `POST /store/register-store` privado multipart

Cria loja e altera o usuário para `role: "Seller"`.

Content-Type: `multipart/form-data`

Campos:

```json
{
  "storeName": "Minha Loja",
  "storeDescription": "Descrição da loja",
  "storeCategory": "Informática",
  "storeImage": "arquivo"
}
```

Response `200`:

```text
Store registered succesfully
```

### `POST /store/address` privado

Atualiza endereço da loja.

Request body:

```json
{
  "address": {
    "cep": "01001000",
    "street": "Praça da Sé",
    "number": "100",
    "neighborhood": "Sé",
    "city": "São Paulo",
    "state": "SP",
    "country": "Brasil"
  }
}
```

Response `200`:

```text
Store Address updated
```

### `POST /store/set-id` privado

Salva CPF ou CNPJ da loja.

Request body:

```json
{
  "cpfcnpj": "12345678901"
}
```

Response `200`:

```text
Store id updated
```

Erro:

```json
{
  "Bad Request": "Your id must have 11 for cpf or 14 digits for cnpj"
}
```

### `POST /store/change-banner` privado multipart

Atualiza até 3 imagens do banner.

Campos:

```json
{
  "files[]": ["banner1", "banner2", "banner3"]
}
```

Response `200`:

```text
Banner updated
```

### `POST /store/change-image` privado multipart

Atualiza logo/imagem da loja.

Campos:

```json
{
  "file": "imagem"
}
```

Response `200`:

```text
Store logo updated
```

### `GET /store/my-products` privado

Lista produtos da loja autenticada. Aceita query filters.

Response `200`: array de produtos com `title`, `thumbnail`, `brand`, `price`, `rating`, `sells`, `sellsToday` e `discount`.

### `POST /store/my-store/delete-products` privado

Remove produtos da loja e apaga imagens no S3.

Request body:

```json
{
  "productIDs": ["productId1", "productId2"]
}
```

Response `200`:

```text
Products deleted successfully
```

### `POST /store/my-store/discount-products` privado

Aplica desconto aos produtos selecionados.

Request body:

```json
{
  "productIDs": ["productId1"],
  "discount": 0.15
}
```

Response `200`:

```text
Discount added
```

### `POST /store/get-carousel-images`

Busca banners de lojas relevantes para carrossel da home.

Request body:

```json
{
  "storeInterests": ["Informática"],
  "interest": ["Notebook", "Games"]
}
```

Response `200`:

```json
{
  "carouselImages": ["https://..."],
  "storeInfo": [
    { "name": "Loja", "image": "https://...", "id": "storeId" }
  ]
}
```

### `GET /store/my-store/orders` privado

Lista pedidos que possuem itens da loja autenticada.

Response `200`: array de pedidos com item da loja, status, usuário, `order_number` e `createdAt`.

### `GET /store/my-store/orders/:order_id` privado

Detalhes de um pedido para a loja autenticada.

Response `200`: pedido com item da loja, usuário, endereço e produtos populados.

### `POST /store/my-store/order/status` privado

Aceita ou rejeita pedido da loja.

Request body:

```json
{
  "order_id": "orderId",
  "action": "accept"
}
```

Valores:

- `accept`: define `shipment_status` como `PREPARING_SHIPMENT`.
- `reject`: define `shipment_status` como `CANCELLED`.

Response `200`:

```text
Order status updated
```

### `POST /store/my-store/order/shipment-tracking-code` privado

Salva código de rastreio e marca item da loja como enviado.

Request body:

```json
{
  "order_id": "orderId",
  "tracking_code": "PC123456789BR"
}
```

Response `200`:

```text
Tracking code updated
```

## Backend: Frete

### `GET /frete:storeId`

Redireciona para autorização OAuth do Melhor Envio sandbox.

Query usada pelo controlador:

```text
?storeId=<storeUserId>
```

Response: redirect `301` para `https://sandbox.melhorenvio.com.br/oauth/authorize`.

Observação: a rota está declarada como `/frete:storeId`, mas o controlador lê `req.query.storeId`. No frontend atual a chamada é montada como `/frete&storeId=...`, o que merece revisão antes de usar em produção.

### `GET /frete/callback`

Callback OAuth do Melhor Envio.

Query:

```text
?code=<authorizationCode>&state=<storeUserId>
```

Response `200`: script HTML redirecionando para `ORIGIN`.

### `POST /shipment-calculate` privado

Calcula frete por produto avulso ou pelo carrinho do usuário.

Request body para produto avulso:

```json
{
  "to": "01001000",
  "id": "productId"
}
```

Request body para carrinho:

```json
{
  "to": "01001000"
}
```

Se `to` não for enviado, retorna os itens agrupados por loja sem cotação de frete.

Response `200`:

```json
[
  {
    "store": {
      "_id": "storeId",
      "storeAddress": "01001000",
      "storeName": "Loja",
      "storeImage": "https://..."
    },
    "products": [
      {
        "product": {
          "_id": "productId",
          "title": "Produto",
          "thumbnail": "https://...",
          "price": 100,
          "discount": 0,
          "dimensions": {
            "weight": 1,
            "height": 10,
            "length": 20,
            "width": 15
          }
        },
        "quantity": 1
      }
    ],
    "shipment": [],
    "shipment_hash": "<encryptedShipmentOptions>"
  }
]
```

`shipment_hash` é usado depois em `/order/create` para validar que o método de envio escolhido veio da cotação.

## Backend: Pedidos e Pagamentos

### Status de pedido/envio usados

- `PENDING_PAYMENT`
- `PAYMENT_PROCESSING`
- `PAYMENT_APPROVED`
- `CANCELED`
- `PREPARING_SHIPMENT`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

Observação: há grafias diferentes no código (`CANCELED` no job automático e `CANCELLED` na rejeição do vendedor).

### `POST /order/create` privado

Valida endereço, loja/produtos, método de envio e cria pedido. Depois redireciona internamente para criação de Payment Intent.

Request body:

```json
{
  "order": {
    "address": "addressId",
    "items": [
      {
        "store": { "_id": "storeId" },
        "products": [
          {
            "product": { "_id": "productId" },
            "quantity": 1
          }
        ],
        "shipment": {
          "id": 1,
          "name": "PAC",
          "custom_price": "20.00",
          "discount": "0.00"
        },
        "shipment_hash": "<encryptedShipmentOptions>"
      }
    ]
  }
}
```

Response `200`:

```json
{
  "client_secret": "<stripeClientSecret>",
  "order_id": "orderId",
  "amount": "4199.90"
}
```

Erros:

```text
Invalid order
Invalid address
Invalid store
Invalid shipment
```

### `GET /order/payment_intents/:orderId` privado

Cria Payment Intent no Stripe para um pedido.

Response `200`:

```json
{
  "client_secret": "<stripeClientSecret>",
  "order_id": "orderId",
  "amount": "4199.90"
}
```

### `GET /order/retrieve/:orderId` privado

Busca pedido do usuário autenticado.

Response `200`: pedido com lojas e produtos populados.

Erro se o pedido não pertencer ao usuário:

```text
Unauthorized user
```

### `GET /order/payment_status/:payment_intent` privado

Busca Payment Intent no Stripe e redireciona para `/order/retrieve/:orderId`.

Response: redirect interno.

### `GET /order/payment/:payment_intent` privado

Retorna `client_secret` de um Payment Intent, após validar dono do pedido.

Response `200`:

```json
{
  "client_secret": "<stripeClientSecret>"
}
```

### `POST /order/received` privado

Cliente marca envio de uma loja como recebido.

Request body:

```json
{
  "orderId": "orderId",
  "storeId": "storeId"
}
```

Response `200`:

```text
Order marked as delivered
```

Erros:

```text
Order not found
Payment not approved
Unauthorized user
```

### `GET /order/rate/:store_id/:order_id` privado

Retorna produtos de uma loja dentro de um pedido para avaliação.

Response `200`: pedido com `items.products.product` contendo `title`, `thumbnail`, `rating` e loja com `storeName` e `storeImage`.

## Backend: Avaliações

### `POST /rating` privado

Avalia produtos e loja de um pedido. A rota executa primeiro `rateProduct` e depois `rateStore`.

Request body:

```json
{
  "orderId": "orderId",
  "storeId": "storeId",
  "storeRating": 4.5,
  "ratings": [
    {
      "product": "productId",
      "title": "Muito bom",
      "comment": "Atendeu as expectativas.",
      "rating": 5
    }
  ]
}
```

Response `200`:

```text
Success
```

Erros:

```text
Order not found
Already rated
Error posting comment
```

## Backend: Stripe Webhook

### `POST /webhook`

Recebe eventos Stripe com body raw.

Headers:

```http
stripe-signature: <signature>
```

Response `200`:

```json
{
  "recieved": true
}
```

Eventos tratados:

- `payment_intent.created`: salva `payment_intent` no pedido.
- `payment_intent.processing`: muda status para `PAYMENT_PROCESSING`.
- `payment_intent.succeeded`: muda status para `PAYMENT_APPROVED` e incrementa vendas dos produtos.

Erro de assinatura:

```text
Webhook Error: <message>
```

## Backend: Jobs Agendados

- Todos os dias às `00:00`: zera `sellsToday` dos produtos.
- A cada 3 horas: cancela pedidos `PENDING_PAYMENT` criados há mais de 3 dias, mudando status para `CANCELED`.

## Backend: Modelos

### User

Campos principais: `name`, `lastName`, `password`, `auth_method`, `email`, `cpf`, `birth`, `phone`, `address`, `role`, `confirmedEmail`, `refreshTokens`, `customerId`, `gid`, `store`, `saved_stores`, `cart`, `ratings`, `orders`.

Coleção: `Users`.

### Store

Campos principais: `storeName`, `storeDescription`, `storeImage`, `storeCategory`, `storeBanner`, `phone`, `cnpj`, `cpf`, `storeAddress`, `user`, `products`, `orders`, `categories`, `likes`, `rating`, `melhorEnvios`.

Coleção: `Stores`.

### Product

Campos principais: `title`, `description`, `brand`, `model`, `tags`, `genre`, `color`, `features`, `thumbnail`, `images`, `price`, `store`, `rating`, `ratings`, `sells`, `sellsToday`, `discount`, `dimensions`.

Coleção: `Catalog`.

### Order

Campos principais: `status`, `user`, `address`, `payment_intent`, `order_number`, `items`.

Cada item contém `products`, `store`, `shipment`, `shipment_status`, `shipment_track_code`, `shipment_date`, `rated`.

Coleção: `Orders`.

### Address

Campos principais: `cep`, `street`, `number`, `neighborhood`, `city`, `state`, `CPF`, `nickname`, `recieverName`, `country`, `user`, `main`.

Coleção: `Adressess`.

### Rating

Campos principais: `product`, `title`, `comment`, `user`, `images`, `rating`.

Coleção: `Ratings`.

### Cliente HTTP

Arquivos principais:

- `src/hooks/useApi.js`: cria instância Axios, injeta `Authorization: Bearer <token>` e tenta refresh automático em `401`.
- `src/hooks/useFetchApi.js`: hook genérico para GET/POST, monta URL com `VITE_API_URL`.
- `src/hooks/useLogOut.js`: chama `/auth/logout`, limpa localStorage e redireciona para `/`.
- `src/hooks/useCart.js`: gerencia carrinho em `localStorage` e sincroniza com `/user/cart`.

### Variáveis do Frontend

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_DOMAIN=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=...
STRIPE_KEY=pk_test_...
```

### Rotas Públicas

| Rota | Componente | Descrição |
| --- | --- | --- |
| `/` | `Pages/Index.jsx` | Home, interesses e carrossel de lojas |
| `/login` | `Pages/LoginForm.jsx` | Login com e-mail/senha ou Google |
| `/signup` | `Pages/RegisterForm.jsx` | Cadastro de usuário |
| `/register/user/verify` | `Pages/VerificationPage.jsx` | Tela de verificação de e-mail |
| `/termsandconditions` | `Pages/Terms.jsx` | Termos |
| `/privacypolicy` | `Pages/PrivacyPolicy.jsx` | Política de privacidade |
| `/store/:storeName/:storeId` | `Pages/Store/MyStore.jsx` | Página pública da loja |
| `/catalog/:productName/:productId` | `Pages/Catalog/ProductPage.jsx` | Página do produto |
| `/catalog/products/search/result` | `Pages/Catalog/SearchResult.jsx` | Resultado de busca |

### Rotas Privadas

Exigem `localStorage.accessToken` e usuário válido retornado por `/user`.

| Rota | Componente | Descrição |
| --- | --- | --- |
| `/user/profile` | `Pages/User/ProfilePage.jsx` | Dados pessoais |
| `/user/address` | `Pages/User/Address.jsx` | Lista de endereços |
| `/user/new-address` | `components/shared/AddressForm.jsx` | Novo endereço |
| `/user/security` | `Pages/User/Security.jsx` | Segurança |
| `/user/your-orders` | `Pages/User/YourOrders/YourPurchases.jsx` | Pedidos do usuário |
| `/user/your-orders/:order_id` | `Pages/User/YourOrders/OrderDetails.jsx` | Detalhes do pedido |
| `/store` | `Pages/Store/Store.jsx` | Área do vendedor |
| `/store/signup` | `Pages/Store/RegisterStore.jsx` | Cadastro de loja |
| `/store/my-store` | `Pages/Store/MyStore.jsx` | Minha loja |
| `/store/my-store/address` | `AddressForm` | Endereço da loja |
| `/store/new-product` | `Pages/Store/NewProduct.jsx` | Cadastro de produto |
| `/store/my-products` | `Pages/Store/MyProducts.jsx` | Gerenciamento de produtos |
| `/store/my-store/orders` | `Pages/Store/Orders/Orders.jsx` | Pedidos recebidos pela loja |
| `/store/my-store/orders/:order_id` | `Pages/Store/Orders/Details.jsx` | Detalhes do pedido recebido |
| `/rating/:store_id/:order_id` | `Pages/Rating.jsx` | Avaliação de compra |
| `/checkout/:id` | `Pages/Checkout/ReviewCart.jsx` | Revisão de carrinho ou compra direta |
| `/checkout/payment/:client_secret/:order_id` | `Pages/Checkout/Checkout.jsx` | Pagamento Stripe |
| `/checkout/post-checkout` | `Pages/Checkout/PostCheckout.jsx` | Pós-checkout |

### Fluxos do Frontend

#### Cadastro e Login

1. Cadastro envia `POST /auth/register`.
2. Login envia `POST /auth/login` ou `POST /auth/login/google`.
3. Token de acesso é salvo em `localStorage.accessToken`.
4. Cookie `refreshToken` fica sob controle do backend.
5. Carrinho local é sincronizado por `POST /user/cart` com `action: "sync"`.

#### Carrinho e Checkout

1. Carrinho é mantido em `localStorage.cart`.
2. Usuário revisa compra em `/checkout/review-cart` ou `/checkout/:productId`.
3. Frontend chama `POST /shipment-calculate`.
4. Usuário escolhe frete por loja.
5. Frontend chama `POST /order/create`.
6. API cria pedido e Payment Intent.
7. Frontend vai para `/checkout/payment/:client_secret/:order_id`.
8. Stripe confirma pagamento.
9. Webhook atualiza status do pedido.

#### Loja e Produtos

1. Vendedor cria loja em `/store/signup` via `POST /store/register-store`.
2. Endereço da loja é enviado para `POST /store/address`.
3. Produto é criado em `/store/new-product` via `POST /catalog/new-product` com multipart.
4. Produtos podem ser filtrados, excluídos e receber desconto em `/store/my-products`.
5. Banner e logo são atualizados por `/store/change-banner` e `/store/change-image`.

#### Pedidos da Loja

1. Vendedor lista pedidos em `/store/my-store/orders`.
2. Detalhes vêm de `/store/my-store/orders/:order_id`.
3. Após pagamento aprovado, vendedor aceita ou rejeita com `/store/my-store/order/status`.
4. Quando o pedido é enviado, vendedor salva rastreio com `/store/my-store/order/shipment-tracking-code`.

#### Avaliações

1. Usuário abre `/rating/:store_id/:order_id`.
2. Frontend busca produtos avaliáveis com `GET /order/rate/:store_id/:order_id`.
3. Envia avaliações com `POST /rating`.

### Integrações Externas no Frontend

- `viacep.com.br`: consulta CEP e busca CEP por endereço.
- `brasilapi.com.br`: lista UFs e municípios.
- Google OAuth: login social.
- Stripe Elements: tela de pagamento.

## Deploy

### Backend na Vercel

`backend/vercel.json` direciona todas as rotas para `index.js` usando `@vercel/node`.

Configure as variáveis de ambiente do backend na Vercel.

### Frontend na Vercel

`WebStoreF/vercel.json` reescreve todas as rotas para `/`, permitindo React Router em SPA.

Configure as variáveis `VITE_*` e `STRIPE_KEY` no ambiente de build.

## Pontos de Atenção

- O backend exige cookies `secure: true`; em local HTTP o refresh token pode não persistir no navegador.
- A rota de verificação de e-mail enviada no e-mail usa query string, mas a API implementada usa path params.
- A rota de Melhor Envio está declarada como `/frete:storeId`, enquanto o controlador lê `req.query.storeId` e o frontend monta `/frete&storeId=...`.
- Não há suíte de testes configurada.
- `STRIPE_KEY` no frontend deve ser chave publicável (`pk_...`), enquanto no backend deve ser chave secreta (`sk_...`).
- O status cancelado aparece como `CANCELED` e `CANCELLED` em pontos diferentes.
