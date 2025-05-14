# WhaTicket SaaS - Módulo Kanban, Modo Noturno e Integrações

🗣️ **DialogFlow**</br>
🔄 **N8N**</br>
🌐 **WebHooks**</br>
🤖 **TypeBot**</br>
💬 **ChatGPT**</br>

## Deploy em Ubuntu/Debian (Recomendado Debian)

### 1. Atualizar pacotes e instalar dependências essenciais:

```bash
apt update && \
apt upgrade -y && \
apt install -y git curl yarn gcc g++ make libgbm-dev wget unzip ffmpeg imagemagick unoconv sox \
fontconfig locales gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
libexpat1 libfontconfig1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
ca-certificates fonts-liberation libnss3 lsb-release xdg-utils libatk-bridge2.0-0 libgbm1 \
libgcc1 build-essential nodejs libappindicator1 sudo
```

### 2. Instalar o pacote `build-essential`:

```bash
apt install build-essential
```

### 3. Atualizar pacotes do sistema:

```bash
apt update && apt upgrade -y
```

### 4. Instalar o Node.js e confirmar as versões:

```bash
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.profile
nvm ls-remote
nvm install v22.15.0
node -v
npm -v
```

### 5. Trocar versão do Node.js:

```bash
nvm ls-remote
nvm install v20.19.1
node -v
npm -v
```

### 6. Instalar o Docker e adicionar seu usuário ao grupo Docker:

#### Adicionar repositório Docker:

```bash
# Adicionar chave GPG oficial do Docker:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Adicionar repositório à lista de fontes do Apt:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

#### Instalar pacotes do Docker:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker ${USER}
```

### 7. Instalar o Postgres Docker:

```bash
docker run -e TZ="America/Sao_Paulo" --name dbWhaticketSaas -e POSTGRES_USER=whaticket -e POSTGRES_PASSWORD=Suasenha -e POSTGRES_DB=dbWhaticketSaas -p 5432:5432 -d --restart=always -v /usr/local/dbWhaticketSaas/data:/var/lib/postgresql/data -d postgres:latest
```

### 8. Instalar o Redis Docker:

```bash
docker run -e TZ="America/Sao_Paulo" --name redisWhaticketSaas -p 6379:6379 -d --restart=always redis:latest redis-server --appendonly yes --requirepass "suaSenha"
```

### 9. Clonar o repositório:

```bash
cd ~
git clone https://github.com/AlanMartines/WhaticketSaas.git
```

### 10. Criar e editar o arquivo `.env` do backend:

```bash
cd WhaticketSaas/backend/
cp .env.example .env
vim .env
```

Preencha o arquivo `.env` com as informações corretas para o ambiente de execução, banco de dados, JWT, Redis e configurações de e-mail.

### 11. Instalar dependências do backend, criar o build e rodar as migrações:

```bash
cd WhaticketSaas/backend
npm install
npm run build
npm run db:migrate
npm run db:seed
```

### 12. Instalar dependências do frontend:

```bash
cd ../frontend
cp .env.example .env
vim .env
```

Edite o arquivo `.env` com as configurações corretas para o frontend, incluindo as URLs do backend, cores e outras configurações de sistema.

```bash
npm install
npm run build
```

### 13. Instalar o pm2 e iniciar o backend e frontend:

```bash
sudo npm install -g pm2

cd ../backend
pm2 start dist/server.js --name WhaticketSaas-backend
cd ../frontend
pm2 start server.js --name WhaticketSaas-frontend
```

### 14. Configurar o pm2 para reiniciar após a reinicialização:

```bash
pm2 startup
```

### 15. Instalar e configurar o Nginx:

```bash
sudo apt install nginx
sudo rm /etc/nginx/sites-enabled/default
```

#### Criar o arquivo de configuração para o Backend:

```bash
sudo nano /etc/nginx/conf.d/WhaticketSaas-backend
```

Exemplo de configuração:

```nginx
server {
  server_name api.mydomain.com;
  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
  }
}
```

#### Criar o arquivo de configuração para o Frontend:

```bash
sudo nano /etc/nginx/conf.d/WhaticketSaas-frontend
```

Exemplo de configuração:

```nginx
server {
  server_name app.mydomain.com;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
  }
}
```

### 16. Configurar o Nginx para aceitar uploads maiores (até 20MB):

```bash
sudo nano /etc/nginx/nginx.conf
```

Altere para:

```nginx
http {
  ...
  client_max_body_size 1024M;  # HANDLE BIGGER UPLOADS
}
```

#### Testar e reiniciar o Nginx:

```bash
sudo nginx -t
sudo service nginx restart
```

### 17. Instalar SSL (HTTPS) usando Certbot:

```bash
sudo apt install certbot python3-certbot-nginx
```

#### Criar o certificado SSL:

```bash
sudo certbot certonly --nginx --register-unsafely-without-email -d <domain>
```

### 18. URL do Webhook do Meta:

```bash
https://api.seudominio.com.br/webhook/fb
```

---

## Creditos

* [WhaticketSaas](https://github.com/Leandroledledled/WhaticketSaas) de Leandroledledled.
* [WhaticketSaas](https://github.com/danilorcte/whaticketsaas) de danilorcte.
* [WhaticketSaas](https://github.com/rengawms/whaticketSaaS) de rengawms.
* [WhaticketSaas](https://github.com/launcherbr/whaticketsaasfree) de launcherbr.
