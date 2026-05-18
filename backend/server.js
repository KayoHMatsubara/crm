const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Persistência de dados
const DB_PATH = path.join(__dirname, 'database.json');

function carregarBancoDados() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const dados = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(dados);
    }
  } catch (error) {
    console.log('Criando novo banco de dados...');
  }
  
  return {
    usuarios: [
      { id: '1', login: 'admin', senha: '123456', email: 'admin@crm.com', ativo: true, dataCriacao: new Date().toISOString(), ultimoAcesso: null }
    ],
    produtos: [],
    atividades: []
  };
}

function salvarBancoDados(dados) {
  fs.writeFileSync(DB_PATH, JSON.stringify(dados, null, 2));
}

function registrarAtividade(usuario, acao, detalhes) {
  database.atividades.push({
    id: uuidv4(),
    usuario,
    acao,
    detalhes,
    data: new Date().toISOString()
  });
  
  // Manter apenas últimas 1000 atividades
  if (database.atividades.length > 1000) {
    database.atividades.shift();
  }
  
  salvarBancoDados(database);
}

let database = carregarBancoDados();
let loginAttempts = {};

// ROTAS DE AUTENTICAÇÃO
app.post('/api/login', (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).json({ sucesso: false, mensagem: 'Login e senha são obrigatórios' });
  }

  const usuario = database.usuarios.find(u => u.login === login && u.ativo);

  if (!usuario || usuario.senha !== senha) {
    return res.status(401).json({ sucesso: false, mensagem: 'Login ou senha inválidos' });
  }

  usuario.ultimoAcesso = new Date().toISOString();
  loginAttempts[login] = 0;
  registrarAtividade(usuario.login, 'LOGIN', 'Usuário fez login');
  salvarBancoDados(database);
  
  res.json({ 
    sucesso: true, 
    mensagem: 'Login realizado com sucesso', 
    usuario: { id: usuario.id, login: usuario.login, email: usuario.email } 
  });
});

// ROTAS DE USUÁRIOS
app.get('/api/usuarios', (req, res) => {
  const usuarios = database.usuarios.map(u => ({
    ...u,
    senha: undefined // Nunca retorna senhas
  }));
  res.json(usuarios);
});

app.get('/api/usuarios/count', (req, res) => {
  res.json({ 
    total: database.usuarios.length, 
    ativos: database.usuarios.filter(u => u.ativo).length 
  });
});

app.post('/api/usuarios', (req, res) => {
  const { login, senha, email } = req.body;

  if (!login || !senha || !email) {
    return res.status(400).json({ sucesso: false, mensagem: 'Login, senha e email são obrigatórios' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ sucesso: false, mensagem: 'Email inválido' });
  }

  if (login.length < 3) {
    return res.status(400).json({ sucesso: false, mensagem: 'Login deve ter no mínimo 3 caracteres' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ sucesso: false, mensagem: 'Senha deve ter no mínimo 6 caracteres' });
  }

  if (database.usuarios.find(u => u.login === login)) {
    return res.status(400).json({ sucesso: false, mensagem: 'Login já existe' });
  }

  const novoUsuario = {
    id: uuidv4(),
    login,
    senha,
    email,
    ativo: true,
    dataCriacao: new Date().toISOString(),
    ultimoAcesso: null
  };

  database.usuarios.push(novoUsuario);
  registrarAtividade('admin', 'CRIAR_USUARIO', `Novo usuário criado: ${login}`);
  salvarBancoDados(database);
  
  res.status(201).json({ 
    sucesso: true, 
    mensagem: 'Usuário criado com sucesso', 
    usuario: { ...novoUsuario, senha: undefined } 
  });
});

app.put('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { login, senha, email, ativo } = req.body;

  const usuario = database.usuarios.find(u => u.id === id);

  if (!usuario) {
    return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
  }

  let mudancas = [];
  if (login && login !== usuario.login) {
    if (database.usuarios.find(u => u.login === login && u.id !== id)) {
      return res.status(400).json({ sucesso: false, mensagem: 'Login já existe' });
    }
    mudancas.push(`login: ${usuario.login} → ${login}`);
    usuario.login = login;
  }
  if (senha && senha.length >= 6) {
    mudancas.push('senha alterada');
    usuario.senha = senha;
  }
  if (email && email !== usuario.email) {
    if (!email.includes('@')) {
      return res.status(400).json({ sucesso: false, mensagem: 'Email inválido' });
    }
    mudancas.push(`email: ${usuario.email} → ${email}`);
    usuario.email = email;
  }
  if (ativo !== undefined && ativo !== usuario.ativo) {
    mudancas.push(`status: ${usuario.ativo ? 'ativo' : 'inativo'} → ${ativo ? 'ativo' : 'inativo'}`);
    usuario.ativo = ativo;
  }

  registrarAtividade('admin', 'EDITAR_USUARIO', `Usuário ${usuario.login} editado: ${mudancas.join(', ')}`);
  salvarBancoDados(database);

  res.json({ 
    sucesso: true, 
    mensagem: 'Usuário atualizado com sucesso', 
    usuario: { ...usuario, senha: undefined } 
  });
});

app.delete('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;

  const usuario = database.usuarios.find(u => u.id === id);

  if (!usuario) {
    return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
  }

  if (id === '1') {
    return res.status(400).json({ sucesso: false, mensagem: 'Não é possível inativar o usuário admin' });
  }

  usuario.ativo = false;
  registrarAtividade('admin', 'INATIVAR_USUARIO', `Usuário inativado: ${usuario.login}`);
  salvarBancoDados(database);
  
  res.json({ sucesso: true, mensagem: 'Usuário inativado com sucesso' });
});

// Ativar usuário
app.post('/api/usuarios/:id/ativar', (req, res) => {
  const { id } = req.params;

  const usuario = database.usuarios.find(u => u.id === id);

  if (!usuario) {
    return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
  }

  usuario.ativo = true;
  registrarAtividade('admin', 'ATIVAR_USUARIO', `Usuário ativado: ${usuario.login}`);
  salvarBancoDados(database);
  
  res.json({ sucesso: true, mensagem: 'Usuário ativado com sucesso' });
});

// ROTAS DE PRODUTOS
app.get('/api/produtos', (req, res) => {
  const { filtro, categoria, ordenar } = req.query;
  
  let produtos = database.produtos;
  
  if (filtro) {
    produtos = produtos.filter(p => 
      p.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      p.descricao.toLowerCase().includes(filtro.toLowerCase())
    );
  }
  
  if (categoria) {
    produtos = produtos.filter(p => p.categoria === categoria);
  }
  
  if (ordenar === 'valor-asc') {
    produtos.sort((a, b) => a.valor - b.valor);
  } else if (ordenar === 'valor-desc') {
    produtos.sort((a, b) => b.valor - a.valor);
  } else if (ordenar === 'data-desc') {
    produtos.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
  }
  
  res.json(produtos);
});

app.post('/api/produtos', (req, res) => {
  const { nome, descricao, valor, categoria, estoque } = req.body;

  if (!nome || !descricao || !valor) {
    return res.status(400).json({ sucesso: false, mensagem: 'Campos obrigatórios faltando' });
  }

  const valorNum = parseFloat(valor);
  if (isNaN(valorNum) || valorNum <= 0) {
    return res.status(400).json({ sucesso: false, mensagem: 'Valor deve ser um número positivo' });
  }

  const novoProduto = {
    id: uuidv4(),
    nome,
    descricao,
    valor: valorNum,
    categoria: categoria || 'Geral',
    estoque: parseInt(estoque) || 0,
    dataCriacao: new Date().toISOString(),
    dataAtualizacao: new Date().toISOString()
  };

  database.produtos.push(novoProduto);
  registrarAtividade('admin', 'CRIAR_PRODUTO', `Novo produto criado: ${nome}`);
  salvarBancoDados(database);
  
  res.status(201).json({ 
    sucesso: true, 
    mensagem: 'Produto criado com sucesso', 
    produto: novoProduto 
  });
});

app.put('/api/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, descricao, valor, categoria, estoque } = req.body;

  const produto = database.produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado' });
  }

  if (nome) produto.nome = nome;
  if (descricao) produto.descricao = descricao;
  if (valor) produto.valor = parseFloat(valor);
  if (categoria) produto.categoria = categoria;
  if (estoque !== undefined) produto.estoque = parseInt(estoque);
  
  produto.dataAtualizacao = new Date().toISOString();

  registrarAtividade('admin', 'EDITAR_PRODUTO', `Produto atualizado: ${produto.nome}`);
  salvarBancoDados(database);

  res.json({ 
    sucesso: true, 
    mensagem: 'Produto atualizado com sucesso', 
    produto 
  });
});

app.delete('/api/produtos/:id', (req, res) => {
  const index = database.produtos.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado' });
  }

  const produto = database.produtos[index];
  database.produtos.splice(index, 1);
  registrarAtividade('admin', 'DELETAR_PRODUTO', `Produto deletado: ${produto.nome}`);
  salvarBancoDados(database);
  
  res.json({ sucesso: true, mensagem: 'Produto deletado com sucesso' });
});

// ROTAS DE RELATÓRIOS
app.get('/api/relatorios/resumo', (req, res) => {
  const totalProdutos = database.produtos.length;
  const totalValor = database.produtos.reduce((sum, p) => sum + p.valor, 0);
  const totalEstoque = database.produtos.reduce((sum, p) => sum + p.estoque, 0);
  const produtosComEstoque = database.produtos.filter(p => p.estoque > 0).length;
  const totalUsuarios = database.usuarios.length;
  const usuariosAtivos = database.usuarios.filter(u => u.ativo).length;

  res.json({
    totalProdutos,
    totalValor,
    totalEstoque,
    produtosComEstoque,
    totalUsuarios,
    usuariosAtivos,
    dataGeracao: new Date().toISOString()
  });
});

app.get('/api/relatorios/produtos', (req, res) => {
  const relatorio = database.produtos.map(p => ({
    nome: p.nome,
    categoria: p.categoria,
    valor: p.valor,
    estoque: p.estoque,
    dataCriacao: p.dataCriacao
  }));

  res.json(relatorio);
});

app.get('/api/relatorios/atividades', (req, res) => {
  const atividades = database.atividades.slice(-100); // Últimas 100 atividades
  res.json(atividades);
});

app.get('/api/relatorios/graficos', (req, res) => {
  const produtosPorCategoria = {};
  database.produtos.forEach(p => {
    produtosPorCategoria[p.categoria] = (produtosPorCategoria[p.categoria] || 0) + 1;
  });

  const estoqueCategoria = {};
  database.produtos.forEach(p => {
    estoqueCategoria[p.categoria] = (estoqueCategoria[p.categoria] || 0) + p.estoque;
  });

  const valorPorProduto = {};
  database.produtos.forEach(p => {
    valorPorProduto[p.nome] = p.valor;
  });

  res.json({
    produtosPorCategoria,
    estoqueCategoria,
    valorPorProduto: Object.entries(valorPorProduto)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})
  });
});

// ROTA DE BACKUP
app.get('/api/backup', (req, res) => {
  const backup = {
    data: new Date().toISOString(),
    versao: '2.0',
    dados: database
  };
  
  res.setHeader('Content-Disposition', `attachment; filename="backup-crm-${new Date().toISOString().split('T')[0]}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.json(backup);
});

// ROTA DE RESTAURAÇÃO DE BACKUP
app.post('/api/backup/restaurar', (req, res) => {
  try {
    const { dados } = req.body;
    
    if (!dados || !dados.usuarios || !dados.propostas) {
      return res.status(400).json({ sucesso: false, mensagem: 'Formato de backup inválido' });
    }

    database.usuarios = dados.usuarios || [];
    database.propostas = dados.propostas || [];
    database.atividades = dados.atividades || [];
    
    salvarBancoDados(database);
    registrarAtividade('admin', 'RESTAURACAO_BACKUP', 'Banco de dados restaurado de backup');
    
    res.json({ sucesso: true, mensagem: 'Backup restaurado com sucesso' });
  } catch (error) {
    console.error('Erro ao restaurar backup:', error);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao restaurar backup' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor CRM rodando em http://localhost:${PORT}`);
});
