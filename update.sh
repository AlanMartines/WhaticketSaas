#!/bin/bash

# Variáveis
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"

echo "Starting Whaticket update process, please wait...";

# Atualizando repositório
echo "Pulling the latest changes from Git...";
if git pull; then
    echo "Repository updated successfully.";
else
    echo "Error updating repository. Please check your Git configuration.";
    exit 1
fi

# Atualizando backend
if [ -d "$BACKEND_DIR" ]; then
    echo "Updating backend dependencies and building...";
    cd "$BACKEND_DIR";
    pwd;
    rm -rf node_modules;
    rm -rf dist;
    npm cache clean --force;
    # npm install --legacy-peer-deps;
    npm install;
    npm run build;
    npx sequelize db:migrate;
    npx sequelize db:seed;
    cd ..;
    pwd;
    echo "Backend updated successfully.";
else
    echo "Backend directory '$BACKEND_DIR' not found. Skipping backend update.";
    exit 1
fi

# Atualizando frontend
if [ -d "$FRONTEND_DIR" ]; then
    echo "Updating frontend dependencies and building...";
    cd "$FRONTEND_DIR";
    pwd;
    rm -rf node_modules;
    rm -rf build;
    npm cache clean --force;
    # npm install --legacy-peer-deps;
    npm install;
    npm run build;
    cd ..;
    pwd;
    echo "Frontend updated successfully.";
else
    echo "Frontend directory '$FRONTEND_DIR' not found. Skipping frontend update.";
    exit 1
fi

# Reiniciando serviços
echo "Restarting services with PM2...";
if pm2 restart WhaticketSaas-BACKEND; then
    echo "Services BACKEND restarted successfully.";
else
    echo "Error restarting BACKEND services. Please check your PM2 configuration.";
    exit 1
fi

if pm2 restart WhaticketSaas-FRONTEND; then
    echo "Services FRONTEND restarted successfully.";
else
    echo "Error restarting FRONTEND services. Please check your PM2 configuration.";
    exit 1
fi
echo "Whaticket update process completed successfully.!";
