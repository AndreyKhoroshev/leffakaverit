import * as Calendar from 'expo-calendar/legacy';
import { isoPaivaksi } from '../utils/paivat';

// Avaa puhelimen oman kalenteri-ikkunan valmiiksi täytetyllä ensi-iltatapahtumalla.
export async function lisaaEnsiIltaKalenteriin(
  nimi: string,
  julkaisupaiva: string
): Promise<boolean> {
  const alku = isoPaivaksi(julkaisupaiva);
  // Koko päivän tapahtuma päättyy seuraavan päivän alkuun
  const loppu = new Date(alku);
  loppu.setDate(loppu.getDate() + 1);

  const tulos = await Calendar.createEventInCalendarAsync({
    title: `Ensi-ilta: ${nimi}`,
    startDate: alku,
    endDate: loppu,
    allDay: true,
    notes: 'Lisätty Leffakaverit-sovelluksesta',
  });

  return tulos.action !== 'canceled';
}