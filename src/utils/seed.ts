export function gerarSeedPadrao(): string {
  const agora = new Date();
  return `${agora.getFullYear()}-${agora.getMonth() + 1}-${agora.getDate()}-${agora.getHours()}${agora.getMinutes()}`;
}
