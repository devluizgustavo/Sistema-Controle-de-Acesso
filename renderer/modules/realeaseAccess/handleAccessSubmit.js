import showError from '../../utils/showError.js';
let errors = [];

export default async function handleAccessSubmit(e) {
  try {
    e.preventDefault();
    const formDataAccess = new FormData(event.target);
    const dataAccess = {
      departamento: formDataAccess.get('departamento').trim(),
      assunto: formDataAccess.get('assunto').trim()
    }

    errors = [];
    document.getElementById('error-message').innerHTML = '';

    //Validação
    if (dataAccess.departamento == '') errors.push('É necessário selecionar ao menos um departamento<br>');
    if (dataAccess.assunto == 'Escolha uma opção') errors.push('É necessário selecionar ao menos um assunto<br>');
    if (errors.length > 0) return errors.forEach((val) => showError('error-message', val));

    const realeaseAccess = await window.electron.setAccessHistorico(dataAccess);
  } catch (e) {
    console.error('Erro ao liberar o acesso', e);
  }
}

