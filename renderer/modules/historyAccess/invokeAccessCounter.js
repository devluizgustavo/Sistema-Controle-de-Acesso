export default async function (log) {
  try {
    const elCount = document.querySelector('.countAccess');
    if (log.length === 1) return elCount.innerHTML = `${log.length} vez`
    elCount.innerHTML = `${log.length} vezes`;
  } catch (e) {
    console.error('Erro ao tentar mostrar a quantidade de acessos: ', e);
  }
}