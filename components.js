// =========================================================================
// Syntax Code — partes comuns do site
// Cabeçalho, rodapé, cartões de produto (apps.json), links de download e revelação ao rolar.
// =========================================================================

const MARCA_SVG = `
<svg class="marca-simbolo" viewBox="0 0 36 36" aria-hidden="true">
    <rect width="36" height="36" rx="9" fill="#3D5AFE"/>
    <path d="M24 10.5H12.5V18h11v7.5H11" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="26.5" y="21" width="3.4" height="5.2" rx=".6" fill="#14B8A6"/>
</svg>`;

const MARCA = `<a href="index.html" class="marca" aria-label="Syntax Code — página inicial">${MARCA_SVG}<span class="marca-nome">Syntax<span>Code</span></span></a>`;

const EMAIL_CONTATO = "gustavoduran22@gmail.com";
const GITHUB = "https://github.com/GustavoDuranBR";

function paginaAtual() {
    return (location.pathname.split("/").pop() || "index.html").toLowerCase();
}

function montarCabecalho() {
    const alvo = document.getElementById("cabecalho-site");
    if (!alvo) return;
    const atual = paginaAtual();
    const link = (href, texto) => `<a href="${href}"${href === atual ? ' aria-current="page"' : ""}>${texto}</a>`;
    alvo.className = "cabecalho-site";
    alvo.innerHTML = `
        <div class="largura cabecalho-conteudo">
            ${MARCA}
            <button type="button" class="menu-botao" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu-principal">
                <i class="fa-solid fa-bars"></i>
            </button>
            <nav id="menu-principal" class="menu" aria-label="Menu principal">
                ${link("index.html#produtos", "Produtos")}
                ${link("index.html#servicos", "Serviços")}
                ${link("sistema-juridico.html", "Jurix")}
                ${link("quem-somos.html", "Sobre")}
                <a href="discovery.html" class="botao botao-primario botao-pequeno">Iniciar um projeto</a>
            </nav>
        </div>`;

    const botao = alvo.querySelector(".menu-botao");
    const menu = alvo.querySelector(".menu");
    botao.addEventListener("click", () => {
        const aberto = menu.classList.toggle("aberto");
        botao.setAttribute("aria-expanded", String(aberto));
        botao.innerHTML = aberto ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
        menu.classList.remove("aberto");
        botao.setAttribute("aria-expanded", "false");
        botao.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }));
}

function montarRodape() {
    const alvo = document.getElementById("rodape-site");
    if (!alvo) return;
    alvo.className = "rodape";
    alvo.innerHTML = `
        <div class="largura">
            <div class="rodape-grade">
                <div>
                    ${MARCA}
                    <p>Engenharia de software para empresas e profissionais: produtos próprios,
                    sistemas sob medida, automações e integrações.</p>
                </div>
                <div>
                    <h4>Produtos</h4>
                    <ul>
                        <li><a href="sistema-juridico.html">Jurix</a></li>
                        <li><a href="index.html#utilitarios">Utilitários</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Empresa</h4>
                    <ul>
                        <li><a href="quem-somos.html">Sobre</a></li>
                        <li><a href="index.html#servicos">Serviços</a></li>
                        <li><a href="discovery.html">Iniciar um projeto</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Contato</h4>
                    <ul>
                        <li><a href="mailto:${EMAIL_CONTATO}"><i class="fa-regular fa-envelope"></i> E-mail</a></li>
                        <li><a href="${GITHUB}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> GitHub</a></li>
                    </ul>
                </div>
            </div>
            <div class="rodape-base">
                <span>&copy; ${new Date().getFullYear()} Syntax Code. Todos os direitos reservados.</span>
                <span>Feito no Brasil.</span>
            </div>
        </div>`;
}

// ---- apps.json: cartões de produto e links de download ----
let promessaApps = null;
function carregarApps() {
    if (!promessaApps) {
        promessaApps = fetch("apps.json", { cache: "no-cache" })
            .then(r => r.json())
            .catch(erro => { console.error("Não foi possível carregar apps.json:", erro); return []; });
    }
    return promessaApps;
}

function escapar(texto) {
    const div = document.createElement("div");
    div.textContent = texto == null ? "" : String(texto);
    return div.innerHTML;
}

function cartaoProduto(app) {
    const baixar = app.download_url
        ? `<a class="botao botao-contorno botao-pequeno" href="${escapar(app.download_url)}"><i class="fa-solid fa-download"></i> Baixar</a>`
        : "";
    return `
        <article class="produto revelar">
            <div class="produto-topo">
                <span class="icone-quadro"><i class="fa-solid ${escapar(app.icone)}"></i></span>
                ${app.versao ? `<span class="versao">${escapar(app.versao)}</span>` : ""}
            </div>
            <span class="etiqueta">${escapar(app.rotulo || "")}</span>
            <h3>${escapar(app.titulo)}</h3>
            <p>${escapar(app.resumo)}</p>
            <div class="produto-acoes">
                <a class="botao botao-escuro botao-pequeno" href="${escapar(app.detalhes_url)}">Ver detalhes</a>
                ${baixar}
            </div>
        </article>`;
}

async function montarGrades() {
    const grades = document.querySelectorAll("[data-grade-apps]");
    if (!grades.length) return;
    const apps = await carregarApps();
    grades.forEach(grade => {
        const categoria = grade.dataset.gradeApps;
        grade.innerHTML = apps.filter(a => a.categoria === categoria).map(cartaoProduto).join("");
        observarRevelacao(grade.querySelectorAll(".revelar"));
    });
}

// <a data-download="pytubepro"> recebe o link do instalador; data-versao / data-manual preenchem versão e manual
async function preencherDownloads() {
    const alvos = document.querySelectorAll("[data-download], [data-versao], [data-manual]");
    if (!alvos.length) return;
    const apps = await carregarApps();
    const achar = id => apps.find(a => a.id === id);
    document.querySelectorAll("[data-download]").forEach(el => {
        const app = achar(el.dataset.download);
        if (app && app.download_url) el.href = app.download_url;
        else el.setAttribute("aria-disabled", "true");
    });
    document.querySelectorAll("[data-versao]").forEach(el => {
        const app = achar(el.dataset.versao);
        if (app) el.textContent = app.versao;
    });
    document.querySelectorAll("[data-manual]").forEach(el => {
        const app = achar(el.dataset.manual);
        if (app && app.manual_url) el.href = app.manual_url;
        else el.hidden = true;
    });
}

// ---- Revelação suave das seções ----
let observador = null;
function observarRevelacao(elementos) {
    if (!("IntersectionObserver" in window)) {
        elementos.forEach(el => el.classList.add("visivel"));
        return;
    }
    if (!observador) {
        observador = new IntersectionObserver(entradas => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visivel");
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    }
    elementos.forEach(el => observador.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
    montarCabecalho();
    montarRodape();
    montarGrades();
    preencherDownloads();
    observarRevelacao(document.querySelectorAll(".revelar"));
});
