// Função para inicializar a seleção de linhas da tabela
export default function initTableRowSelection() {
  document.querySelectorAll('#access-table tbody tr').forEach(row => {
    row.addEventListener('click', () => {
      document.querySelectorAll('#access-table tbody tr').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
    });
  });
}