function normalizarCategoria(valor = '') {
  return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

const categoriaAtual = document.body.dataset.category;
const grade = document.querySelector('#categoryProductGrid');
const busca = document.querySelector('#categorySearch');
const statusBusca = document.querySelector('#categorySearchStatus');

function produtosDaCategoria() {
  return (window.PRODUTOS || []).filter(produto => produto.categoria === categoriaAtual);
}

function renderizarCategoria(termo = '') {
  if (!grade) return;
  const q = normalizarCategoria(termo);
  const produtos = produtosDaCategoria().filter(produto => {
    if (!q) return true;
    const texto = normalizarCategoria(`${produto.nome} ${produto.tipo} ${produto.tags} ${produto.codigo}`);
    return texto.includes(q);
  });

  grade.innerHTML = '';

  produtos.forEach(produto => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-media">
        <img src="${produto.imagem}" alt="${produto.nome}" />
      </div>
      <div class="product-info">
        <span class="product-type">${produto.tipo} • ${produto.codigo}</span>
        <h3>${produto.nome}</h3>
        <p class="price">${produto.preco}</p>
        <a class="button secondary product-button" href="${produto.pagina}">Ver este modelo</a>
      </div>
    `;
    grade.appendChild(card);
  });

  if (statusBusca) {
    statusBusca.textContent = q
      ? `${produtos.length} modelo${produtos.length === 1 ? '' : 's'} encontrado${produtos.length === 1 ? '' : 's'}.`
      : `${produtos.length} modelo${produtos.length === 1 ? '' : 's'} disponível${produtos.length === 1 ? '' : 'is'}.`;
  }
}

if (busca) busca.addEventListener('input', e => renderizarCategoria(e.target.value));
renderizarCategoria();
