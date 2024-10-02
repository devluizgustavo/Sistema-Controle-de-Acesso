import showMaskCPF, { showMaskRG } from '../../utils/showMask.js';

export default async function invokeDataInInputs(cad) {
  const inputs = document.querySelector('#formEditData');

  inputs.querySelectorAll('input').forEach(input => {
    switch (input.id) {
      case 'firstname':
        input.value = cad.cad_name;
        break;
      case 'lastname':
        input.value = cad.cad_lastname;
        break;
      case 'dtnasc':
        input.value = cad.cad_dt_nasc;
        break;
      case 'cpfOrRG':
        !cad.cad_rg ? input.value = showMaskCPF(cad.cad_cpf) : input.value = showMaskRG(cad.cad_rg);
        break;
      case 'phone':
        !cad.cad_tel ? input.value = 'Não Cadastrado' : input.value = cad.cad_tel;
        break;
      case 'email':
        !cad.cad_email ? input.value = 'Não Cadastrado' : input.value = cad.cad_email;
    }
  });
}