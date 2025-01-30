#!/bin/bash

# Configurações
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"

# Cores para saída no terminal
GREEN="\e[32m"
YELLOW="\e[33m"
RED="\e[31m"
NC="\e[0m" # Sem cor

echo -e "${YELLOW}Starting Whaticket update process...${NC}\n"

# Função para verificar e atualizar um diretório
update_project() {
    local dir="$1"
    local name="$2"

    if [ -d "$dir" ]; then
        echo -e "${YELLOW}Updating $name...${NC}"
        cd "$dir" || exit 1

        # Instalar dependências
        if npm install; then
            echo -e "${GREEN}Dependencies installed successfully.${NC}"
        else
            echo -e "${RED}Error installing dependencies for $name.${NC}"
            exit 1
        fi

        # Remover diretórios desnecessários
        rm -rf dist build

        # Construir o projeto
        if npm run build; then
            echo -e "${GREEN}$name built successfully.${NC}"
        else
            echo -e "${RED}Error building $name.${NC}"
            exit 1
        fi

        cd - > /dev/null
    else
        echo -e "${RED}Directory '$dir' not found. Skipping $name update.${NC}"
        exit 1
    fi
}

# Atualizar repositório
echo -e "${YELLOW}Pulling the latest changes from Git...${NC}"
if git pull; then
    echo -e "${GREEN}Repository updated successfully.${NC}\n"
else
    echo -e "${RED}Error updating repository. Check your Git configuration.${NC}"
    exit 1
fi

# Atualizar backend
update_project "$BACKEND_DIR" "Backend"

# Rodar migrações e seeders do banco de dados
echo -e "${YELLOW}Applying database migrations and seeders...${NC}"
cd "$BACKEND_DIR" || exit 1
if npx sequelize db:migrate && npx sequelize db:seed; then
    echo -e "${GREEN}Database updated successfully.${NC}\n"
else
    echo -e "${RED}Error applying database migrations and seeders.${NC}"
    exit 1
fi
cd - > /dev/null

# Atualizar frontend
update_project "$FRONTEND_DIR" "Frontend"

# Reiniciar serviços com PM2
echo -e "${YELLOW}Restarting services with PM2...${NC}"
if pm2 restart all; then
    echo -e "${GREEN}Services restarted successfully.${NC}\n"
else
    echo -e "${RED}Error restarting services. Check your PM2 configuration.${NC}"
    exit 1
fi

echo -e "${GREEN}Whaticket update process completed successfully. Enjoy! 🚀${NC}"
