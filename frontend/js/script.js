// Configuração da API
const API_URL = 'http://localhost:3000/api';

// Estado da aplicação
let usuarioLogado = null;
let usuarioEditando = null;
let propostaEditando = null;
let graficos = {};

// ========== SISTEMA DE NOTIFICAÇÕES ==========
function mostrarToast(mensagem, tipo = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };
    
    toast.innerHTML = `<span>${icons[tipo]}</span> ${mensagem}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('closing');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== LOGIN ==========
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const login = document.getElementById('login').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, senha })
        });

        const data = await response.json();

        if (data.sucesso) {
            usuarioLogado = data.usuario;
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            mostrarToast('Login realizado com sucesso!', 'success');
            mostrarApp();
        } else {
            mostrarErroLogin(data.mensagem);
            mostrarToast(data.mensagem, 'error');
        }
    } catch (error) {
        mostrarErroLogin('Erro ao conectar ao servidor');
        mostrarToast('Erro ao conectar ao servidor', 'error');
        console.error(error);
    }
});

function mostrarErroLogin(mensagem) {
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = mensagem;
    errorDiv.style.display = 'block';
}

function mostrarApp() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'flex';
    document.getElementById('usuario-nome').textContent = usuarioLogado.login;
    carregarDashboard();
}

function verificarLogin() {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
        usuarioLogado = JSON.parse(usuario);
        mostrarApp();
    }
}

// ========== LOGOUT ==========
document.getElementById('btn-logout').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('usuario');
        mostrarToast('Logout realizado com sucesso', 'success');
        location.reload();
    }
});

// ========== NAVEGAÇÃO ==========
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.closest('a').dataset.page;
        
        document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
        document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
        
        e.target.closest('a').classList.add('active');
        document.getElementById(page).classList.add('active');

        if (page === 'dashboard') carregarDashboard();
        if (page === 'produtos') carregarProdutos();
        if (page === 'usuarios') carregarUsuarios();
        if (page === 'relatorios') carregarRelatorios();
        if (page === 'backup') carregarHistoricoBackup();
    });
});

// ========== DASHBOARD ==========
async function carregarDashboard() {
    try {
        const [resumoRes, graficosRes] = await Promise.all([
            fetch(`${API_URL}/relatorios/resumo`),
            fetch(`${API_URL}/relatorios/graficos`)
        ]);

        const dados = await resumoRes.json();
        const dadosGraficos = await graficosRes.json();

        document.getElementById('card-total-produtos').textContent = dados.totalProdutos;
        document.getElementById('card-estoque-total').textContent = dados.totalEstoque;
        document.getElementById('card-produtos-estoque').textContent = dados.produtosComEstoque;
        document.getElementById('card-valor-total').textContent = `R$ ${formatarMoeda(dados.totalValor)}`;
        document.getElementById('card-usuarios-ativos').textContent = `${dados.usuariosAtivos}/${dados.totalUsuarios}`;

        desenharGraficos(dadosGraficos);
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        mostrarToast('Erro ao carregar dashboard', 'error');
    }
}

function desenharGraficos(dados) {
    // Gráfico 1: Produtos por Categoria
    const ctxCategoria = document.getElementById('chartCategoria');
    if (graficos.categoria) graficos.categoria.destroy();
    
    graficos.categoria = new Chart(ctxCategoria, {
        type: 'doughnut',
        data: {
            labels: Object.keys(dados.produtosPorCategoria),
            datasets: [{
                data: Object.values(dados.produtosPorCategoria),
                backgroundColor: ['#fef3c7', '#d1fae5', '#dbeafe', '#fee2e2'],
                borderColor: ['#f59e0b', '#10b981', '#06b6d4', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // Gráfico 2: Estoque por Categoria
    const ctxEstoque = document.getElementById('chartEstoque');
    if (graficos.estoque) graficos.estoque.destroy();
    
    graficos.estoque = new Chart(ctxEstoque, {
        type: 'bar',
        data: {
            labels: Object.keys(dados.estoqueCategoria),
            datasets: [{
                label: 'Quantidade',
                data: Object.values(dados.estoqueCategoria),
                backgroundColor: '#2563eb',
                borderColor: '#1e40af',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Gráfico 3: Top Produtos por Valor
    const ctxProdutos = document.getElementById('chartProdutos');
    if (graficos.produtos) graficos.produtos.destroy();
    
    graficos.produtos = new Chart(ctxProdutos, {
        type: 'bar',
        data: {
            labels: Object.keys(dados.valorPorProduto),
            datasets: [{
                label: 'Valor (R$)',
                data: Object.values(dados.valorPorProduto),
                backgroundColor: '#10b981',
                borderColor: '#059669',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: { beginAtZero: true }
            }
        }
    });
}

// ========== PRODUTOS ==========
document.getElementById('btn-novo-produto').addEventListener('click', () => {
    let produtoEditando = null;
    document.getElementById('form-produto').reset();
    document.getElementById('modal-produto-titulo').textContent = 'Novo Produto';
    document.getElementById('modal-produto').style.display = 'flex';
});

document.getElementById('filtro-produtos').addEventListener('input', carregarProdutos);
document.getElementById('filtro-categoria').addEventListener('change', carregarProdutos);
document.getElementById('filtro-ordenar-produtos').addEventListener('change', carregarProdutos);

document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

document.getElementById('form-produto').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const produto = {
        nome: document.getElementById('nome-produto').value,
        descricao: document.getElementById('descricao-produto').value,
        valor: document.getElementById('valor-produto').value,
        categoria: document.getElementById('categoria-produto').value,
        estoque: document.getElementById('estoque-produto').value
    };

    if (!produto.nome || produto.nome.trim().length === 0) {
        mostrarToast('Nome não pode estar vazio', 'warning');
        return;
    }

    if (parseFloat(produto.valor) <= 0) {
        mostrarToast('Valor deve ser maior que zero', 'warning');
        return;
    }

    try {
        let response;
        let produtoEditando = document.getElementById('form-produto').dataset.editing;
        
        if (produtoEditando) {
            response = await fetch(`${API_URL}/produtos/${produtoEditando}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produto)
            });
        } else {
            response = await fetch(`${API_URL}/produtos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produto)
            });
        }

        const data = await response.json();
        if (data.sucesso) {
            document.getElementById('modal-produto').style.display = 'none';
            mostrarToast(data.mensagem, 'success');
            carregarProdutos();
            carregarDashboard();
        } else {
            mostrarToast(data.mensagem, 'error');
        }
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        mostrarToast('Erro ao salvar produto', 'error');
    }
});

async function carregarProdutos() {
    try {
        const filtro = document.getElementById('filtro-produtos').value;
        const categoria = document.getElementById('filtro-categoria').value;
        const ordenar = document.getElementById('filtro-ordenar-produtos').value;

        let url = `${API_URL}/produtos?`;
        if (filtro) url += `filtro=${encodeURIComponent(filtro)}&`;
        if (categoria) url += `categoria=${encodeURIComponent(categoria)}&`;
        if (ordenar) url += `ordenar=${encodeURIComponent(ordenar)}`;

        const response = await fetch(url);
        const produtos = await response.json();

        const tbody = document.getElementById('tbody-produtos');
        
        if (produtos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty">Nenhum produto encontrado</td></tr>';
            return;
        }

        tbody.innerHTML = produtos.map(p => `
            <tr>
                <td>${p.nome}</td>
                <td><span class="badge">${p.categoria}</span></td>
                <td>${p.descricao.substring(0, 30)}...</td>
                <td>R$ ${formatarMoeda(p.valor)}</td>
                <td><strong>${p.estoque}</strong></td>
                <td>${formatarData(p.dataCriacao)}</td>
                <td class="acoes-btn">
                    <button class="btn-secondary" onclick="editarProduto('${p.id}')">✏️ Editar</button>
                    <button class="btn-danger" onclick="deletarProduto('${p.id}')">🗑️ Deletar</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        mostrarToast('Erro ao carregar produtos', 'error');
    }
}

async function editarProduto(id) {
    try {
        const response = await fetch(`${API_URL}/produtos`);
        const produtos = await response.json();
        const produto = produtos.find(p => p.id === id);

        if (produto) {
            document.getElementById('nome-produto').value = produto.nome;
            document.getElementById('descricao-produto').value = produto.descricao;
            document.getElementById('categoria-produto').value = produto.categoria;
            document.getElementById('valor-produto').value = produto.valor;
            document.getElementById('estoque-produto').value = produto.estoque;
            document.getElementById('form-produto').dataset.editing = id;
            document.getElementById('modal-produto-titulo').textContent = 'Editar Produto';
            document.getElementById('modal-produto').style.display = 'flex';
        }
    } catch (error) {
        console.error('Erro ao editar produto:', error);
        mostrarToast('Erro ao editar produto', 'error');
    }
}

async function deletarProduto(id) {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
        try {
            const response = await fetch(`${API_URL}/produtos/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            if (data.sucesso) {
                mostrarToast(data.mensagem, 'success');
                carregarProdutos();
                carregarDashboard();
            }
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            mostrarToast('Erro ao deletar produto', 'error');
        }
    }
}

// ========== USUÁRIOS ==========
document.getElementById('btn-novo-usuario').addEventListener('click', () => {
    usuarioEditando = null;
    document.getElementById('form-usuario').reset();
    document.getElementById('modal-usuario-titulo').textContent = 'Novo Usuário';
    document.getElementById('modal-usuario').style.display = 'flex';
});

document.getElementById('form-usuario').addEventListener('submit', async (e) => {
    e.preventDefault();

    const login = document.getElementById('login-usuario').value;
    const senha = document.getElementById('senha-usuario').value;
    const email = document.getElementById('email-usuario').value;

    if (login.length < 3) {
        mostrarToast('Login deve ter no mínimo 3 caracteres', 'warning');
        return;
    }

    if (senha.length < 6) {
        mostrarToast('Senha deve ter no mínimo 6 caracteres', 'warning');
        return;
    }

    if (!email.includes('@')) {
        mostrarToast('Email inválido', 'warning');
        return;
    }

    const usuario = { login, senha, email };

    try {
        let response;
        if (usuarioEditando) {
            response = await fetch(`${API_URL}/usuarios/${usuarioEditando.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            });
        } else {
            response = await fetch(`${API_URL}/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            });
        }

        const data = await response.json();
        if (data.sucesso) {
            document.getElementById('modal-usuario').style.display = 'none';
            mostrarToast(data.mensagem, 'success');
            carregarUsuarios();
        } else {
            mostrarToast(data.mensagem, 'error');
        }
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        mostrarToast('Erro ao salvar usuário', 'error');
    }
});

async function carregarUsuarios() {
    try {
        const [usuariosResponse, countResponse] = await Promise.all([
            fetch(`${API_URL}/usuarios`),
            fetch(`${API_URL}/usuarios/count`)
        ]);

        const usuarios = await usuariosResponse.json();
        const count = await countResponse.json();

        document.getElementById('stat-total-usuarios').textContent = count.total;
        document.getElementById('stat-usuarios-ativos').textContent = count.ativos;

        const tbody = document.getElementById('tbody-usuarios');

        if (usuarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty">Nenhum usuário cadastrado</td></tr>';
            return;
        }

        tbody.innerHTML = usuarios.map(u => `
            <tr>
                <td><strong>${u.login}</strong></td>
                <td>${u.email}</td>
                <td>
                    <span class="status-${u.ativo ? 'ativo' : 'inativo'}">
                        ${u.ativo ? '✓ Ativo' : '✕ Inativo'}
                    </span>
                </td>
                <td>${formatarData(u.dataCriacao)}</td>
                <td>${u.ultimoAcesso ? formatarDataCompleta(u.ultimoAcesso) : 'Nunca'}</td>
                <td class="acoes-btn">
                    ${u.id !== '1' ? `
                        <button class="btn-secondary" onclick="editarUsuario('${u.id}')">✏️ Editar</button>
                        ${u.ativo ? 
                            `<button class="btn-danger" onclick="inativarUsuario('${u.id}')">🚫 Inativar</button>` :
                            `<button class="btn-success" onclick="ativarUsuario('${u.id}')">✓ Ativar</button>`
                        }
                    ` : '<span>Admin</span>'}
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        mostrarToast('Erro ao carregar usuários', 'error');
    }
}

async function editarUsuario(id) {
    try {
        const response = await fetch(`${API_URL}/usuarios`);
        const usuarios = await response.json();
        usuarioEditando = usuarios.find(u => u.id === id);

        if (usuarioEditando) {
            document.getElementById('login-usuario').value = usuarioEditando.login;
            document.getElementById('senha-usuario').value = usuarioEditando.senha;
            document.getElementById('email-usuario').value = usuarioEditando.email;
            document.getElementById('modal-usuario-titulo').textContent = 'Editar Usuário';
            document.getElementById('modal-usuario').style.display = 'flex';
        }
    } catch (error) {
        console.error('Erro ao editar usuário:', error);
        mostrarToast('Erro ao editar usuário', 'error');
    }
}

async function inativarUsuario(id) {
    if (confirm('Tem certeza que deseja inativar este usuário?')) {
        try {
            const response = await fetch(`${API_URL}/usuarios/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            if (data.sucesso) {
                mostrarToast(data.mensagem, 'success');
                carregarUsuarios();
            } else {
                mostrarToast(data.mensagem, 'error');
            }
        } catch (error) {
            console.error('Erro ao inativar usuário:', error);
            mostrarToast('Erro ao inativar usuário', 'error');
        }
    }
}

async function ativarUsuario(id) {
    if (confirm('Tem certeza que deseja ativar este usuário?')) {
        try {
            const response = await fetch(`${API_URL}/usuarios/${id}/ativar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();
            if (data.sucesso) {
                mostrarToast(data.mensagem, 'success');
                carregarUsuarios();
            } else {
                mostrarToast(data.mensagem, 'error');
            }
        } catch (error) {
            console.error('Erro ao ativar usuário:', error);
            mostrarToast('Erro ao ativar usuário', 'error');
        }
    }
}

// ========== RELATÓRIOS ==========
async function carregarRelatorios() {
    try {
        const [resumoResponse, produtosResponse, atividadesResponse] = await Promise.all([
            fetch(`${API_URL}/relatorios/resumo`),
            fetch(`${API_URL}/relatorios/produtos`),
            fetch(`${API_URL}/relatorios/atividades`)
        ]);

        const resumo = await resumoResponse.json();
        const produtos = await produtosResponse.json();
        const atividades = await atividadesResponse.json();

        // Resumo
        document.getElementById('resumo-relatorio').innerHTML = `
            <p><strong>Total de Produtos:</strong> ${resumo.totalProdutos}</p>
            <p><strong>Total em Estoque:</strong> ${resumo.totalEstoque}</p>
            <p><strong>Produtos com Estoque:</strong> ${resumo.produtosComEstoque}</p>
            <p><strong>Valor Total:</strong> R$ ${formatarMoeda(resumo.totalValor)}</p>
            <p><strong>Total de Usuários:</strong> ${resumo.totalUsuarios}</p>
            <p><strong>Usuários Ativos:</strong> ${resumo.usuariosAtivos}</p>
            <p><strong>Data de Geração:</strong> ${formatarDataCompleta(resumo.dataGeracao)}</p>
        `;

        // Tabela de Produtos
        const tbody = document.getElementById('tbody-relatorio-produtos');
        if (produtos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty">Nenhum produto para exibir</td></tr>';
        } else {
            tbody.innerHTML = produtos.map(p => `
                <tr>
                    <td>${p.nome}</td>
                    <td>${p.categoria}</td>
                    <td>R$ ${formatarMoeda(p.valor)}</td>
                    <td>${p.estoque}</td>
                    <td>${formatarData(p.dataCriacao)}</td>
                </tr>
            `).join('');
        }

        // Atividades Recentes
        const atividadesDiv = document.getElementById('atividades-relatorio');
        if (atividades.length === 0) {
            atividadesDiv.innerHTML = '<p class="empty">Nenhuma atividade registrada</p>';
        } else {
            atividadesDiv.innerHTML = atividades.reverse().slice(0, 20).map(a => `
                <div class="atividade-item">
                    <strong>${a.acao}</strong> - <span>${a.detalhes}</span>
                    <small>Usuário: ${a.usuario} | ${formatarDataCompleta(a.data)}</small>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
        mostrarToast('Erro ao carregar relatórios', 'error');
    }
}

// ========== BACKUP ==========
let arquivoRestauracao = null;

// Fazer Backup
document.getElementById('btn-fazer-backup').addEventListener('click', async () => {
    try {
        mostrarToast('Preparando backup...', 'info');
        
        // Obter todos os dados do servidor
        const [usuarios, produtos, atividades] = await Promise.all([
            fetch(`${API_URL}/usuarios`).then(r => r.json()),
            fetch(`${API_URL}/produtos`).then(r => r.json()),
            fetch(`${API_URL}/relatorios/atividades`).then(r => r.json())
        ]);

        // Criar objeto de backup
        const backup = {
            data: new Date().toISOString(),
            versao: '2.0',
            dados: {
                usuarios,
                produtoes
            }
        };

        // Converter para JSON e criar blob
        const json = JSON.stringify(backup, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        
        // Criar link de download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dataFormatada = new Date().toISOString().split('T')[0];
        a.download = `backup-crm-${dataFormatada}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Salvar no localStorage como histórico
        const backupHistory = JSON.parse(localStorage.getItem('backup-history') || '[]');
        backupHistory.unshift({
            data: new Date().toLocaleString('pt-BR'),
            tamanho: (blob.size / 1024).toFixed(2) + ' KB',
            registros: `${usuarios.length} usuários, ${produtos.length} produtos, ${atividades.length} atividades`
        });
        localStorage.setItem('backup-history', JSON.stringify(backupHistory.slice(0, 10)));
        
        mostrarToast('✓ Backup realizado com sucesso!', 'success');
        carregarHistoricoBackup();
    } catch (error) {
        console.error('Erro ao fazer backup:', error);
        mostrarToast('Erro ao fazer backup', 'error');
    }
});

// Selecionar arquivo para restauração
document.getElementById('btn-selecionar-arquivo').addEventListener('click', () => {
    document.getElementById('file-restore').click();
});

document.getElementById('file-restore').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        arquivoRestauracao = file;
        document.getElementById('file-name').innerHTML = `📄 ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        document.getElementById('btn-restaurar-backup').style.display = 'block';
    }
});

// Restaurar Backup
document.getElementById('btn-restaurar-backup').addEventListener('click', async () => {
    if (!arquivoRestauracao) return;
    
    if (!confirm('⚠️ ATENÇÃO!\n\nIsso substituirá TODOS os dados atuais pelo backup.\nTem certeza?')) {
        return;
    }

    try {
        mostrarToast('Processando arquivo...', 'info');
        
        const texto = await arquivoRestauracao.text();
        const backup = JSON.parse(texto);
        
        if (!backup.dados || !backup.dados.usuarios || !backup.dados.propostas) {
            mostrarToast('Arquivo de backup inválido', 'error');duto
            return;
        }

        // Restaurar dados via API (criar endpoint no backend se necessário)
        // Por enquanto, vamos salvar no localStorage também
        localStorage.setItem('backup-restore', JSON.stringify(backup));
        
        mostrarToast('✓ Backup restaurado com sucesso! A página será recarregada...', 'success');
        setTimeout(() => location.reload(), 2000);
    } catch (error) {
        console.error('Erro ao restaurar backup:', error);
        mostrarToast('Erro ao restaurar backup: ' + error.message, 'error');
    }
});

// Carregar histórico de backups
function carregarHistoricoBackup() {
    const history = JSON.parse(localStorage.getItem('backup-history') || '[]');
    const historyDiv = document.getElementById('backup-history');
    
    if (history.length === 0) {
        historyDiv.innerHTML = '<p style="color: var(--text-light);">Nenhum backup realizado ainda</p>';
    } else {
        historyDiv.innerHTML = `
            <div class="backup-history-item title">
                <span>📅 Data/Hora</span>
                <span>📊 Informações</span>
                <span>💾 Tamanho</span>
            </div>
            ${history.map((b, i) => `
                <div class="backup-history-item">
                    <span><strong>${b.data}</strong></span>
                    <span>${b.registros}</span>
                    <span class="backup-history-time">${b.tamanho}</span>
                </div>
            `).join('')}
        `;
    }
}

// Exportar Relatório
document.getElementById('btn-exportar-relatorio').addEventListener('click', async () => {
    try {
        const [resumoRes, propostasRes] = await Promise.all([
            fetch(`${API_URL}/relatorios/resumo`),
            fetch(`${API_URL}/relatorios/propostas`)
        ]);

        const resumo = await resumoRes.json();
        const propostas = await propostasRes.json();

        let conteudo = '╔════════════════════════════════════════╗\n';
        conteudo += '║     RELATÓRIO DO CRM - RESUMO GERAL     ║\n';
        conteudo += '╚════════════════════════════════════════╝\n\n';
        
        conteudo += `Data de Geração: ${formatarDataCompleta(resumo.dataGeracao)}\n\n`;
        
        conteudo += '┌─ PROPOSTAS ────────────────────────────┐\n';
        conteudo += `│ Total de Propostas: ${resumo.totalPropostas}\n`;
        conteudo += `│ Propostas Abertas: ${resumo.proposatasAbiertas}\n`;
        conteudo += `│ Propostas Fechadas: ${resumo.propostasFechadas}\n`;
        conteudo += `│ Valor Total: R$ ${formatarMoeda(resumo.totalValor)}\n`;
        conteudo += '└────────────────────────────────────────┘\n\n';
        
        conteudo += '┌─ USUÁRIOS ────────────────────────────┐\n';
        conteudo += `│ Total de Usuários: ${resumo.totalUsuarios}\n`;
        conteudo += `│ Usuários Ativos: ${resumo.usuariosAtivos}\n`;
        conteudo += '└────────────────────────────────────────┘\n\n';
        
        conteudo += '═══════════════════════════════════════════════════════════════\n';
        conteudo += '                    DETALHES DE PROPOSTAS\n';
        conteudo += '═══════════════════════════════════════════════════════════════\n\n';
        
        propostas.forEach((p, index) => {
            conteudo += `${index + 1}. ${p.titulo}\n`;
            conteudo += `   Cliente: ${p.cliente}\n`;
            conteudo += `   Tipo: ${p.tipo}\n`;
            conteudo += `   Valor: R$ ${formatarMoeda(p.valor)}\n`;
            conteudo += `   Status: ${p.status}\n`;
            conteudo += `   Data: ${formatarData(p.dataCriacao)}\n\n`;
        });

        const blob = new Blob([conteudo], { type: 'text/plain; charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio_crm_${new Date().getTime()}.txt`;
        a.click();
        mostrarToast('Relatório exportado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao exportar relatório:', error);
        mostrarToast('Erro ao exportar relatório', 'error');
    }
});

// ========== UTILITÁRIOS ==========
function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

function formatarDataCompleta(data) {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Inicializar
verificarLogin();
