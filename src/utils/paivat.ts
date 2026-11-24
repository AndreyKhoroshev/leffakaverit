// Muuttaa päivämäärän (2026-12-05) suomalaiseen muotoon (5.12.2026)
export function muotoilePaiva(iso: string) {
  const [vuosi, kuukausi, paiva] = iso.split('-');
  return `${Number(paiva)}.${Number(kuukausi)}.${vuosi}`;
}