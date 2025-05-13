#!/bin/bash

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
echo "Updating backend dependencies and building...";
pwd;
rm -rf node_modules;
rm -rf dist;
npm cache clean --force;
# npm install --legacy-peer-deps;
npm install;
npm run build;
npx sequelize db:migrate;
npx sequelize db:seed;
echo "Backend updated successfully.";

# Reiniciando serviço
echo "Restarting services with PM2...";
if pm2 restart WhaticketSaas-backend; then
    echo "Services restarted successfully.";
else
    echo "Error restarting services. Please check your PM2 configuration.";
    exit 1
fi

echo "Whaticket update process completed successfully.!";
