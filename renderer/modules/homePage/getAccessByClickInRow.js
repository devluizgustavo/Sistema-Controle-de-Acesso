//Criar função que pega a TR da tabela que o usuário selecionou
global.idAccess = null;

export default async function getAccessByClickInBtn() {
  const table = document.getElementById('access-table');

  table.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');

    if (tr) {
      const ths = tr.querySelectorAll('td');
      const id = ths[0].textContent;

      global.idAccess = id;
    }
  })
}