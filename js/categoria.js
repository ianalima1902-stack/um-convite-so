function normalizarCategoria(valor = '') {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}


const categoriaAtual =
  document.body.dataset.category;

const grade =
  document.querySelector('#categoryProductGrid');

const busca =
  document.querySelector('#categorySearch');

const statusBusca =
  document.querySelector('#categorySearchStatus');


// ==============================
// FILTRO POR TIPO DE CONVITE
// ==============================

let filtroTipoAtual = 'todos';

const tiposDeConvite = [
  {
    valor: 'todos',
    texto: 'Todos'
  },
  {
    valor: 'tradicional',
    texto: 'Tradicional'
  },
  {
    valor: 'interativo',
    texto: 'Interativo'
  },
  {
    valor: 'animado',
    texto: 'Animado'
  },
  {
    valor: 'cinematografico',
    texto: 'Cinematográfico'
  }
];


function criarFiltros() {
  if (!grade) return;

  const filtros = document.createElement('div');

  filtros.className = 'category-type-filters';

  filtros.setAttribute(
    'aria-label',
    'Filtrar por tipo de convite'
  );


  tiposDeConvite.forEach(tipo => {

    const botao =
      document.createElement('button');

    botao.type = 'button';

    botao.className =
      'category-filter-button';

    botao.dataset.tipo =
      tipo.valor;

    botao.textContent =
      tipo.texto;


    if (tipo.valor === 'todos') {
      botao.classList.add('active');
    }


    botao.addEventListener(
      'click',
      () => {

        filtroTipoAtual =
          tipo.valor;


        document
          .querySelectorAll('.category-filter-button')
          .forEach(item => {

            item.classList.toggle(
              'active',
              item === botao
            );

          });


        renderizarCategoria(
          busca ? busca.value : ''
        );

      }
    );


    filtros.appendChild(botao);

  });


  grade.parentNode.insertBefore(
    filtros,
    grade
  );
}


// ==============================
// PRODUTOS DA CATEGORIA
// ==============================

function produtosDaCategoria() {

  return (window.PRODUTOS || [])
    .filter(produto =>
      produto.categoria === categoriaAtual
    );

}


// ==============================
// RENDERIZAÇÃO DO CATÁLOGO
// ==============================

function renderizarCategoria(termo = '') {

  if (!grade) return;


  const q =
    normalizarCategoria(termo);


  const produtos =
    produtosDaCategoria()
      .filter(produto => {

        // FILTRO DE TIPO

        const tipoProduto =
          normalizarCategoria(produto.tipo);

        const passaNoTipo =
          filtroTipoAtual === 'todos'
          ||
          tipoProduto === filtroTipoAtual;


        if (!passaNoTipo) {
          return false;
        }


        // FILTRO DA BUSCA

        if (!q) {
          return true;
        }


        const texto =
          normalizarCategoria(`
            ${produto.nome}
            ${produto.tipo}
            ${produto.tags}
            ${produto.codigo}
          `);


        return texto.includes(q);

      });


  grade.innerHTML = '';


  produtos.forEach(produto => {

    const card =
      document.createElement('article');


    card.className =
      'product-card';


    card.innerHTML = `
      <div class="product-media">

        <img
          src="${produto.imagem}"
          alt="${produto.nome}"
        />

      </div>

      <div class="product-info">

        <span class="product-type">
          ${produto.tipo} • ${produto.codigo}
        </span>

        <h3>
          ${produto.nome}
        </h3>

        <p class="price">
          ${produto.preco}
        </p>

        <a
          class="button secondary product-button"
          href="${produto.pagina}"
        >
          Ver este modelo
        </a>

      </div>
    `;


    grade.appendChild(card);

  });


  // ==============================
  // MENSAGEM QUANDO NÃO HÁ MODELOS
  // ==============================

  if (!produtos.length) {

    const vazio =
      document.createElement('div');


    vazio.className =
      'category-empty';


    vazio.innerHTML = `
      <strong>
        Nenhum modelo encontrado.
      </strong>

      <p>
        Tente outro filtro ou faça uma nova busca.
      </p>
    `;


    grade.appendChild(vazio);

  }


  // ==============================
  // STATUS
  // ==============================

  if (statusBusca) {

    const nomeFiltro =
      tiposDeConvite.find(
        tipo =>
          tipo.valor === filtroTipoAtual
      )?.texto;


    if (q) {

      statusBusca.textContent =
        `${produtos.length} modelo${
          produtos.length === 1 ? '' : 's'
        } encontrado${
          produtos.length === 1 ? '' : 's'
        }.`;

    } else if (
      filtroTipoAtual !== 'todos'
    ) {

      statusBusca.textContent =
        `${produtos.length} convite${
          produtos.length === 1 ? '' : 's'
        } do tipo ${nomeFiltro}.`;

    } else {

      statusBusca.textContent =
        `${produtos.length} modelo${
          produtos.length === 1 ? '' : 's'
        } disponível${
          produtos.length === 1 ? '' : 'is'
        }.`;

    }

  }

}


// ==============================
// BUSCA
// ==============================

if (busca) {

  busca.addEventListener(
    'input',
    event => {

      renderizarCategoria(
        event.target.value
      );

    }
  );

}


// ==============================
// INICIALIZAÇÃO
// ==============================

criarFiltros();

renderizarCategoria();
