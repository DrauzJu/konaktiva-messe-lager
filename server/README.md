# Notes

Auth: TLS Client Auth

```
# require a client certificate which has to be directly
# signed by our CA certificate in ca.crt
SSLVerifyClient require
SSLVerifyDepth 1
SSLCACertificateFile "conf/ssl.crt/ca.crt"

RequestHeader set Client-Cert-Subject "%{SSL_CLIENT_S_DN}s"
```

## Create CA
### Privage Key for CA
openssl genrsa -aes256 -out ca-key.pem 2048
### Create CA root cert: 10 Jahre
openssl req -x509 -new -nodes -extensions v3_ca -key ca-key.pem -days 3650 -out ca-root.pem -sha512
### Private key for client cert
openssl genrsa -out client-cert-key.pem 4096
### Create client cert signing request (CSR)
openssl req -new -key client-cert-key.pem -out client-cert.csr -sha512
### Create client cert (by let CA sign CSR)
openssl x509 -req -in client-cert.csr -CA ca-root.pem -CAkey ca-key.pem -CAcreateserial -out client-cert-pub.pem -days 3650 -sha512

# Configuration

```bash
cp .env.test .env
# Edit .env file!
```

# Install dependencies & Build

```bash
yarn
yarn build
```

# Database migration

```bash
yarn build
yarn typeorm migration:generate -d dist/typeorm.config.js ./src/migrations/MyMigration
yarn build
yarn typeorm migration:run -d dist/typeorm.config.js
```

# Start

```bash
yarn start
yarn start:dev
```

# Run temporary test DB

```bash
docker run -d --rm -p 3306:3306 -e MYSQL_DATABASE=db1 -e MYSQL_ROOT_PASSWORD=abc123 mysql:8
```