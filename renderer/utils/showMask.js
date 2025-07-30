export default function showMaskCPF(cpf) {
  cpf = cpf.replace(/\D/g, ''); //Remove caracteres não numericos

  return cpf
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function showMaskTel(tel) {
  tel = tel.replace(/\D/g, '');
  if (tel.length <= 10) {  // Telefone fixo (DDD 0000-0000)
    return tel
      .replace(/(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  } else { // Telefone celular (DDD 00000-0000)
    return tel
      .replace(/(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }
}

export function showMaskRG(rg) {
  // Remove caracteres que não são letras ou números
  rg = rg.replace(/[^0-9A-Z]/gi, '');

  console.log(rg)
  // Aplica a máscara no formato XX-XXX-XXX-XX
  if (rg.length <= 7) {
    return rg
      .replace(/(\w{2})(\w)/, '$1.$2')
      .replace(/(\w{2})(\w)/, '$1.$2')
      .replace(/(\w{2})(\w)/, '$1.$2')
  }

  return rg
    .replace(/(\w{2})(\w)/, '$1.$2') // Adiciona o primeiro hífen
    .replace(/(\w{3})(\w)/, '$1.$2') // Adiciona o segundo hífen
    .replace(/(\w{3})(\w)/, '$1-$2') // Adiciona o terceiro hífen
    .replace(/(\w{2})$/, '$1');      // Adiciona os últimos dois caracteres
}

export function showMaskNameAndLastName(nameOrLastName) {
  nameOrLastName = nameOrLastName.replace(/^[0-9\s]*$/g, '')
  return nameOrLastName;
}