export default async function showNameUser() {
  try {
    const res = await window.electron.getUser();
    if (res.ctr_sexo == 'M') {
      document.getElementById('name-user').innerHTML = `Bem vindo, <b>${res.ctr_nome}!</b>`;
    } else {
      document.getElementById('name-user').innerHTML = `Bem vinda, <b>${res.ctr_nome}!</b>`;
    }
  } catch (e) {
    console.log(e);
  }
}
