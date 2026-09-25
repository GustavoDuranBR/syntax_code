# Syntax Code — site

Site institucional da **Syntax Code**, publicado pelo GitHub Pages em <https://syntaxcode.com.br>
(o arquivo `CNAME` define o domínio; o endereço antigo `gustavoduranbr.github.io/syntax_code` redireciona para ele).

HTML, CSS e JavaScript puros, sem build: basta editar e publicar.

## Estrutura

```text
index.html              página inicial (serviços, Jurix em destaque, utilitários)
sistema-juridico.html   landing do Jurix (CSS e JS em jurix/)
quem-somos.html         sobre a empresa
discovery.html          levantamento de projeto (envio por EmailJS)
pytubepro.html, filewizard.html, filereplacer.html, poemarkethelper.html
style.css               identidade visual (tokens de cor e fonte no :root)
components.js           cabeçalho, rodapé, cartões de produto e links de download
apps.json               catálogo: versão, descrição e links de download de cada produto
assets/                 favicon e marca
updates/jurix.json      manifesto de atualização do Jurix (ver abaixo)
```

## Publicar uma versão de um produto

1. Crie a release no GitHub com o instalador (os links ficam em
   `https://github.com/GustavoDuranBR/syntax_code/releases/download/<tag>/<arquivo>`).
2. Atualize `versao` e `download_url` do produto em `apps.json`.

### Jurix: `updates/jurix.json`

É lido pelo próprio Jurix para oferecer a atualização aos clientes. **Não edite à mão:** o arquivo é
assinado digitalmente e qualquer alteração faz o Jurix recusá-lo. Ele é gerado pelo
`scripts/publicar_atualizacao.py` do repositório do Jurix.

Ordem: **primeiro a release** (com o instalador de nome exato), **depois o push do site**.

## Cache do navegador

O GitHub Pages manda o navegador guardar cada arquivo por 10 minutos. Ao mudar `style.css`,
`components.js` ou os arquivos de `jurix/`, **aumente o `?v=` nas páginas** (ex.: `style.css?v=20260925`),
para o navegador não misturar HTML novo com CSS antigo (ou o contrário).

## Testar localmente

```powershell
python -m http.server 8080
```

Abra <http://localhost:8080>. Abrir os arquivos direto (`file://`) não carrega o `apps.json`.

---
© 2026 Syntax Code. Todos os direitos reservados.
