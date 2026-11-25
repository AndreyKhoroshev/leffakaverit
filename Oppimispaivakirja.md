# Oppimispäiväkirja – Leffakaverit

## Mikä sovellus on

Leffakaverit on Expo-sovellus, jolla haetaan elokuvia TMDB:stä, pidetään listaa katsottavista ja katsotuista elokuvista, annetaan arvosanoja ja arvioita sekä katsotaan kavereiden listoja. Kaverin voi lisätä nimellä tai QR-koodilla. Lisäksi sovellus näyttää Suomen tulevat ensi-illat, ensi-illan voi lisätä kalenteriin, ja puhelinta ravistamalla sovellus arpoo elokuvan.

Käytin TypeScriptiä, React Navigationia, Context API:a, omia hookeja, Firebasea (Auth + Firestore) sekä kameraa, kiihtyvyysanturia ja kalenteria.

## Alku oli kömpelöä

Ensimmäinen virhe tuli heti: kirjoitin `npx start expo` enkä `npx expo start`. Myöhemmin kirjoitin kansion nimeksi `scr` enkä `src`, ja vielä myöhemmin `utils`-kansio päätyi väärän kansion sisään. Joka kerta import näkyi punaisena, ja etsin vikaa koodista, vaikka ongelma oli kansiorakenteessa. Nyt ymmärrän suhteelliset polut (`./` ja `../`) paljon paremmin.

Gitistä opin, että tyhjät kansiot eivät mene GitHubiin ja että `.env` pitää lisätä `.gitignoreen` itse. Expon valmis tiedosto ei sitä kattanut.

## Rakenne kannatti miettiä

Jaoin koodin kolmeen osaan: service hakee datan, hook hoitaa tilan ja näkymä vain näyttää. Aluksi tämä tuntui turhalta, mutta myöhemmin se säästi paljon työtä. Esimerkiksi kun tein kaverin listat, pystyin käyttämään samaa hookia ja komponenttia kuin omissa listoissa.

Navigoinnissa paras oivallus oli, ettei kirjautumisen jälkeen tarvitse siirtyä mihinkään itse. Sovellus näyttää eri näkymät sen mukaan, onko käyttäjä kirjautunut.

## TMDB ja ensi-illat

Ensi-illat vaativat kolme yritystä. Ensin listassa oli vain 6 elokuvaa, koska rajapinta palautti myös jo ilmestyneitä. Sitten hain useamman sivun kerralla, ja elokuvia oli paljon, mutta mukana oli thaimaalaisia ja intialaisia elokuvia, jotka eivät tule Suomeen. Lopulta löysin parametrit `region=FI` ja `with_release_type=3|2`, ja lista näytti oikealta. Opin, että "toimii" ei vielä tarkoita "toimii oikein".

## Firebase

Kirjautumisessa huomasin, että ilman lataustilaa kirjautumissivu välähti hetken, vaikka käyttäjä oli jo kirjautunut. Firestoressa opin, että `onSnapshot` on usein parempi kuin `getDoc`. Rekisteröityessä tili syntyy hetkeä ennen profiilia, ja kuuntelun ansiosta profiili ilmestyy heti, kun se on tallessa. Lisäksi listat päivittyvät itsestään.

Käyttäjänimien piti olla yksilöllisiä, joten tein erillisen `kayttajanimet`-kokoelman. Ensimmäinen testikäyttäjäni oli luotu ennen tätä, joten jouduin poistamaan sen. Silloin tajusin, että tietomallin muuttaminen vaikuttaa myös vanhaan dataan.

## Tietoturva ja kaverit

Vaatimus oli, että vain kaverit näkevät listat. Jos kaverin voisi lisätä yksipuolisesti, kuka tahansa näkisi kenen tahansa listat. Siksi tein kaveripyynnöt: listat näkyvät vasta, kun toinen on hyväksynyt pyynnön. Firestoren säännöissä tämä tarkistetaan riveillä, joiden mukaan elokuvia saa lukea vain omistaja tai joku, jonka omistaja on lisännyt kaverikseen. Testasin tämän kahdella tilillä.

## Laiteominaisuudet

**QR-koodi:** kamera luki saman koodin monta kertaa sekunnissa, ja pyyntö olisi lähtenyt useaan kertaan. `useRef` korjasi tämän, koska se muuttuu heti eikä odota uudelleenpiirtoa niin kuin `useState`.

**Kalenteri:** tämä yllätti. Expon uusin kalenteri-API ei toimi Expo Gossa, mutta saman kirjaston vanha versio (`expo-calendar/legacy`) toimii. Se avaa puhelimen oman kalenterin valmiilla tapahtumalla, eikä lupia tarvita. Opin myös, että `new Date('2026-12-05')` voi siirtää päivää aikavyöhykkeen takia.

**Ravistus:** lasken liikkeen voiman kolmesta akselista. Ilman pientä taukoa yksi ravistus avasi monta elokuvaa. Kuuntelu on päällä vain Listat-välilehdellä, ettei arvonta käynnisty vahingossa muualla.


## Tekoälyn käyttö

Käytin Claudea apuna projektin tekemisen aikana. Etenin pienissä paloissa: yksi ominaisuus kerrallaan, koodi projektiin, testaus puhelimella ja virheiden korjaus ennen seuraavaa vaihetta. Kun jokin ei toiminut, lähetin virheen selvitimme syyn. Pyysin aina selityksen uusille asioille, joita en ymmärtänyt itse. 

## Lopuksi

 Hahmoitan nyt paremmim itse mitä tapahtuu taustalla kuin käytän muita sovelluksia omalla puhelimella. Projektin teko oli hastaavaa, mutta apuna oleva tekoäly helpotti projektin tekemistä sekä oppitunneilla hankittu tieto varmisti omaa osaamista. 
