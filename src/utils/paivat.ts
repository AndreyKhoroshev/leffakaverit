// Muuttaa päivämäärän (2026-12-05) suomalaiseen muotoon (5.12.2026)
export function muotoilePaiva(iso: string) {
  const [vuosi, kuukausi, paiva] = iso.split('-');
  return `${Number(paiva)}.${Number(kuukausi)}.${vuosi}`;
}
// Muuttaa päivämäärän (2026-12-05) Date-olioksi paikallista aikaa keskiyöllä.
// new Date('2026-12-05') tulkitsisi päivän UTC-aikana, mikä voi siirtää päivää.
export function isoPaivaksi(iso: string) {
  const [vuosi, kuukausi, paiva] = iso.split('-').map(Number);
  // Kuukaudet alkavat JavaScriptissä nollasta (tammikuu = 0)
  return new Date(vuosi, kuukausi - 1, paiva);
}
// Onko päivämäärä tänään tai tulevaisuudessa
export function onTulossa(iso: string) {
  const tanaan = new Date().toISOString().slice(0, 10);
  return iso >= tanaan;
}