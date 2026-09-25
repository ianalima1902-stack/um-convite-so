const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function normalizar(valor = '') {
  return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// Busca da Home: pesquisa em TODO o catálogo, inclusive produtos que não aparecem nos destaques.
const homeSearch = document.querySelector('#productSearch');
const searchStatus = document.querySelector('#searchStatus');

if (homeSearch && window.PRODUTOS) {
  const resultsBox = document.createElement('div');
  resultsBox.className = 'catalog-search-results';
  homeSearch.closest('.search-section')?.appendChild(resultsBox);

  function pesquisarCatalogo() {
    const termo = normalizar(homeSearch.value);
    resultsBox.innerHTML = '';

    if (!termo) {
      resultsBox.hidden = true;
      if (searchStatus) searchStatus.textContent = '';
      return;
    }

    const resultados = window.PRODUTOS.filter(produto => {
      const texto = normalizar(`${produto.nome} ${produto.categoria} ${produto.tipo} ${produto.tags} ${produto.codigo}`);
      return texto.includes(termo);
    });

    if (searchStatus) {
      searchStatus.textContent = resultados.length
        ? `${resultados.length} modelo${resultados.length === 1 ? '' : 's'} encontrado${resultados.length === 1 ? '' : 's'} no catálogo.`
        : 'Nenhum modelo encontrado. Você também pode solicitar um projeto personalizado.';
    }

    if (!resultados.length) {
      resultsBox.hidden = true;
      return;
    }

    resultados.slice(0, 8).forEach(produto => {
      const link = document.createElement('a');
      link.className = 'catalog-search-item';
      link.href = produto.pagina;
      link.innerHTML = `
        <img src="${produto.imagem}" alt="" />
        <span>
          <strong>${produto.nome}</strong>
          <small>${produto.codigo} • ${produto.tipo} • ${produto.preco}</small>
        </span>
      `;
      resultsBox.appendChild(link);
    });

    resultsBox.hidden = false;
  }

  homeSearch.addEventListener('input', pesquisarCatalogo);
}

// Modal antigo continua disponível apenas onde ainda existir.
const modal = document.querySelector('#contactModal');
const modalTitle = document.querySelector('#modalTitle');
const modalText = document.querySelector('#modalText');

function openModal(title, text) {
  if (!modal) return;
  if (modalTitle) modalTitle.textContent = title;
  if (modalText) modalText.textContent = text;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('button.product-button[data-product]').forEach(button => {
  button.addEventListener('click', () => {
    openModal(button.dataset.product, `Este modelo já pode receber uma página individual com formulário de pedido.`);
  });
});

const customProject = document.querySelector('#customProject');
if (customProject) {
  customProject.addEventListener('click', () => {
    openModal('Projeto personalizado', 'Este botão será conectado ao WhatsApp para pedidos personalizados.');
  });
}

document.querySelectorAll('.modal-close, .modal-close-action').forEach(button => button.addEventListener('click', closeModal));
if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
