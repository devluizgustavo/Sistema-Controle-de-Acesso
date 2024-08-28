
// Função para inicializar event listeners de input com a tecla enter
export default async function initInputListeners() {
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const form = e.target.closest('form');
        if (form) {
          form.dispatchEvent(new Event('submit'));
        }
      }
    });
  });
}