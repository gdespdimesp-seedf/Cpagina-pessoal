let dados = [];

async function carregarDados() {
  try {
    const response = await fetch(CONFIG.API_URL);
    dados = await response.json();

    if (!Array.isArray(dados)) {
      console.error("Resposta inválida:", dados);
      document.getElementById("cards").innerHTML = "<p>Erro ao carregar os dados.</p>";
      return;
    }

    montarFiltro();
    renderizarCards(dados);
  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
    document.getElementById("cards").innerHTML = "<p>Erro ao carregar os dados.</p>";
  }
}

function montarFiltro() {
  const filtro = document.getElementById("filtro");
  filtro.innerHTML = '<option value="">Todas as CREs</option>';

  const cres = [...new Set(dados.map(item => item.CRE).filter(Boolean))].sort();

  cres.forEach(cre => {
    const option = document.createElement("option");
    option.value = cre;
    option.textContent = cre;
    filtro.appendChild(option);
  });

  filtro.addEventListener("change", aplicarFiltro);
}

function aplicarFiltro() {
  const valor = document.getElementById("filtro").value;
  const filtrados = valor ? dados.filter(item => item.CRE === valor) : dados;
  renderizarCards(filtrados);
}

function pegarCampo(item, opcoes) {
  for (const nome of opcoes) {
    if (item[nome] !== undefined && item[nome] !== null && item[nome] !== "") {
      return item[nome];
    }
  }
  return "-";
}

function renderizarCards(lista) {
  const container = document.getElementById("cards");
  container.innerHTML = "";

  if (!lista.length) {
    container.innerHTML = "<p>Nenhum registro encontrado.</p>";
    return;
  }

  lista.forEach(item => {
    const escola = pegarCampo(item, ["Escola", "ESCOLA", "UNIDADE ESCOLAR", "Unidade Escolar"]);
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