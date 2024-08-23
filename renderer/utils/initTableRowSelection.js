// Função para inicializar a seleção de linhas da tabela
export default function initTableRowSelection() {
  document.querySelectorAll('.styled-table tbody tr').forEach(row => {
    row.addEventListener('click', () => {
      document.querySelectorAll('.styled-table tbody tr').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
    });
  });
}