#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${1:-}"
JWT_SECRET="${2:-}"

if [ -z "$DOMAIN" ]; then
  echo "Usage: ./deploy/setup.sh <domain> [jwt_secret]"
  echo "  <domain>     Your domain (e.g., moncv.example.com)"
  echo "  [jwt_secret] Optional JWT secret (auto-generated if omitted)"
  exit 1
fi

if [ -z "$JWT_SECRET" ]; then
  JWT_SECRET=$(openssl rand -hex 32)
  echo "Generated JWT_SECRET: $JWT_SECRET"
fi

echo "=== Installing Docker if not present ==="
if ! command -v docker &>/dev/null; then
  apk add docker docker-compose 2>/dev/null || {
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker "$USER"
  }
fi

echo "=== Cloning or pulling repo ==="
if [ -d MonCV ]; then
  cd MonCV && git pull
else
  git clone https://github.com/Youmelous/MonCV.git
  cd MonCV
fi

echo "=== Generating nginx config with domain ==="
sed "s/server_name _;/server_name $DOMAIN;/" deploy/nginx.conf > deploy/nginx.conf.tmp
mv deploy/nginx.conf.tmp deploy/nginx.conf

echo "=== Starting app (without SSL) ==="
JWT_SECRET=$JWT_SECRET docker compose -f docker-compose.prod.yml up -d moncv nginx

echo ""
echo "=== Setup complete ==="
echo "  App running at: http://$DOMAIN"
echo ""
echo "To enable HTTPS with Let's Encrypt:"
echo "  docker compose -f docker-compose.prod.yml run --rm certbot \\"
echo "    certonly --webroot -w /var/www/certbot -d $DOMAIN"
echo ""
echo "Then uncomment the SSL server block in deploy/nginx.conf and restart:"
echo "  docker compose -f docker-compose.prod.yml restart nginx"
