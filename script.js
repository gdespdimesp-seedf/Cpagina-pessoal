let dados = [];

function carregarDados() {
  const scriptExistente = document.getElementById("jsonp-dados");
  if (scriptExistente) {
    scriptExistente.remove();
  }

  const script = document.createElement("script");
  script.id = "jsonp-dados";
  script.src = CONFIG.API_URL + "?callback=receberDados";
  script.onerror = function () {
    const container = document.getElementById("cards");
    if (container) {
      container.innerHTML = "<p>Erro ao carregar os dados.</p>";
    }
    console.error("Erro ao carregar o script JSONP.");
  };

  document.body.appendChild(script);
}

function receberDados(resposta) {
  const container = document.getElementById("cards");

  if (!Array.isArray(resposta)) {
    console.error("Resposta inválida:", resposta);
    if (container) {
      container.innerHTML = "<p>Erro ao carregar os dados.</p>";
    }
    return;
  }

  dados = resposta;
  montarFiltro();
  renderizarCards(dados);
}

function montarFiltro() {
  const filtro = document.getElementById("filtro");
  if (!filtro) return;

  filtro.innerHTML = '<option value="">Todas as CREs</option>';

  const cres = [...new Set(dados.map(item => item.CRE).filter(Boolean))].sort();

  cres.forEach(cre => {
    const option = document.createElement("option");
    option.value = cre;
    option.textContent = cre;
    filtro.appendChild(option);
  });

  filtro.onchange = aplicarFiltro;
}

function aplicarFiltro() {
  const filtro = document.getElementById("filtro");
  if (!filtro) return;

  const valor = filtro.value;
  const filtrados = valor ? dados.filter(item => item.CRE === valor) : dados;

  renderizarCards(filtrados);
}

function pegarCampo(item, opcoes) {
  for (const nome of opcoes) {
    if (
      item[nome] !== undefined &&
      item[nome] !== null &&
      String(item[nome]).trim() !== ""
    ) {
      return item[nome];
    }
  }
  return "-";
}

function renderizarCards(lista) {
  const container = document.getElementById("cards");
  if (!container) return;

  container.innerHTML = "";

  if (!lista.length) {
    container.innerHTML = "<p>Nenhum registro encontrado.</p>";
    return;
  }

  lista.forEach(item => {
    const escola = pegarCampo(item, [
      "Escola",
      "ESCOLA",
      "UNIDADE ESCOLAR",
      "Unidade Escolar",
      "IE",
      "Instituição Educacional"
    ]);

    const cre = pegarCampo(item, ["CRE"]);
    const professor = pegarCampo(item, ["Professor", "PROFESSOR"]);
    const programa = pegarCampo(item, ["Programa", "PROGRAMA"]);
    const status = pegarCampo(item, ["Status", "STATUS", "Situação", "SITUAÇÃO"]);

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${escola}</h3>
      <p><strong>CRE:</strong> ${cre}</p>
      <p><strong>Professor:</strong> ${professor}</p>
      <p><strong>Programa:</strong> ${programa}</p>
      <p><strong>Status:</strong> ${status}</p>
    `;

    container.appendChild(card);
  });
}

carregarDados();