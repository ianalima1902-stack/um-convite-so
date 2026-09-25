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
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}


// ==============================
// BUSCA DA HOME
// ==============================

const homeSearch = document.querySelector('#productSearch');
const searchStatus = document.querySelector('#searchStatus');

if (homeSearch && window.PRODUTOS) {
  const resultsBox = document.createElement('div');
  resultsBox.className = 'catalog-search-results';

  homeSearch
    .closest('.search-section')
    ?.appendChild(resultsBox);

  function pesquisarCatalogo() {
    const termo = normalizar(homeSearch.value);

    resultsBox.innerHTML = '';

    if (!termo) {
      resultsBox.hidden = true;

      if (searchStatus) {
        searchStatus.textContent = '';
      }

      return;
    }

    const resultados = window.PRODUTOS.filter(produto => {
      const texto = normalizar(`
        ${produto.nome}
        ${produto.categoria}
        ${produto.tipo}
        ${produto.tags}
        ${produto.codigo}
      `);

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

    resultados
      .slice(0, 8)
      .forEach(produto => {
        const link = document.createElement('a');

        link.className = 'catalog-search-item';
        link.href = produto.pagina;

        link.innerHTML = `
          <img
            src="${produto.imagem}"
            alt=""
          />

          <span>
            <strong>
              ${produto.nome}
            </strong>

            <small>
              ${produto.codigo}
              •
              ${produto.tipo}
              •
              ${produto.preco}
            </small>
          </span>
        `;

        resultsBox.appendChild(link);
      });

    resultsBox.hidden = false;
  }

  homeSearch.addEventListener(
    'input',
    pesquisarCatalogo
  );
}


// ==============================
// FORMULÁRIO PERSONALIZADO
// ==============================

const modal = document.querySelector('#contactModal');
const customProject = document.querySelector('#customProject');
const customProjectForm = document.querySelector('#customProjectForm');

const customName = document.querySelector('#customName');
const customTheme = document.querySelector('#customTheme');
const customType = document.querySelector('#customType');
const customColors = document.querySelector('#customColors');
const customDate = document.querySelector('#customDate');

const whatsappNumber = '5585992875129';


function openModal() {
  if (!modal) return;

  modal.classList.add('open');

  modal.setAttribute(
    'aria-hidden',
    'false'
  );

  setTimeout(() => {
    customName?.focus();
  }, 100);
}


function closeModal() {
  if (!modal) return;

  modal.classList.remove('open');

  modal.setAttribute(
    'aria-hidden',
    'true'
  );
}


if (customProject) {
  customProject.addEventListener(
    'click',
    openModal
  );
}


document
  .querySelectorAll('.modal-close')
  .forEach(button => {
    button.addEventListener(
      'click',
      closeModal
    );
  });


if (modal) {
  modal.addEventListener(
    'click',
    event => {
      if (event.target === modal) {
        closeModal();
      }
    }
  );
}


document.addEventListener(
  'keydown',
  event => {
    if (event.key === 'Escape') {
      closeModal();
    }
  }
);


// ==============================
// ENVIO PARA WHATSAPP
// ==============================

if (customProjectForm) {
  customProjectForm.addEventListener(
    'submit',
    event => {
      event.preventDefault();

      const dataFesta = customDate.value
        ? new Date(
            `${customDate.value}T12:00:00`
          ).toLocaleDateString('pt-BR')
        : '';

      const message = [
        'Olá! Gostaria de solicitar um projeto personalizado na Um Convite Só.',
        '',
        `Meu nome: ${customName.value.trim()}`,
        `Tema da festa: ${customTheme.value.trim()}`,
        `Modelo de convite: ${customType.value}`,
        `Cores desejadas: ${customColors.value.trim()}`,
        `Data da festa: ${dataFesta}`
      ].join('\n');

      const whatsappUrl =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      window.open(
        whatsappUrl,
        '_blank',
        'noopener'
      );
    }
  );
}
