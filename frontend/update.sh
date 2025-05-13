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

# Atualizando frontend
echo "Updating frontend dependencies and building...";
pwd;
rm -rf node_modules;
rm -rf build;
npm cache clean --force;
npm install --legacy-peer-deps;
# npm install;
npm run build;
echo "Frontend updated successfully.";

# Reiniciando serviço
if pm2 restart WhaticketSaas-frontend; then
    echo "Services restarted successfully.";
else
    echo "Error restarting services. Please check your PM2 configuration.";
    exit 1
fi
echo "Whaticket update process completed successfully.!";
