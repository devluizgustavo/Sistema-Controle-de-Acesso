import getAssuntosInDepto, { createElementSelect } from "./getAssuntos.js"

export default async function invokeAssuntosInInput() {
  document.addEventListener('change', async (e) => {
    if (e.target.id === 'id_type_depto') {
      removeOptionsInAssunto()
      const descAssuntos = await getAssuntosInDepto(e.target.value);

      for (let i of descAssuntos) {
        createElementSelect(i);
      }
    }
  })
}

function removeOptionsInAssunto() {
  // Seleciona o container com o id específico
  const container = document.querySelector('#id_type_assunto');
  
  if (container) {
    // Seleciona todos os elementos <select> dentro do container
    const selectAssuntos = container.querySelectorAll('option');

    
    
    // Itera sobre os elementos e os remove do DOM
    selectAssuntos.forEach(select => select.remove());
    createElementSelect('Escolha uma opção');
  }
}