# Blackjack.js Backend

Express/MongoDB backend for my blackjack app.

# Setup

### Install dependencies

```sh
$ npm install
```

### Setup environment variables

Create `config.env` inside the `config` folder.

| VARIABLES         | VALUES                    | RECOMMENDED      |
| ----------------- | ------------------------- | ---------------- |
| MONGO_URI         | MongoDB connection string |
| JWT_SECRET        | JsonWebToken secret       |
| JWT_EXPIRE        | Json web token duration   | 30d              |
| JWT_COOKIE_EXPIRE | JWT cookie duration       | 30               |
| NODE_ENV          | Environnement             | development      |
| PORT              | Server port               |                  |
| FILE_UPLOAD_PATH  | File upload directory     | ./public/uploads |
| MAX_FILE_UPLOAD   | File upload size limit    | 1000000          |
| SMTP_HOST         | SMTP host                 |                  |
| SMTP_PORT         | SMTP port                 |                  |
| SMTP_EMAIL        | Your email                |                  |
| SMTP_PASSWORD     | Your password             |                  |
| FROM_EMAIL        | From email                |                  |
| FROM_NAME         | From name                 |                  |
