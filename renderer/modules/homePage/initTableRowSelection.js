// Função para inicializar a seleção de linhas da tabela
export default function initTableRowSelection() {
  document.querySelectorAll('#rowTable').forEach(row => {
    row.addEventListener('click', () => {
      document.querySelectorAll('#rowTable').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
    });
  });
}