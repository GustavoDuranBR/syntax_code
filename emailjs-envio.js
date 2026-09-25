// =========================================================================
// Syntax Code — envio dos formulários do site pelo EmailJS (serviço Zoho)
// Dois templates genéricos, usados pelo Levantamento e pela Demonstração do Jurix:
//   - relatório interno: chega em contato@syntaxcode.com.br (Reply-To = e-mail do visitante)
//   - confirmação: vai para o e-mail que o visitante digitou
// =========================================================================
const ENVIO_EMAILJS = {
    chavePublica: "nvHtp6NoHBReG0C6f",
    servico: "service_3h4v4bg",            // Zoho (@syntaxcode.com.br)
    templateRelatorio: "template_x6ygx0i",
    templateConfirmacao: "template_iu68idb",
};

let emailjsIniciado = false;

function escaparHtml(texto) {
    return String(texto == null ? "" : texto)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// Tabela "rótulo | valor" para o relatório interno (valores escapados: o template usa {{{detalhes}}})
function linhasRelatorio(linhas) {
    const td = "padding:7px 0;font-size:13px;border-top:1px solid #E3E6EC;";
    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' +
        linhas.map(([rotulo, valor]) =>
            `<tr><td style="${td}color:#4B5565;width:150px;vertical-align:top;">${escaparHtml(rotulo)}</td>` +
            `<td style="${td}color:#0F172A;">${escaparHtml(valor || "—")}</td></tr>`).join("") +
        "</table>";
}

// Bloco de texto livre (respeita as quebras de linha)
function blocoRelatorio(rotulo, texto) {
    return '<div style="padding-top:22px;">' +
        `<div style="font-family:Consolas,'Courier New',monospace;font-size:12px;color:#3D5AFE;padding-bottom:8px;">// ${escaparHtml(rotulo)}</div>` +
        `<div style="font-size:14px;color:#0F172A;line-height:1.7;white-space:pre-line;">${escaparHtml(texto || "—")}</div></div>`;
}

// Campo invisível para pessoas; robôs costumam preencher. Preenchido = descarta sem avisar.
function ehRobo(formulario) {
    const armadilha = formulario && formulario.querySelector('[name="site_empresa"]');
    return !!(armadilha && armadilha.value);
}

/**
 * params do relatório e da confirmação (as duas usam o mesmo objeto):
 *   nome, email, data, rotulo, titulo, destaque_rotulo, destaque_texto, detalhes (HTML),
 *   titulo_confirmacao, mensagem, r1_rotulo..r4_rotulo, r1_valor..r4_valor
 */
function enviarPeloEmailJS(params) {
    if (!emailjsIniciado) {
        emailjs.init({ publicKey: ENVIO_EMAILJS.chavePublica });
        emailjsIniciado = true;
    }
    const completos = Object.assign({ data: new Date().toLocaleDateString("pt-BR") }, params);
    for (let i = 1; i <= 4; i++) {
        completos[`r${i}_rotulo`] = completos[`r${i}_rotulo`] || "";
        completos[`r${i}_valor`] = completos[`r${i}_valor`] || "—";
    }
    return Promise.all([
        emailjs.send(ENVIO_EMAILJS.servico, ENVIO_EMAILJS.templateRelatorio, completos),
        emailjs.send(ENVIO_EMAILJS.servico, ENVIO_EMAILJS.templateConfirmacao, completos),
    ]);
}
