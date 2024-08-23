import showMaskCPF, { showMaskTel, showMaskRG, showMaskNameAndLastName } from './showMask';

// Função para aplicar máscaras aos inputs
export default function initInputMasks() {
  document.addEventListener('input', e => {
    const el = e.target;

    if (el.id === 'cpf_input') el.value = showMaskCPF(el.value);
    if (el.id === 'tel_inp_cad') el.value = showMaskTel(el.value);
    if (el.id === 'rg_input') el.value = showMaskRG(el.value);
    if (el.id === 'nm_inp_cad' || el.id === 'sb_inp_cad') el.value = showMaskNameAndLastName(el.value);
  });
}