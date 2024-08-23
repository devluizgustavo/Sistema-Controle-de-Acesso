//Função para invocar os nomes na tabela
export default function createRowInTable(id, fullName, rgOrCpf, lastAccess='Indefinido', setor='Indefinido', assunto='Indefinido') {
  const table = document.querySelector('.styled-table');
  const tbody = document.querySelector('.init');

  const newRow = document.createElement('tr');
  const newCelID = document.createElement('td');
  const newCelFullName = document.createElement('td');
  const newCelRgOrCPF = document.createElement('td');
  const newCelLastAccess = document.createElement('td');
  const newCelSetor = document.createElement('td');
  const newCelAssunto = document.createElement('td');

  newCelID.textContent = id;
  newCelFullName.textContent = fullName;
  newCelRgOrCPF.textContent = rgOrCpf;
  newCelLastAccess.textContent = lastAccess;
  newCelSetor.textContent = setor;
  newCelAssunto.textContent = assunto;

  newRow.appendChild(newCelID);
  newRow.appendChild(newCelFullName);
  newRow.appendChild(newCelRgOrCPF);
  newRow.appendChild(newCelLastAccess);
  newRow.appendChild(newCelSetor);
  newRow.appendChild(newCelAssunto);

  tbody.appendChild(newRow);
  table.appendChild(tbody);
}



