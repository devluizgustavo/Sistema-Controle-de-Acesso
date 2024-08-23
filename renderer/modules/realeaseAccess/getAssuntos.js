
export function createElementSelect(nameAssunto) {
  const selectAssunto = document.getElementById('id_type_assunto');
  const option = document.createElement('option');
  option.innerHTML = nameAssunto;
  selectAssunto.appendChild(option);
}

export default async function getAssuntosInDepto(idDepto) {
  try {
    if (typeof idDepto !== 'string') return

    const idNumber = Number(idDepto);
    const getAssunto = await window.electron.getAssuntoDepto(idNumber);

    return getAssunto;
  } catch (e) {
    console.error('Erro ao tentar encontrar os assuntos', e);
  }
}
