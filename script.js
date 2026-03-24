let dados = [];

async function carregarDados() {
  try {
    const response = await fetch(CONFIG.API_URL);
    dados = await response.json();

    montarFiltro();
    renderizarCards(dados);

  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
  }
}

function montarFiltro() {
  const filtro = document.getElementById("filtro");

  const valores = [...new Set(dados.map(d => d.CRE))];

  valores.forEach(valor => {
    const option = document.createElement("option");
    option.value = valor;
    option.textContent = valor;
    filtro.appendChild(option);
  });

  filtro.addEventListener("change", aplicarFiltro);
}

function aplicarFiltro() {
  const valor = document.getElementById("filtro").value;

  const filtrados = valor
    ? dados.filter(d => d.CRE === valor)
    : dados;

  renderizarCards(filtrados);
}

function renderizarCards(lista) {
  const container = document.getElementById("cards");
  container.innerHTML = "";

  lista.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${item.Escola}</h3>
      <p><strong>CRE:</strong> ${item.CRE}</p>
      <p><strong>Status:</strong> ${item.Status || "Não informado"}</p>
    `;

    container.appendChild(card);
  });
}

carregarDados();