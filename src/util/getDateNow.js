function getDateNow() {
  const agora = new Date();
  
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
  const dia = String(agora.getDate()).padStart(2, '0');
  const horas = String(agora.getHours()).padStart(2, '0');
  const minutos = String(agora.getMinutes()).padStart(2, '0');
  const segundos = String(agora.getSeconds()).padStart(2, '0');
  
  return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
}

module.exports = getDateNow