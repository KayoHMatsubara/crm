# Pasta de Assets - CRM

Estrutura de pastas para imagens e recursos visuais do CRM.

## 📁 Estrutura

```
assets/
├── backgrounds/     # Imagens de fundo para tela de login
├── icons/          # Ícones do sistema
├── logos/          # Logos e branding
└── README.md       # Este arquivo
```

## 🖼️ Como Usar Imagens de Fundo na Tela de Login

### Passo 1: Coloque sua imagem na pasta
Coloque seus arquivos de imagem em:
```
CRM/frontend/assets/backgrounds/
```

**Formatos recomendados:**
- `.jpg` ou `.jpeg` - Melhor para fotos
- `.png` - Para transparência
- `.webp` - Mais leve (moderno)

**Tamanho recomendado:**
- Largura: 1920px ou superior
- Altura: 1080px ou superior
- Tamanho: Máximo 500KB

### Passo 2: Edite o CSS

Abra o arquivo: `CRM/frontend/css/style.css`

Localize a seção "LOGIN PAGE" (linha ~98) e descomente a seção:

**Antes:**
```css
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #0F172A 0%, #1a2540 100%);
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    position: relative;
}

/* Para usar imagem de background, descomente e ajuste o caminho: */
/* 
.login-container {
    background-image: url('../assets/backgrounds/sua-imagem.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
}
*/
```

**Depois (exemplo com sua imagem):**
```css
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: url('../assets/backgrounds/login-bg.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    position: relative;
}
```

### Passo 3: Recarregue o navegador

Abra **http://localhost:3000** e veja sua imagem como fundo!

## 📸 Exemplo de Imagem Perfeita

Características ideais para imagem de fundo de login:
- ✅ Visualmente interessante mas não distrativo
- ✅ Cores escuras (azul, cinza, preto) para contraste com caixa branca
- ✅ Padrões sutis ou gradientes
- ✅ Sem muitos detalhes pequenos (difícil ver)
- ✅ Aspecto 16:9 (widescreen)

**Exemplo de temas:**
- Fundo azul gradiente
- Padrão geométrico
- Imagem de tecnologia/negócios
- Gradiente com desfoque
- Padrão de pontos ou linhas

## 🎨 CSS Adicional para Customização

Se desejar, você pode adicionar efeitos:

### Blur (desfoque)
```css
.login-container {
    background-image: url('../assets/backgrounds/login-bg.jpg');
    background-size: cover;
    background-position: center;
    filter: blur(5px);
}
```

### Escurecer mais a imagem
Modifique o overlay no CSS:
```css
.login-container::before {
    background: rgba(15, 23, 42, 0.6); /* Aumente para mais escuro */
    z-index: 1;
}
```

### Colorir a imagem
```css
.login-container::before {
    background: rgba(15, 23, 42, 0.4);
    mix-blend-mode: multiply;
    z-index: 1;
}
```

## 📝 Estrutura de Pastas Completa

```
CRM/
├── frontend/
│   ├── assets/
│   │   ├── backgrounds/
│   │   │   ├── login-bg.jpg
│   │   │   ├── login-bg-2.jpg
│   │   │   └── README.md (este arquivo)
│   │   ├── icons/
│   │   │   ├── logo.png
│   │   │   └── favicon.ico
│   │   └── logos/
│   │       └── company-logo.png
│   ├── css/
│   ├── js/
│   └── index.html
├── backend/
└── README.md
```

## 💡 Dicas

1. **Teste responsividade** - Veja como fica em mobile também
2. **Use URLs relativas** - Sempre use `../assets/` para compatibilidade
3. **Otimize imagens** - Use ferramentas online para reduzir tamanho
4. **Tenha backup** - Guarde versões originais das imagens
5. **Teste performance** - Imagens muito pesadas podem deixar lento

## 🔧 Opções Avançadas

### Múltiplas Imagens (Rodízio)
Se quiser trocar a imagem com CSS:
```css
@media (max-width: 768px) {
    .login-container {
        background-image: url('../assets/backgrounds/login-bg-mobile.jpg');
    }
}
```

### Gradiente com Imagem
```css
.login-container {
    background: 
        linear-gradient(135deg, rgba(15, 23, 42, 0.3), rgba(26, 37, 64, 0.3)),
        url('../assets/backgrounds/login-bg.jpg');
    background-size: cover;
    background-position: center;
}
```

---

**Qualquer dúvida, consulte o CSS na linha ~98 ou edite conforme necessário!**
