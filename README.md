# CRM - Sistema de Gerenciamento (VERSÃO MELHORADA 2.0)

Um sistema completo e profissional de CRM (Customer Relationship Management) com gerenciamento de propostas, usuários, relatórios e análises visuais interativas.

## 🎯 Funcionalidades Principais

- ✅ **Tela de Login** - Autenticação segura com validação de credenciais
- ✅ **Dashboard** - Visão geral com 5 cards de métricas e 3 gráficos interativos
- ✅ **Propostas e Produtos** - CRUD completo com filtros, busca e ordenação
- ✅ **Gerenciamento de Usuários** - Criar, editar, visualizar e inativar usuários
- ✅ **Relatórios** - Resumo, tabelas detalhadas, atividades e exportação em TXT
- ✅ **Gráficos Interativos** - Chart.js para visualizações profissionais
- ✅ **Sistema de Notificações** - Toasts animados para feedback visual
- ✅ **Persistência de Dados** - Salva em arquivo JSON automaticamente
- ✅ **Registro de Atividades** - Histórico completo de todas as ações do usuário
- ✅ **Logout Seguro** - Sair do sistema com confirmação

## 🆕 Melhorias Implementadas na Versão 2.0

### Backend - Recursos Avançados
- 💾 **Persistência de Dados** - Todos os dados salvos em `database.json`
- 📝 **Log de Atividades** - Registro de cada ação realizada (usuário, ação, detalhes, timestamp)
- 🔍 **Filtros e Busca** - Buscar propostas por título/cliente, filtrar por status, ordenar por data/valor
- ✔️ **Validações Melhoradas** - Validação de email, senhas com 6+ caracteres, logins com 3+ caracteres
- 🛡️ **Proteção Admin** - Impossível inativar usuário admin do sistema
- 📊 **Gráficos** - Dados agregados para 3 gráficos diferentes no dashboard
- ⏱️ **Timestamps** - Último acesso, data de criação e atualização em todos os registros

### Frontend - UX/UI Melhorada
- 🔔 **Toast Notifications** - Notificações elegantes e animadas (sucesso, erro, aviso, info)
- 📊 **Gráficos Chart.js** - 3 gráficos interativos no dashboard:
  - **Donut Chart** - Distribuição de propostas por status
  - **Bar Chart** - Quantidade de propostas por tipo
  - **Horizontal Bar Chart** - Top 10 clientes por valor total
- 🔍 **Busca e Filtros Avançados** - Filtre propostas em tempo real com atualização instantânea
- 💅 **Design Profissional** - UI/UX moderna com layout grid e flexbox
- ♿ **Acessibilidade** - Melhor legibilidade com contraste adequado
- 📱 **Responsividade Total** - Funciona perfeitamente em desktop, tablet e mobile
- ✨ **Animações Suaves** - Transições CSS3 entre páginas e componentes
- 🎨 **Temas Visuais** - Status codes com cores intuitivas (verde=ativo, vermelho=inativo, amarelo=aberta)

## 📊 Análises e Gráficos

### Dashboard - Métricas Principais
- **Total de Propostas** - Card com contador de todas as propostas
- **Propostas Abertas** - Contagem em tempo real de propostas com status "Aberta"
- **Propostas Fechadas** - Somatório de propostas com status "Fechada"
- **Valor Total** - Somatório do valor de todas as propostas
- **Usuários Ativos** - Relação de usuários ativos vs total

### Gráficos Interativos
- **Donut Chart** - Visão clara da distribuição de propostas por status
- **Bar Chart** - Comparação de quantidade entre tipos (Proposta vs Produto)
- **Horizontal Bar Chart** - Ranking dos 10 maiores clientes por valor

### Relatórios - 3 Seções Principais
1. **Resumo Geral** - KPIs principais com estatísticas
2. **Tabela de Propostas** - Detalhes de cada proposta com todos os campos
3. **Atividades Recentes** - Histórico das últimas 20 ações dos usuários

## 🏗️ Estrutura do Projeto

```
CRM/
├── frontend/
│   ├── index.html              # Página única com todas as seções
│   ├── css/
│   │   └── style.css           # Estilos completos (2000+ linhas, responsivo)
│   └── js/
│       └── script.js           # Lógica com 800+ linhas (toasts, charts, API calls)
├── backend/
│   ├── server.js               # Servidor Express com 14 endpoints e persistência
│   ├── database.json           # Banco de dados JSON (criado automaticamente)
│   ├── package.json            # Dependências: express, cors, body-parser, uuid
│   └── node_modules/           # Módulos instalados
└── README.md                   # Documentação (este arquivo)
```

## 🚀 Como Executar

### Pré-requisitos
- **Node.js** v14 ou superior
- **npm** (vem com Node.js)
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

### Instalação Passo a Passo

#### 1️⃣ Instalar Dependências do Backend
```bash
cd CRM/backend
npm install
```

Você verá:
```
added 65 packages
```

#### 2️⃣ Iniciar o Servidor
```bash
npm start
```

Mensagem esperada:
```
Servidor CRM rodando em http://localhost:3000
```

#### 3️⃣ Abrir o CRM no Navegador
Acesse: **http://localhost:3000**

Você verá a tela de login!

## 🔐 Credenciais Padrão para Teste

| Campo | Valor |
|-------|-------|
| **Login** | `admin` |
| **Senha** | `123456` |

> ⚠️ Troque essas credenciais em produção!

## 📋 Guia Completo de Funcionalidades

### 1️⃣ Tela de Login

**Recursos:**
- Validação de login e senha
- Mensagens de erro claras
- Armazenamento de sessão no navegador
- Link com estilo profissional

**Como fazer login:**
1. Insira `admin` no campo "Login"
2. Insira `123456` no campo "Senha"
3. Clique em "Entrar"
4. Será redirecionado para o Dashboard

### 2️⃣ Dashboard (Início)

**Elementos Principais:**
- 📊 5 Cards com métricas:
  - Total de Propostas
  - Propostas Abertas
  - Propostas Fechadas
  - Valor Total
  - Usuários Ativos

- 📈 3 Gráficos Chart.js:
  1. **Propostas por Status** (Donut) - visualização clara da distribuição
  2. **Tipos de Propostas** (Barra) - comparação entre tipos
  3. **Top 10 Clientes** (Horizontal Bar) - maiores clientes por valor

**Como usar:**
- Os gráficos atualizam automaticamente quando você cria/edita propostas
- Passe o mouse sobre os gráficos para ver detalhes
- Clique nas legendas dos gráficos para ativar/desativar series

### 3️⃣ Propostas e Produtos

#### Criar Nova Proposta
1. Clique em "Propostas" no menu
2. Clique em "+ Nova Proposta"
3. Preencha os campos:
   - **Tipo** - Selecione "Proposta" ou "Produto"
   - **Título** - Nome da proposta (obrigatório)
   - **Descrição** - Detalhes (obrigatório)
   - **Cliente** - Nome do cliente (obrigatório)
   - **Valor** - Valor em R$ (obrigatório, números)
   - **Status** - Estado da proposta (obrigatório)
   - **Prazo** - Data limite (opcional)
4. Clique em "Salvar Proposta"
5. Verá um toast verde: "Proposta salva com sucesso!"

#### Buscar Propostas
1. Na seção de propostas, você verá 3 filtros:
   - **Buscar** - Digite parte do título ou cliente
   - **Status** - Selecione um status para filtrar
   - **Ordenar** - Escolha como ordenar (data ↓, data ↑, valor ↓, valor ↑)
2. A tabela atualiza em tempo real conforme digita/seleciona
3. Clique em "X" em qualquer filtro para limpar

#### Editar Proposta
1. Localize a proposta na tabela
2. Clique no ícone de lápis (✏️) na coluna "Ações"
3. Modifique os campos desejados
4. Clique em "Atualizar Proposta"
5. Toast de sucesso será exibido

#### Deletar Proposta
1. Clique no ícone de lixeira (🗑️) na coluna "Ações"
2. Confirme a exclusão na janela pop-up
3. Proposta será removida da tabela
4. Toast de sucesso confirmará

**Campos da Proposta:**
- Tipo: Proposta / Produto
- Título: String obrigatório
- Descrição: String obrigatório
- Cliente: String obrigatório
- Valor: Número obrigatório
- Status: Aberta / Fechada / Aprovada / Rejeitada
- Prazo: Data (opcional)
- ID: Gerado automaticamente (UUID)
- Criação: Timestamp automático
- Atualização: Timestamp automático

### 4️⃣ Gerenciamento de Usuários

#### Visualizar Usuários
1. Clique em "Usuários" no menu
2. Verá um card com estatísticas:
   - Usuários Ativos
   - Total de Usuários
   - Percentual de ativos
3. Abaixo, tabela com todos os usuários

#### Criar Novo Usuário
1. Clique em "+ Novo Usuário"
2. Preencha os campos:
   - **Login** - Mínimo 3 caracteres (obrigatório, único)
   - **Senha** - Mínimo 6 caracteres (obrigatório)
   - **Email** - Formato válido com @ (obrigatório, único)
3. Clique em "Salvar Usuário"
4. Toast verde confirma: "Usuário criado com sucesso!"

#### Editar Usuário
1. Clique no ícone de lápis (✏️) na linha do usuário
2. Modifique login, senha ou email
3. Clique em "Atualizar Usuário"
4. Sistema pedirá confirmação
5. Toast de sucesso

#### Inativar Usuário
1. Clique no ícone de pausa (⏸️) na linha do usuário
2. Confirme a inativação
3. Usuário muda para status "Inativo"
4. Não pode mais fazer login (soft delete)
5. Toast confirma ação

**Validações de Usuário:**
- ✔️ Login: mínimo 3 caracteres, não pode estar vazio
- ✔️ Senha: mínimo 6 caracteres
- ✔️ Email: deve conter @, validação de formato
- ✔️ Admin: não pode ser inativado
- ✔️ Duplicados: não permite logins ou emails duplicados

### 5️⃣ Relatórios

#### Acessar Relatórios
1. Clique em "Relatórios" no menu
2. Verá 3 seções principais

#### Resumo Geral
- Card com informações consolidadas:
  - Total de Propostas
  - Propostas Abertas
  - Propostas Fechadas
  - Valor Total
  - Usuários Ativos/Total
  - Últimas Atividades

#### Tabela de Propostas
- Lista completa com colunas:
  - Tipo (Proposta/Produto)
  - Título
  - Cliente
  - Valor
  - Status
  - Data Criação
- Dados formatados (moeda em R$, datas em DD/MM/YYYY)

#### Atividades Recentes
- Log das últimas 20 ações:
  - Usuário que fez a ação
  - Tipo de ação (Criação, Atualização, Exclusão, Login, etc.)
  - Detalhes da ação
  - Timestamp (data e hora)
- Muito útil para auditoria e rastreamento

#### Exportar Relatório
1. Clique em "📥 Exportar Relatório"
2. Arquivo TXT será baixado com formatação:
   - Título em caixa ASCII
   - Seções organizadas
   - Tabelas bem formatadas
   - Hora de geração

**Exemplo de nome do arquivo:**
```
Relatorio_CRM_13-05-2026.txt
```

### 6️⃣ Sistema de Notificações

O CRM exibe toasts animados em 4 tipos:

| Tipo | Cor | Quando Aparece | Exemplo |
|------|-----|----------------|---------|
| ✓ **Sucesso** | 🟢 Verde | Ação realizada | "Proposta salva com sucesso!" |
| ✕ **Erro** | 🔴 Vermelho | Falha/validação | "Login e senha inválidos" |
| ⚠️ **Aviso** | 🟠 Laranja | Atenção necessária | "Confirme a exclusão" |
| ℹ️ **Informação** | 🔵 Azul | Info geral | "Preparando exportação..." |

**Características:**
- Aparecem no canto superior direito
- Desaparecem automaticamente após 3 segundos
- Animação de entrada (slide in) e saída (slide out)
- Múltiplos toasts podem aparecer em sequência

## 🎨 Design e Tema Visual

### Paleta de Cores
| Cor | Uso | Valor |
|-----|-----|-------|
| 🔵 Azul | Primária, buttons | #2563eb |
| 🟢 Verde | Sucesso, ativo | #10b981 |
| 🔴 Vermelho | Erro, inativo | #ef4444 |
| 🟠 Laranja | Aviso, warning | #f59e0b |
| 🔵 Info | Informação | #3b82f6 |
| ⚪ Neutro | Background | #f3f4f6 |

### Tipografia
- **Font Principal:** Segoe UI, Tahoma, sistema
- **Headings:** 24px, 20px, 18px, 16px
- **Body:** 14px
- **Monospace:** Código

### Componentes
- **Cards:** Sombra, border-radius 8px, hover lift effect
- **Botões:** Transição suave 0.3s, hover escurece
- **Inputs:** Border bottom style, focus color change
- **Modals:** Overlay com opacidade, scale animation
- **Tabelas:** Alternância de cores nas linhas, hover

### Responsividade
- **Desktop:** 1920x1080+ - Layout completo
- **Laptop:** 1366x768 - Layout ajustado
- **Tablet:** 768x1024 - Menu colapsável
- **Mobile:** 375x667 - Stack vertical, toque optimizado

Breakpoints CSS:
```css
@media (max-width: 768px) { /* Tablet */ }
@media (max-width: 480px) { /* Mobile */ }
```

## 💾 Sistema de Persistência

### Estrutura de Dados

Os dados são salvos em `database.json` no seguinte formato:

```json
{
  "usuarios": [
    {
      "id": "uuid",
      "login": "admin",
      "senha": "123456",
      "email": "admin@crm.com",
      "ativo": true,
      "ultimoAcesso": "2026-05-13T10:30:00Z",
      "criadoEm": "2026-01-01T00:00:00Z"
    }
  ],
  "propostas": [
    {
      "id": "uuid",
      "tipo": "Proposta",
      "titulo": "Exemplo",
      "descricao": "Descrição",
      "cliente": "Cliente X",
      "valor": 5000,
      "status": "Aberta",
      "prazo": "2026-12-31",
      "criadoEm": "2026-05-13T10:00:00Z",
      "atualizadoEm": "2026-05-13T10:00:00Z"
    }
  ],
  "atividades": [
    {
      "id": "uuid",
      "usuario": "admin",
      "acao": "LOGIN",
      "detalhes": "Usuário admin fez login",
      "timestamp": "2026-05-13T10:00:00Z"
    }
  ]
}
```

### Locação do Arquivo
```
CRM/backend/database.json
```

### Criação Automática
- Se o arquivo não existir, será criado automaticamente no primeiro acesso
- Inicializado com arrays vazios: `{"usuarios": [], "propostas": [], "atividades": []}`
- Admin padrão é adicionado no primeiro run

## 🔧 Tecnologias Utilizadas

### Frontend (SPA - Single Page Application)
- **HTML5** - Estrutura semântica, acessibilidade
- **CSS3** - Grid, Flexbox, Variáveis CSS, Animações
- **JavaScript (Vanilla)** - Sem frameworks, ~800 linhas
- **Chart.js** - Biblioteca CDN para gráficos interativos
- **LocalStorage API** - Armazenamento de sessão no navegador

### Backend (REST API)
- **Node.js** - Runtime JavaScript server-side
- **Express.js v4.18.2** - Framework web minimalista
- **CORS** - Habilitação de requisições cross-origin
- **Body Parser** - Parse automático de JSON
- **UUID v4** - Geração de IDs únicos
- **FileSystem (Node.js)** - Persistência em arquivo JSON

### Endpoints da API (14 Total)

**Autenticação:**
- `POST /api/login` - Fazer login
- `POST /api/logout` - Fazer logout

**Usuários (CRUD):**
- `GET /api/usuarios` - Listar todos
- `GET /api/usuarios/count` - Contar ativos
- `POST /api/usuarios` - Criar novo
- `PUT /api/usuarios/:id` - Atualizar
- `DELETE /api/usuarios/:id` - Inativar (soft delete)

**Propostas (CRUD + Filtros):**
- `GET /api/propostas?filtro=...&status=...&ordenar=...` - Listar com filtros
- `POST /api/propostas` - Criar nova
- `PUT /api/propostas/:id` - Atualizar
- `DELETE /api/propostas/:id` - Deletar

**Relatórios:**
- `GET /relatorios/resumo` - Resumo com KPIs
- `GET /relatorios/propostas` - Todas as propostas
- `GET /relatorios/atividades` - Log de atividades
- `GET /relatorios/graficos` - Dados para gráficos

## 📱 Funcionalidades Responsivas

A aplicação é 100% responsiva:

### Desktop (1920x1080+)
- Navbar fixo no topo
- Sidebar fixo à esquerda (250px)
- Conteúdo principal com 3 colunas
- Gráficos lado a lado

### Tablet (768px - 1024px)
- Sidebar colapsável
- Menu hamburger
- Conteúdo em 2 colunas
- Gráficos empilhados

### Mobile (até 480px)
- Menu full-screen
- Sidebar em drawer
- Conteúdo single column
- Inputs amplos para toque
- Tabelas com scroll horizontal

## 🔐 Segurança

**Implementado:**
- ✔️ Validação de todos os campos (servidor + cliente)
- ✔️ Proteção de usuário admin (não pode ser inativado)
- ✔️ Confirmação antes de deletar/inativar
- ✔️ Log completo de atividades para auditoria
- ✔️ Senhas não são retornadas na API
- ✔️ Verificação de campos obrigatórios

**Recomendado para Produção:**
- 🔄 Implementar JWT para tokens
- 🔒 Hash de senhas com bcrypt
- 🔐 HTTPS/SSL
- 🛡️ Rate limiting
- 📊 Banco de dados real (MongoDB/PostgreSQL)
- 🔑 Variáveis de ambiente para secrets
- 👥 Role-based access control (RBAC)

## 🐛 Troubleshooting

### ❌ "Erro: Conexão recusada em localhost:3000"
```bash
# Certifique-se que o servidor está rodando:
cd CRM/backend
npm start

# Se der erro de porta em uso:
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # Mac/Linux
```

### ❌ "Dados não persistem após reiniciar"
```bash
# Verifique permissões:
ls -la backend/database.json

# Delete e recrie:
rm backend/database.json
npm start  # irá recrear automaticamente
```

### ❌ "Gráficos não aparecem no Dashboard"
1. Abra console (F12)
2. Procure por erros de Chart.js
3. Limpe cache: Ctrl+Shift+Del
4. Recarregue a página

### ❌ "Não consigo fazer login"
1. Verifique se login é `admin` (case sensitive)
2. Verifique se senha é `123456`
3. Limpe localStorage: `localStorage.clear()` no console
4. Recarregue a página

### ❌ "Tabelas aparecem vazias"
1. Crie alguns registros primeiro
2. Verifique se o banco de dados está sendo criado: `cat backend/database.json`
3. Procure por erros no console (F12)

## 📊 Exemplos de Uso

### Exemplo 1: Criar e Relatório de Proposta
```
1. Login com admin/123456
2. Ir para Propostas
3. Clicar "+ Nova Proposta"
4. Preencher:
   - Tipo: Proposta
   - Título: "Consultoria IT"
   - Descrição: "Consultoria em transformação digital"
   - Cliente: "Empresa XYZ"
   - Valor: 15000
   - Status: Aberta
   - Prazo: 2026-12-31
5. Salvar
6. Ver em Relatórios > Tabela de Propostas
```

### Exemplo 2: Filtrar e Ordenar Propostas
```
1. Ir para Propostas
2. Digitar na busca: "XYZ" (filtra por cliente)
3. Selecionar Status: "Aberta"
4. Selecionar Ordenar: "Valor ↓" (maior primeiro)
5. Tabela atualiza em tempo real
6. Clique em X para limpar cada filtro
```

### Exemplo 3: Criar Novo Usuário
```
1. Ir para Usuários
2. Clicar "+ Novo Usuário"
3. Preencher:
   - Login: "vendedor1"
   - Senha: "senha123"
   - Email: "vendedor1@empresa.com"
4. Salvar
5. Ver em tabela com status "Ativo"
```

### Exemplo 4: Exportar Relatório
```
1. Ir para Relatórios
2. Scroll até abaixo
3. Clicar "📥 Exportar Relatório"
4. Arquivo baixa como: Relatorio_CRM_13-05-2026.txt
5. Abrir em editor de texto
6. Ver formatação em caixas ASCII
```

## 📈 Próximas Melhorias Possíveis

### Curto Prazo
- [ ] Importar propostas de CSV
- [ ] Duplicar proposta
- [ ] Anexos (upload de arquivos)
- [ ] Email de confirmação
- [ ] Busca avançada com múltiplos critérios

### Médio Prazo
- [ ] Integração com banco de dados (MongoDB/PostgreSQL)
- [ ] Autenticação JWT
- [ ] Roles e permissões (admin, vendedor, gerente)
- [ ] Dashboard com mais gráficos
- [ ] Modo escuro
- [ ] Notificações por email

### Longo Prazo
- [ ] Mobile app (React Native)
- [ ] Integração com CRM populares
- [ ] Backup automático na nuvem
- [ ] API pública para terceiros
- [ ] Webhooks para automação
- [ ] Relatórios em PDF
- [ ] Calendário de propostas

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique o console (F12) para erros
2. Verifique arquivo `database.json`
3. Reinicie o servidor com Ctrl+C e `npm start`
4. Limpe cache do navegador

## 📄 Licença

Projeto livre para uso educacional e comercial.

---

## 📝 Histórico de Versões

| Versão | Data | Alterações |
|--------|------|-----------|
| 2.0 | 13/05/2026 | Persistência, Toasts, Gráficos, Filtros, Activity Log |
| 1.0 | 01/05/2026 | Versão inicial com funcionalidades básicas |

---

**Versão Atual:** 2.0  
**Status:** ✅ Totalmente Funcional e Testado  
**Última Atualização:** 13 de maio de 2026  
**Desenvolvido com:** Node.js + Express + Vanilla JavaScript
