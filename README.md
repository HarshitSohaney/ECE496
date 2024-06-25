# ECE496

### Testing with an https server

1. install http-server
	`npm install -g http-server`

2. Generate a private key
    `openssl genrsa -out key.pem 2048`

3. Generate certificates
	`openssl req -new -x509 -key key.pem -out cert.pem -days 365`

4. Start the server locally
	`http-server -S -C cert.pem -K key.pem -p 8000`

5. Access the server on your mobile device

	Go to the ip address displayed (something like https://192.60.112.123:8000 in the terminal) on your device browser. Ignore the warnings about the certificate.