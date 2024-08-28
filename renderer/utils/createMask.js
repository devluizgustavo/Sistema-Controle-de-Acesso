export default function createMaskCPF(cpf) {
    return cpf.slice(0, 3) + '.' +
      cpf.slice(3, 6) + '.' +
      cpf.slice(6, 9) + '-' +
      cpf.slice(9, 11);
}

export function createMaskRG(rg) {
    if (rg.length == 9) {
      return rg.slice(0, 2) + '.' +
        rg.slice(2, 5) + '.' +
        rg.slice(5, 8) + '-' +
        rg.slice(8, 9);
    } else if (rg.length == 8) {
      return rg.slice(0, 2) + '.' +
        rg.slice(3, 6) + '.' +
        rg.slice(6, 8) +
        rg.slice(8, 9);
    }
}
