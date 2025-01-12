# WhaTicket 2024 Versão Atualizada Saas - Módulo Kanban, Modo Noturno e as seguintes integrações:</br>

🗣️ DialogFlow</br>
🔄 N8N</br>
🌐 WebHooks</br>
🤖 TypeBot</br>
💬 ChatGPT</br>

#### Deploy Ubuntu 22.x

```bash
sudo apt update && \
apt upgrade -y && \
apt install -y \
git \
curl \
yarn \
gcc \
g++ \
make \
libgbm-dev \
wget \
unzip \
ffmpeg \
imagemagick \
unoconv \
sox \
fontconfig \
locales \
gconf-service \
libasound2 \
libatk1.0-0 \
libc6 \
libcairo2 \
libcups2 \
libdbus-1-3 \
libexpat1 \
libfontconfig1 \
libgconf-2-4 \
libgdk-pixbuf2.0-0 \
libglib2.0-0 \
libgtk-3-0 \
libnspr4 \
libpango-1.0-0 \
libpangocairo-1.0-0 \
libstdc++6 \
libx11-6 \
libx11-xcb1 \
libxcb1 \
libxcomposite1 \
libxcursor1 \
libxdamage1 \
libxext6 \
libxfixes3 \
libxi6 \
libxrandr2 \
libxrender1 \
libxss1 \
libxtst6 \
ca-certificates \
fonts-liberation \
libnss3 \
lsb-release \
xdg-utils \
libatk-bridge2.0-0 \
libgbm1 \
libgcc1 \
build-essential \
nodejs \
libappindicator1 \
sudo
```

#### Instalar o pacote  build-essential:

```bash
sudo apt-get install build-essential
```

```bash
sudo apt update && sudo apt upgrade -y
```

#### Instale o node (20.x) e confirme se o comando do node -v e npm -v está disponível:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs
node -v
npm -v
```


#### Instale o docker e adicione seu usuário ao grupo do docker:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh

sudo sh get-docker.sh

sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo usermod -aG docker ${USER}
```

#### Instalar o Postgres Docker 

```bash
docker run -e TZ="America/Sao_Paulo" --name dbwhaticket -e POSTGRES_USER=whaticket -e POSTGRES_PASSWORD=Suasenha -e POSTGRES_DB=dbwhaticket -p 5432:5432 -d --restart=always -v /usr/local/dbwhaticket/data:/var/lib/postgresql/data -d postgres:latest
```

#### Instalar o Redis Docker 

```bash
docker run -e TZ="America/Sao_Paulo" --name rediswhaticket -p 6379:6379 -d --restart=always redis:latest redis-server --appendonly yes --requirepass "suaSenha"
```

#### Clonar este repositório:

```bash
cd ~
git clone https://github.com/AlanMartines/WhaticketSaas.git
```

#### Crie um arquivo .env de backend e preencha com as informações correta:

```bash
cp WhaticketSaas/backend/.env.example WhaticketSaas/backend/.env
vim WhaticketSaas/backend/.env
```

```bash
NODE_ENV='production'
BACKEND_URL=https://<domain_back>
FRONTEND_URL=https://<domain_front>
PROXY_PORT=443
PORT=3000

# BANCO
DB_TIMEZONE=-03:00
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=whaticket
DB_PASS=<sua_senha>
DB_NAME=dbwhaticket
DB_DEBUG=false
DB_BACKUP=/usr/local/whaticket/backup

JWT_SECRET='53pJTvkL9T6q2jYFFKwBM0opl'
JWT_REFRESH_SECRET='QnJtfUphUd9CjSAxtRIJwFroFmqrRXY'

REDIS_URI=redis://:<sua_senha>@127.0.0.1:6379
REDIS_OPT_LIMITER_MAX=1
REGIS_OPT_LIMITER_DURATION=3000

USER_LIMIT=999999
CONNECTIONS_LIMIT=999999
CLOSED_SEND_BY_ME=true

# FACEBOOK/INSTAGRAM CONFIGS
VERIFY_TOKEN=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

# BROWSER SETTINGS
BROWSER_CLIENT=Whaticket
BROWSER_NAME=Chrome
BROWSER_VERSION=10.0
VIEW_QRCODE_TERMINAL=true

MAIL_HOST="smtp.gmail.com"
MAIL_USER="<email>@gmail.com"
MAIL_PASS="<suasenha>"
MAIL_FROM="Recuperar Senha <email@gmail.com>"
MAIL_PORT="587"

GERENCIANET_SANDBOX=false
GERENCIANET_CLIENT_ID='<Client_Id>'
GERENCIANET_CLIENT_SECRET='<Client_Secret>'
GERENCIANET_PIX_CERT='<cert_name>s'
GERENCIANET_PIX_KEY='<chave_pix>'
```

#### Executa o npm install , cria o build cria as tabela e insere os registro padrão

```bash
cd WhaticketSaas/backend
npm install
npm run build
npm run db:migrate
npm run db:seed
```

#### Vá para a pasta frontend e instale as dependências:

```bash
cd ../frontend
cp .env.example .env
vim .env
```

```bash
REACT_APP_BACKEND_URL=http://localhost:3000
REACT_APP_HOURS_CLOSE_TICKETS_AUTO = 24
#
REACT_APP_ENV_TOKEN = '210897ugn217208jfo2983u5'
REACT_APP_FACEBOOK_APP_ID= 
REACT_APP_NAME_SYSTEM = "Whtsticket"
REACT_APP_VERSION="1.0.0"
REACT_APP_PRIMARY_COLOR='#0b5394'
REACT_APP_PRIMARY_DARK='#2c3145'
REACT_APP_NUMBER_SUPPORT="5567996787854"
SERVER_PORT=3001
WDS_SOCKET_PORT=0
```

```bash
npm install
npm run build
```

#### Instale o pm2 **com sudo** e inicie o backend com ele:

```bash
sudo npm install -g pm2

cd ../backend
pm2 start dist/server.js --name unkbot-backend
cd ../frontend
pm2 start server.js --name unkbot-frontend

```

#### Iniciar pm2 após a reinicialização:

```bash
pm2 startup ubuntu -u `YOUR_USERNAME`
```

#### Copie a última saída de linha do comando anterior e execute-o, é algo como:

```bash
sudo env PATH=\$PATH:/usr/bin pm2 startup ubuntu -u YOUR_USERNAME --hp /home/YOUR_USERNAM
```

#### Instale o nginx:

```bash
sudo apt install nginx
```

#### Remova o site padrão do nginx:

```bash
sudo rm /etc/nginx/sites-enabled/default
```

#### Crie o site para o Backend
```bash
sudo nano /etc/nginx/sites-available/unkbot-backend
```

```bash
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

#### Crie o site para o frontend

```bash
sudo nano /etc/nginx/sites-available/unkbot-frontend
```

```bash
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

#### Crie os links simbólicos para habilitar os sites:

```bash
sudo ln -s /etc/nginx/sites-available/unkbot-backend /etc/nginx/sites-enabled
sudo ln -s /etc/nginx/sites-available/unkbot-frontend /etc/nginx/sites-enabled
```

#### Vamos alterar a configuração do nginx para aceitar 20MB de corpo nas requisições:

```bash
sudo nano /etc/nginx/nginx.conf
...

http {
  ...
  client_max_body_size 1024M;  # HANDLE BIGGER UPLOADS
}

```

#### Teste a configuração e reinicie o nginx:

```bash
sudo nginx -t
sudo service nginx restart
```

Agora, ative o SSL (https) nos seus sites para utilizar todas as funcionalidades da aplicação como notificações e envio de mensagens áudio. Uma forma fácil de o fazer é utilizar Certbot:

#### Instale o certbot:

```bash
sudo apt install certbot python3-certbot-nginx
```

#### Criar o certificado:

```bash
sudo certbot certonly --nginx --register-unsafely-without-email -d <domain>
```

#### URL WEBHOOK META:

```bash
https://api.seudominio.com.br/webhook/fb
```

#### Dados de acesso

User: admin@admin.com
Password: 123456