export default async function (log) {
  try {
    const tableBody = document.querySelector('#access-table-history tbody');

    if (tableBody) tableBody.innerHTML = "";

    console.log(log)
    log.forEach(val => {
      const row = document.createElement('tr');
      row.setAttribute('ident', 'rowTableAccess');

      const cellDate = document.createElement('td');
      cellDate.textContent = val.date;
      row.appendChild(cellDate);

      const cellDateTime = document.createElement('td');
      cellDateTime.textContent = val.datetime;
      row.appendChild(cellDateTime);

      const cellDepto = document.createElement('td');
      cellDepto.textContent = val.name_depto;
      row.appendChild(cellDepto);

      const cellAssunto = document.createElement('td');
      cellAssunto.innerText = val.desc_assunto;
      row.appendChild(cellAssunto);

      const cellNmControlador = document.createElement('td');
      cellNmControlador.textContent = val.nm_controlador;
      row.appendChild(cellNmControlador);

      tableBody.appendChild(row);
    })
  } catch (e) {
    console.error('Erro ao tentar gerar os acessos na tabela: ', e);
  }
}