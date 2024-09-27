export default async function invokeNameAndId(log) {
  try {
    const elID = document.querySelector('.id');
    const elName = document.querySelector('.name');

    log.forEach(val => {
      elID.innerHTML = val.id
      elName.innerHTML = val.fullname
    });
  } catch (e) {
    console.error('Erro ao tentar mostrar os dados de acesso: ', e);
  }

}