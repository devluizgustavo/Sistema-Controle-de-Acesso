function captalizeText(text) {
  return text.trim()      // Remove espaços em branco no início e no final
    .replace(/\s+/g, ' ') // Substitui múltiplos espaços por um único espaço
    .split(' ')           // Divide a string em palavras
    .map(parte => parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase()) // Capitaliza a primeira letra de cada palavra
    .join(' ');           // Junta as palavras de volta em uma string); 
}

function removeMask(text='', type) {
  if (type === 'rg' || type === 'cpf') return text.trim().replace(/[.\-]/g, '');
  if (type === 'tel') return text.trim().replace(/[()\-\s]/g, '');
}

module.exports = { captalizeText, removeMask }