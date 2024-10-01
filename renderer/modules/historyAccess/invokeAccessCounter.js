export default async function (log) {
  try {
    const elCount = document.querySelector('.countAccess');
    elCount.innerHTML = `${log.length}`;
  } catch (e) {
    console.error('Erro ao tentar mostrar a quantidade de acessos: ', e);
  }
}