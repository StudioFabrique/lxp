#!/bin/bash
# generate-mtls-certs-fixed.sh

echo "🔧 Génération des certificats mTLS (version corrigée)..."

# Nettoyage
rm -f *.pem *.csr *.cnf *.srl

# 1. CA
echo "📜 Génération de la CA..."
openssl genrsa -out ca-key.pem 4096
openssl req -new -x509 -days 365 -key ca-key.pem -sha256 -out ca-cert.pem \
  -subj "/C=FR/ST=IDF/L=Paris/O=Dev/CN=localhost-ca"

# 2. Certificat serveur FastAPI
echo "🖥️  Certificat serveur FastAPI..."
openssl genrsa -out fastapi-server-key.pem 4096
openssl req -subj "/C=FR/ST=IDF/L=Paris/O=Dev/CN=fastapi-server" \
  -sha256 -new -key fastapi-server-key.pem -out fastapi-server.csr

# ✅ Configuration serveur CORRIGÉE
cat > fastapi-server-extfile.cnf << EOF
subjectAltName = DNS:localhost,DNS:fastapi,IP:127.0.0.1
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
basicConstraints = CA:FALSE
EOF

openssl x509 -req -days 365 -sha256 -in fastapi-server.csr -CA ca-cert.pem -CAkey ca-key.pem \
  -out fastapi-server-cert.pem -extfile fastapi-server-extfile.cnf -CAcreateserial

# 3. Certificat client Node.js  
echo "🔑 Certificat client Node.js..."
openssl genrsa -out node-client-key.pem 4096
openssl req -subj "/C=FR/ST=IDF/L=Paris/O=Dev/CN=node-client" \
  -new -key node-client-key.pem -out node-client.csr

# ✅ Configuration client CORRIGÉE
cat > node-client-extfile.cnf << EOF
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth
basicConstraints = CA:FALSE
EOF

openssl x509 -req -days 365 -sha256 -in node-client.csr -CA ca-cert.pem -CAkey ca-key.pem \
  -out node-client-cert.pem -extfile node-client-extfile.cnf -CAcreateserial

# 4. Optionnel : Node serveur
echo "🌐 Certificat serveur Node.js (optionnel)..."
openssl genrsa -out node-server-key.pem 4096
openssl req -subj "/C=FR/ST=IDF/L=Paris/O=Dev/CN=node-server" \
  -sha256 -new -key node-server-key.pem -out node-server.csr

cat > node-server-extfile.cnf << EOF
subjectAltName = DNS:localhost,DNS:node-api,IP:127.0.0.1
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
basicConstraints = CA:FALSE
EOF

openssl x509 -req -days 365 -sha256 -in node-server.csr -CA ca-cert.pem -CAkey ca-key.pem \
  -out node-server-cert.pem -extfile node-server-extfile.cnf -CAcreateserial

# Nettoyage
rm -f *.csr *.cnf
chmod 600 *-key.pem

echo "✅ Certificats corrigés générés !"

# Vérification des certificats
echo ""
echo "🔍 Vérification des certificats..."
echo "Serveur FastAPI:"
openssl x509 -in fastapi-server-cert.pem -noout -text | grep -A1 "X509v3 Key Usage"
echo ""
echo "Client Node.js:"  
openssl x509 -in node-client-cert.pem -noout -text | grep -A1 "X509v3 Key Usage"