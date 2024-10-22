import createMaskCPF, { createMaskRG } from '../../utils/createMask.js';
import initTableRowSelection from './initTableRowSelection.js';

//Função para invocar os nomes na tabela
export default function createRowInTable(data) {
  const tableBody = document.querySelector('#access-table tbody');

  if (tableBody) tableBody.innerHTML = ""

  console.log(data)
  
  data.forEach(val => {
    const row = document.createElement('tr');
    row.setAttribute('id', 'rowTable');

    const cellID = document.createElement('td');
    cellID.textContent = val.id;
    row.appendChild(cellID);

    const cellName = document.createElement('td');
    cellName.textContent = val.fullname;
    row.appendChild(cellName);

    if (!val.cpf) {
      const cellRg = document.createElement('td');
      cellRg.textContent = createMaskRG(val.rg);
      row.appendChild(cellRg);
    }
    if (!val.rg) {
      const cellCpf = document.createElement('td');
      cellCpf.textContent = createMaskCPF(val.cpf);
      row.appendChild(cellCpf);
    }



    const cellDate = document.createElement('td');
    if (!val.last_access) {
      cellDate.textContent = 'Indefinido'
      row.appendChild(cellDate);
    } else {
      cellDate.textContent = val.last_access;
      row.appendChild(cellDate);
    }

    const cellDepto = document.createElement('td');
    if (!val.name_depto) {
      cellDepto.textContent = 'Indefinido'
      row.appendChild(cellDepto);
    } else {
      cellDepto.textContent = val.name_depto;
      row.appendChild(cellDepto);
    }

    const cellAssunto = document.createElement('td');
    if (!val.desc_assunto) {
      cellAssunto.textContent = 'Indefinido'
      row.appendChild(cellAssunto);
    } else {
      cellAssunto.textContent = val.desc_assunto;
      row.appendChild(cellAssunto);
    }

    tableBody.appendChild(row);
    initTableRowSelection();
  })
}



