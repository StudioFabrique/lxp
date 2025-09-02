# start-dev.sh
#!/bin/bash
echo "🚀 Starting FastAPI with mTLS..."

uvicorn app.main:app \
  --host 127.0.0.1 \
  --port 8443 \
  --ssl-keyfile ./certs/fastapi-server-key.pem \
  --ssl-certfile ./certs/fastapi-server-cert.pem \
  --ssl-ca-certs ./certs/ca-cert.pem \
  --ssl-cert-reqs 2
  --log-level debug