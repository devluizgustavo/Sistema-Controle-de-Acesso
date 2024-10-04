import showMaskCPF, { showMaskTel, showMaskRG, showMaskNameAndLastName } from './showMask';

// Função para aplicar máscaras aos inputs
export default async function initInputMasks() {
  document.addEventListener('input', e => {
    const el = e.target;

    if (el.id === 'cpf_input' || el.id === 'cpf') el.value = showMaskCPF(el.value);
    if (el.id === 'tel_inp_cad' || el.id === 'phone') el.value = showMaskTel(el.value);
    if (el.id === 'rg_input' || el.id === 'rg') el.value = showMaskRG(el.value);
    if (el.id === 'nm_inp_cad' || el.id === 'sb_inp_cad' || el.id === 'firstname' || el.id === 'lastname')
      el.value = showMaskNameAndLastName(el.value);
  });
}