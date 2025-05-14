# WhaTicket Saas - Módulo Kanban, Modo Noturno e as seguintes integrações:</br>

🗣️ DialogFlow</br>
🔄 N8N</br>
🌐 WebHooks</br>
🤖 TypeBot</br>
💬 ChatGPT</br>

#### Deploy Ubuntu/Debian (Recomendo Debian)

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

#### Instalar o pacote  build-essential:

```bash
apt install build-essential
```

```bash
apt update && apt upgrade -y
```

#### Instale o node e confirme se o comando do node -v e npm -v está disponível:

```bash
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.profile
nvm ls-remote
nvm install v22.15.0
node -v
npm -v
```

#### Trocar verção

```bash
nvm ls-remote
nvm install v20.19.1
node -v
npm -v
```

#### Instale o docker e adicione seu usuário ao grupo do docker:

##### Adicionar Docker's apt repository.

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

##### Instalar Docker packages
```bash
curl -fsSL https://get.docker.com -o get-docker.sh

sudo sh get-docker.sh

sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo usermod -aG docker ${USER}
```

#### Instalar o Postgres Docker 

```bash
docker run -e TZ="America/Sao_Paulo" --name dbWhaticketSaas -e POSTGRES_USER=whaticket -e POSTGRES_PASSWORD=Suasenha -e POSTGRES_DB=dbWhaticketSaas -p 5432:5432 -d --restart=always -v /usr/local/dbWhaticketSaas/data:/var/lib/postgresql/data -d postgres:latest
```

#### Instalar o Redis Docker 

```bash
docker run -e TZ="America/Sao_Paulo" --name redisWhaticketSaas -p 6379:6379 -d --restart=always redis:latest redis-server --appendonly yes --requirepass "suaSenha"
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
# Ambiente de Execução
NODE_ENV='production' # Define o ambiente como 'produção', garantindo configurações otimizadas para produção
BACKEND_URL=https://<domain_back> # URL do servidor backend
FRONTEND_URL=https://<domain_front> # URL do servidor frontend
PROXY_PORT=443 # Porta do proxy (geralmente 443 para HTTPS)
PORT=3000 # Porta do servidor principal para a aplicação

# Configurações do Banco de Dados
DB_TIMEZONE=-03:00 # Fuso horário do banco de dados
DB_DIALECT=postgres # Dialeto do banco de dados, PostgreSQL
DB_HOST=localhost # Host do banco de dados
DB_PORT=5432 # Porta do banco de dados
DB_USER=whaticket # Usuário para acessar o banco de dados
DB_PASS=<sua_senha> # Senha do usuário do banco de dados
DB_NAME=dbwhaticket # Nome do banco de dados
DB_DEBUG=false # Habilita ou desabilita logs de debug no banco de dados
DB_BACKUP=/usr/local/whaticket/backup # Caminho para backup do banco de dados

# Configurações de JWT (JSON Web Tokens)
JWT_SECRET='53pJTvkL9T6q2jYFFKwBM0opl' # Chave secreta para tokens de autenticação
JWT_REFRESH_SECRET='QnJtfUphUd9CjSAxtRIJwFroFmqrRXY' # Chave secreta para tokens de refresh

# Configurações do Redis
REDIS_URI=redis://:<sua_senha>@127.0.0.1:6379 # URI do servidor Redis com autenticação
REDIS_OPT_LIMITER_MAX=1 # Número máximo de operações permitidas por vez no Redis
REGIS_OPT_LIMITER_DURATION=3000 # Duração máxima (em milissegundos) para cada operação no Redis

# Limites de Conexões e Usuários
USER_LIMIT=999999 # Limite máximo de usuários permitidos
CONNECTIONS_LIMIT=999999 # Limite máximo de conexões simultâneas permitidas
CLOSED_SEND_BY_ME=true # Define se a opção de "enviado por mim" está habilitada para fechamentos de tickets

# Configurações do Facebook e Instagram
VERIFY_TOKEN= # Token de verificação para integração com Facebook/Instagram
FACEBOOK_APP_ID= # ID do aplicativo do Facebook
FACEBOOK_APP_SECRET= # Chave secreta do aplicativo do Facebook

# Configurações do Navegador
BROWSER_CLIENT=Whaticket # Nome do cliente do navegador
BROWSER_NAME=Chrome # Nome do navegador utilizado
BROWSER_VERSION=10.0 # Versão do navegador
VIEW_QRCODE_TERMINAL=true # Habilita a exibição do código QR no terminal

# Configurações de E-mail
MAIL_HOST="smtp.gmail.com" # Servidor SMTP do Gmail
MAIL_USER="<email>@gmail.com" # E-mail de envio
MAIL_PASS="<suasenha>" # Senha do e-mail de envio
MAIL_FROM="Recuperar Senha <email@gmail.com>" # Nome e endereço de envio do e-mail
MAIL_PORT="587" # Porta SMTP do Gmail

# Configurações do Gerencianet (Sistema de Pagamento)
GERENCIANET_SANDBOX=false # Define se o ambiente é de teste (sandbox) ou produção
GERENCIANET_CLIENT_ID='<Client_Id>' # ID do cliente do Gerencianet
GERENCIANET_CLIENT_SECRET='<Client_Secret>' # Chave secreta do cliente do Gerencianet
GERENCIANET_PIX_CERT='<cert_name>' # Certificado utilizado para transações PIX
GERENCIANET_PIX_KEY='<chave_pix>' # Chave PIX para transações
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
# Configurações do Backend e Frontend
REACT_APP_BACKEND_URL = 'http://localhost:3000' # URL do servidor backend
FRONTEND_URL = 'http://localhost:3001' # URL do servidor frontend

# Configurações do Sistema
REACT_APP_ENV_TOKEN = '210897ugn217208jfo2983u5' # Token para autenticação do ambiente
REACT_APP_NAME_SYSTEM = 'Whaticket' # Nome do sistema
REACT_APP_VERSION = '1.0.0' # Versão do sistema
REACT_APP_PRIMARY_COLOR = '#0b5394' # Cor principal da interface
REACT_APP_PRIMARY_DARK = '#2c3145' # Cor principal escura da interface
REACT_APP_NUMBER_SUPPORT =  # Número de suporte para o sistema (preencher conforme necessário)

# Configurações de Tickets
REACT_APP_HOURS_CLOSE_TICKETS_AUTO = 24 # Número de horas para fechamento automático de tickets
REACT_APP_TRIALEXPIRATION = 7 # Tempo de expiração do período de teste (em dias)
REACT_APP_PLANIDDEFAULT =  # ID do plano padrão para novos usuários (preencher conforme necessário)

# Configurações Visuais
REACT_APP_LOGO =  # Caminho para o logo do sistema
REACT_APP_COLOR_TOOLBAR =  # Cor da barra de ferramentas do sistema

# Informações de Copyright
REACT_APP_COPYRIGHT =  # Texto de copyright (preencher conforme necessário)
REACT_APP_COPYRIGHT_YEAR =  # Ano do copyright (preencher conforme necessário)
REACT_APP_COPYRIGHT_URL =  # URL para informações de copyright (preencher conforme necessário)

# Configurações de Porta
PORT = 3001 # Porta do servidor frontend
WDS_SOCKET_PORT = 0 # Porta para Webpack Dev Server (configuração padrão para 0)
```

```bash
npm install
npm run build
```

#### Instale o pm2 **com sudo** e inicie o backend com ele:

```bash
sudo npm install -g pm2

cd ../backend
pm2 start dist/server.js --name WhaticketSaas-backend
cd ../frontend
pm2 start server.js --name WhaticketSaas-frontend

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

#### Creditos
[WhaticketSaas](https://github.com/Leandroledledled/WhaticketSaas) de Leandroledledled.
[WhaticketSaas](https://github.com/danilorcte/whaticketsaas) de danilorcte.
[WhaticketSaas](https://github.com/rengawms/whaticketSaaS) de rengawms.