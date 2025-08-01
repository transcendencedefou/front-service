#!/bin/sh

# Attendre que les services backend soient prêts
echo "Attente des services backend..."

# Attendre le gateway-service
until nc -z gateway-service 3003; do
  echo "En attente du gateway-service..."
  sleep 2
done

echo "Gateway-service prêt!"

# Démarrer le serveur de développement
echo "Démarrage en mode développement..."
npm run dev -- --host 0.0.0.0
