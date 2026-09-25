// =========================================================================
// Jurix — landing page
// =========================================================================

// ---- Troca de aparência da janela de demonstração (botões do topo e cartões da seção "Aparências")
const janela = document.getElementById('janela-demo');
const botoesTema = document.querySelectorAll('[data-ver-tema]');

function mostrarTema(tema) {
    if (!janela) return;
    janela.dataset.tema = tema;
    botoesTema.forEach(botao => botao.setAttribute('aria-pressed', String(botao.dataset.verTema === tema)));
}

botoesTema.forEach(botao => {
    botao.addEventListener('click', () => {
        mostrarTema(botao.dataset.verTema);
        // Os cartões ficam longe da janela: rola até ela para o visitante ver a troca
        if (botao.classList.contains('cartao-tema')) {
            janela.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});

// ---- Menu no celular
const botaoMenu = document.querySelector('.menu-botao');
const menu = document.getElementById('menu-principal');

if (botaoMenu && menu) {
    botaoMenu.addEventListener('click', () => {
        const aberto = menu.classList.toggle('aberto');
        botaoMenu.setAttribute('aria-expanded', String(aberto));
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        menu.classList.remove('aberto');
        botaoMenu.setAttribute('aria-expanded', 'false');
    }));
}
