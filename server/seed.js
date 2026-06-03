const db = require('./db');

const blocks = [
  // ─── PREP ───────────────────────────────────────────────────────────────────
  {
    id: 'PM-PREP-001', fase: 'PREP', domein: 'PM',
    activiteit: 'BTO formaliseren',
    inc: [
      'Opstellen en ondertekening BTO (Basis Technische Omschrijving) met opdrachtgever',
      'Afstemming scope, planning en randvoorwaarden',
      '1× getekende BTO als projectstartsein',
    ],
    exc: [
      'Aanpassing BTO na formele gunning op verzoek opdrachtgever',
      'Juridische beoordeling contractstukken (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'PM-PREP-002', fase: 'PREP', domein: 'PM',
    activiteit: 'Startbijeenkomst',
    inc: [
      'Organiseren en faciliteren van de kickoff-meeting met projectteam en opdrachtgever',
      'Agenda opstellen, verslag uitwerken en distribueren',
      'Introductie VISI-communicatieprotocol en digitaal werkproces',
    ],
    exc: [
      'Reiskosten buiten de regio (aparte post)',
      'Externe presentatielocatie (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'PB-PREP-001', fase: 'PREP', domein: 'PB',
    activiteit: 'Kwaliteitsplan VISI',
    inc: [
      'Opstellen projectspecifiek kwaliteitsplan conform VISI-raamwerk',
      'Beschrijving communicatielijnen, besluitvormingsprotocol en documentbeheer',
      'Vaststelling rollenmatrix opdrachtgever–opdrachtnemer',
    ],
    exc: [
      'Implementatie VISI-software bij opdrachtgever',
      'VISI-koppeling met externe stakeholders (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'PB-PREP-002', fase: 'PREP', domein: 'PB',
    activiteit: 'Tijdschema en risicoregister',
    inc: [
      'Opstellen initieel projecttijdschema (Gantt) op mijlpaalniveau',
      'Initieel risicoregister met top-10 risico\'s en beheersmaatregelen',
      'Afstemming planning met opdrachtgever en vaststelling reviewmomenten',
    ],
    exc: [
      'Probabilistische risicoquantificatie (Monte Carlo)',
      'Koppeling met corporate ERP-systemen opdrachtgever',
    ],
    variabel: 0, variabele_velden: [],
  },

  // ─── VO / TM ─────────────────────────────────────────────────────────────────
  {
    id: 'TM-VO-001', fase: 'VO', domein: 'TM',
    activiteit: 'VO tracé opstellen',
    inc: [
      '1× leidingkaart schaal 1:500/1:1.000 in AutoCAD (.dwg) + PDF conform NLCS++ Netbeheer V12',
      '1× ontwerpnota met ontwerpkeuzes en materiaalbehoefte',
      'Tracelengte: _____ m  [invullen per project]',
      'Afstemming tracé met netbeheerder en omgevingspartijen in VO-fase',
    ],
    exc: [
      'Re-engineering als gevolg van scopewijziging opdrachtgever',
      'Kabeltechnische berekeningen (aparte post)',
    ],
    variabel: 1, variabele_velden: ['Tracelengte (m)'],
  },
  {
    id: 'TM-VO-002', fase: 'VO', domein: 'TM',
    activiteit: 'Oeversteken (HDD/gestuurde boring VO)',
    inc: [
      'Inventarisatie kruisende watergangen en keuze boormethode per oeversteek',
      'Conceptrapport oeversteken met profielschetsen en diepteadviezen',
      'Aantal oeversteken: _____  [invullen per project]',
    ],
    exc: [
      'Definitief boorplan (aparte post DO-fase)',
      'Vergunningaanvragen watergangen (aparte post OM)',
    ],
    variabel: 1, variabele_velden: ['Aantal oeversteken (st)'],
  },
  {
    id: 'TM-VO-003', fase: 'VO', domein: 'TM',
    activiteit: 'KLIC-melding VO',
    inc: [
      'Uitvoeren KLIC-melding voor het VO-tracé',
      'Verwerken en digitaal archiveren van de KLIC-resultaten',
      'Signaleren strijdigheden en doorzetten naar tracékeuze',
    ],
    exc: [
      'Schadevergoeding bij beschadiging bestaande leidingen',
      'Meerdere KLIC-meldingen bij verlopen geldigheid (meerwerk)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-VO-004', fase: 'VO', domein: 'TM',
    activiteit: 'Schouwen tracé',
    inc: [
      'Veldschouw van het voorkeursalternatief tracé met fotodocumentatie',
      'Inventarisatie obstakels, kabels & leidingen zichtbaar boven maaiveld',
      'Schouwrapportage met aandachtspunten per segmentsectie',
    ],
    exc: [
      'Gedetailleerde bodemonderzoeken (aparte post CO)',
      'Uitvoering wegprofilopmeting (aparte post indien vereist)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-VO-005', fase: 'VO', domein: 'TM',
    activiteit: 'Proefsleuven VO',
    inc: [
      'Uitvoering proefsleuven à 1 m breed × diepte maaiveld + 0,5 m',
      'Fotodocumentatie aangetroffen kabels & leidingen per proefsleuf',
      'Verslag proefsleuven met coördinaten en dieptematen',
      'Aantal VO-proefsleuven: _____ st  (indicatief: tracelengte ÷ 250 m)',
      'Berekend op basis van ingevulde tracelengte',
    ],
    exc: [
      'Herstel straatwerk na proefsleuven (aparte post uitvoering)',
      'Proefsleuven voor detectie NGE (aparte post CO)',
    ],
    variabel: 1, variabele_velden: ['Aantal VO-proefsleuven (st)'],
  },
  {
    id: 'TM-VO-006', fase: 'VO', domein: 'TM',
    activiteit: 'Station engineering VO',
    inc: [
      'Plaatsbepaling en opsteltekeningen MS-stations (schaal 1:100)',
      'Optierapport met ruimtebehoefte, toegankelijkheid en netaansluiting',
      'Afstemming met gemeente/grondeigenaar over stationslocatie',
      'Aantal stations: _____  [invullen per project]',
    ],
    exc: [
      'Civieltechnisch ontwerp fundering en bekabeling intern station (aparte post DO)',
      'Vergunningaanvraag omgevingsvergunning station (aparte post OM)',
    ],
    variabel: 1, variabele_velden: ['Aantal stations (st)'],
  },
  {
    id: 'TM-VO-007', fase: 'VO', domein: 'TM',
    activiteit: 'Belastbaarheids- en beïnvloedingsberekeningen',
    inc: [
      'Thermische belastbaarheidsberekening van de MS-kabelverbinding conform NEN-EN 60287',
      'Beïnvloedingsberekening voor parallelloopende kabels en installaties',
      'Beïnvloedingsberekening per HDD-boring (indien van toepassing)',
      'Berekeningen gedocumenteerd in technisch rapport',
    ],
    exc: [
      'Dynamische vermogensstroomberekening (aparte post)',
      'EMC-studie voor specifieke gevoelige objecten (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-VO-008', fase: 'VO', domein: 'TM',
    activiteit: 'Materiaallijst VO',
    inc: [
      'Indicatieve materiaallijst MS-kabel, mantelbuizen en accessoires',
      'Specificatie kabeltype, spanning en doorsnede conform Liander-richtlijnen',
      'Kwantificering op basis van VO-tracé',
    ],
    exc: [
      'Inkooptraject en contractering materialen (aparte post opdrachtgever)',
      'Definitieve materiaalstaat (aparte post DO-fase)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-VO-009', fase: 'VO', domein: 'TM',
    activiteit: 'VGM-O plan VO',
    inc: [
      'Opstellen Veiligheids-, Gezondheids-, Milieu- en Omgevingsplan voor de VO-fase',
      'Risico-inventarisatie projectspecifieke VGM-aspecten',
      'Beschrijving maatregelen conform CROW 500 en VSH-normen',
    ],
    exc: [
      'Uitvoerings-VGP (aparte post UO-fase)',
      'V&G-coördinatie tijdens uitvoering (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-VO-010', fase: 'VO', domein: 'TM',
    activiteit: 'Vooroverleg 1 (netbeheerder + gemeente)',
    inc: [
      'Organiseren en bijwonen vooroverleg met Liander en betrokken gemeente(n)',
      'Presentatie VO-tracé, knooppunten en aandachtspunten',
      'Vastleggen acties en beslispunten in verslag',
    ],
    exc: [
      'Juridisch advies tijdens overleg',
      'Kosten externe locatiehuur',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-VO-011', fase: 'VO', domein: 'TM',
    activiteit: 'Boorclub (HDD-selectie VO)',
    inc: [
      'Selectie en beoordeling boortechnieken (HDD, microtunneling, nano-boring) per kruising',
      'Advies boorkeuze op basis van bodemopbouw, obstakels en vergunbaarheid',
      'Conceptmatrix boortechniek per kruising',
    ],
    exc: [
      'Geotechnische boringen en grondonderzoek (aparte post CO)',
      'Boorkostenraming (aparte post PB)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-VO-012', fase: 'VO', domein: 'TM',
    activiteit: 'Eisenverificatie VO',
    inc: [
      'Toetsen VO-ontwerp aan eisenspecificatie Liander (v.d. Tolpoort)',
      'Opstellen verificatiematrix VO met status per eis',
      'Documenteren afwijkingen en te nemen acties richting DO',
    ],
    exc: [
      'Aanpassing eisenspecificatie opdrachtgever',
      'Formele V&V-review door onafhankelijke derde',
    ],
    variabel: 0, variabele_velden: [],
  },

  // ─── VO / OM ─────────────────────────────────────────────────────────────────
  {
    id: 'OM-VO-001', fase: 'VO', domein: 'OM',
    activiteit: 'Stakeholderanalyse',
    inc: [
      'Identificatie en categorisering alle stakeholders langs het tracé',
      'Stakeholdermatrix met invloed, belang en communicatiestrategie',
      'Eerste contactmoment en registratie reacties in stakeholderlogboek',
    ],
    exc: [
      'Formele participatieronden op verzoek gemeente (aparte post)',
      'Communicatiebureau voor bewonersavonden (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'OM-VO-002', fase: 'VO', domein: 'OM',
    activiteit: 'Vergunningeninventarisatie VO',
    inc: [
      'Inventarisatie benodigde vergunningen, toestemmingen en meldingen per tracésectie',
      'Vergunningenmatrix met bevoegd gezag, doorlooptijd en risico',
      'Advies prioritering vergunningstrajecten voor DO-fase',
    ],
    exc: [
      'Aanvraag vergunningen (afzonderlijke posten DO-fase)',
      'Juridisch advies bij bezwaarprocedures',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'OM-VO-003', fase: 'VO', domein: 'OM',
    activiteit: 'ZRO — Privaat eigenaar',
    inc: [
      'Identificatie percelen via BRK-kadasterinformatie',
      'Eerste contact eigenaar en inventarisatie bezwaren/wensen',
      'Concept zakelijk recht overeenkomst (ZRO) opstellen en ter review aanbieden',
      'Kadastraal nummer + naam eigenaar: _____  [invullen per project]',
    ],
    exc: [
      'Notariële passering (aparte post)',
      'Schaderegeling bij bezwaar of schade aan eigendommen (aparte post)',
    ],
    variabel: 1, variabele_velden: ['Kadastrale aanduiding', 'Naam eigenaar'],
  },
  {
    id: 'OM-VO-004', fase: 'VO', domein: 'OM',
    activiteit: 'ZRO — Gemeente',
    inc: [
      'Afstemming met gemeentelijke grondzaken over tracé in gemeentelijk eigendom',
      'Aanvraag toestemming en/of privaatrechtelijke overeenkomst',
      'Kadastraal nummer + naam gemeente: _____  [invullen per project]',
    ],
    exc: [
      'Notariële passering (aparte post)',
      'Publiekrechtelijke omgevingsvergunning (aparte post DO)',
    ],
    variabel: 1, variabele_velden: ['Kadastrale aanduiding', 'Naam gemeente'],
  },
  {
    id: 'OM-VO-005', fase: 'VO', domein: 'OM',
    activiteit: 'ZRO — Hoogheemraadschap van Rijnland',
    inc: [
      'Vooroverleg met Hoogheemraadschap van Rijnland over kruising watergang',
      'Inventarisatie eisen en randvoorwaarden watervergunning',
      'Kruisinglocatie: _____  [invullen per project]',
    ],
    exc: [
      'Aanvraag watervergunning (aparte post DO)',
      'Herstel beschoeiing/oeverconstructie (aparte post uitvoering)',
    ],
    variabel: 1, variabele_velden: ['Kruisinglocatie'],
  },
  {
    id: 'OM-VO-006', fase: 'VO', domein: 'OM',
    activiteit: 'ZRO — Rijkswaterstaat (RWS)',
    inc: [
      'Vooroverleg met RWS over kruising rijkswater of rijksweg',
      'Inventarisatie belemmeringenzone en indieningsvereisten',
      'Kruisinglocatie: _____  [invullen per project]',
    ],
    exc: [
      'Aanvraag watervergunning RWS (aparte post DO)',
      'Kosten constructieve voorzieningen RWS-werk (aparte post)',
    ],
    variabel: 1, variabele_velden: ['Kruisinglocatie'],
  },
  {
    id: 'OM-VO-007', fase: 'VO', domein: 'OM',
    activiteit: 'ZRO — ProRail',
    inc: [
      'Vooroverleg met ProRail over spoorwegkruising',
      'Inventarisatie belemmeringenzone, beveiligingseisen en indieningsvereisten',
      'Kruisinglocatie: _____  [invullen per project]',
    ],
    exc: [
      'Aanvraag formele toestemming ProRail (aparte post DO)',
      'Spoortechnische begeleiding uitvoering (aparte post)',
    ],
    variabel: 1, variabele_velden: ['Kruisinglocatie'],
  },
  {
    id: 'OM-VO-008', fase: 'VO', domein: 'OM',
    activiteit: 'ZRO — Nutsbedrijf',
    inc: [
      'Contactleggen met beheerder nutleiding over tracéconflict of kruising',
      'Inventarisatie leggergegevens en indieningsvereisten',
      'Naam beheerder: _____  [invullen per project]',
    ],
    exc: [
      'Omlegging leiding van derden (aparte post)',
      'Schade aan nut-infrastructuur derden',
    ],
    variabel: 1, variabele_velden: ['Naam beheerder'],
  },
  {
    id: 'OM-VO-009', fase: 'VO', domein: 'OM',
    activiteit: 'Betredingstoestemmingen VO',
    inc: [
      'Aanvragen betredingstoestemmingen voor schouwen en proefsleuven op private percelen',
      'Registratie en archivering verleende toestemmingen',
      'Correspondentie eigenaren over geplande werkzaamheden',
    ],
    exc: [
      'Betredingstoestemmingen UO-fase (aparte post)',
      'Schaderegeling bij weigering eigenaar',
    ],
    variabel: 0, variabele_velden: [],
  },

  // ─── VO / CO ─────────────────────────────────────────────────────────────────
  {
    id: 'CO-VO-001', fase: 'VO', domein: 'CO',
    activiteit: 'Quickscan Flora & Fauna (F&F)',
    inc: [
      'Bureaustudie ecologische waarden en beschermde soorten langs het tracé',
      '1× quickscan-rapport met bevindingen, risicobeoordeling en aanbevelingen',
      'Advies over noodzaak nader veldonderzoek of ontheffing Wnb',
    ],
    exc: [
      'Nader ecologisch veldonderzoek (aparte post)',
      'Aanvraag ontheffing Wet natuurbescherming (aparte post DO)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-VO-002', fase: 'VO', domein: 'CO',
    activiteit: 'Quickscan NGE/OOO',
    inc: [
      'Bureauonderzoek niet-gesprongen explosieven (NGE) en ontplofbare oorlogsresten (OOO)',
      'Risicokaart NGE met verwachtingszones per tracésectie',
      'Advies detectie- en ruimingsstrategie',
    ],
    exc: [
      'Detectieonderzoek NGE in veld (aparte post DO)',
      'Ruiming aangetroffen explosieven (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-VO-003', fase: 'VO', domein: 'CO',
    activiteit: 'Archeologisch bureauonderzoek',
    inc: [
      'Bureauonderzoek conform KNA-protocol (Kwaliteitsnorm Nederlandse Archeologie)',
      'Verwachtingskaart voor het plangebied',
      'Advies selectiebesluit en eventuele vervolgstap (IVO)',
    ],
    exc: [
      'Inventariserend veldonderzoek archeologie (aparte post DO)',
      'Opgraving bij vondsten (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-VO-004', fase: 'VO', domein: 'CO',
    activiteit: 'Bodemonderzoek NEN 5725/5740',
    inc: [
      'Verkennend bodemonderzoek conform NEN 5725 (historisch) en NEN 5740 (veld)',
      'Boorpuntenplan, monsteranalyses en bodemkwaliteitsrapportage',
      'Beoordeling hergebruik vrijkomende grond conform Besluit bodemkwaliteit',
    ],
    exc: [
      'Nader bodemonderzoek bij verontreiniging (aparte post DO)',
      'Sanering aangetroffen verontreiniging (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-VO-005', fase: 'VO', domein: 'CO',
    activiteit: 'Asbestonderzoek type A (NEN 5707)',
    inc: [
      'Asbestinventarisatie type A conform NEN 5707 voor verdachte tracésecties',
      'Rapportage met asbest-verwachtingskaart en concentratiebepaling',
      'Advies maatregelen veilig werken',
    ],
    exc: [
      'Asbestsanering (aparte post)',
      'Asbestonderzoek type B/C (aparte post indien nodig)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-VO-006', fase: 'VO', domein: 'CO',
    activiteit: 'Indicatieve AERIUS-berekening',
    inc: [
      'Stikstofdepositieberekening (AERIUS Calculator) voor de aanlegfase',
      'Toetsing aan drempelwaarden Natura 2000-gebieden in invloedsgebied',
      'Memo met uitkomsten en advies over ontheffingsplicht',
    ],
    exc: [
      'Definitieve AERIUS-berekening (aparte post UO-fase)',
      'Passende beoordeling bij overschrijding (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-VO-007', fase: 'VO', domein: 'CO',
    activiteit: 'Geohydrologisch onderzoek',
    inc: [
      'Inventarisatie grondwaterstanden en kweldruk langs het tracé',
      'Advies grondwaterinvloed op aanleg en bemaling',
      'Geohydrologisch conceptueel model',
    ],
    exc: [
      'Gedetailleerd bemalingsadvies (aparte post DO)',
      'Grondwatermonitoring tijdens uitvoering (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-VO-008', fase: 'VO', domein: 'CO',
    activiteit: 'Drainageonderzoek',
    inc: [
      'Inventarisatie bestaande drainage en ontwatering langs het tracé',
      'Advies behoud, verlegging of herstel drainage bij tracékruising',
    ],
    exc: [
      'Aanleg of herstel drainagevoorziening (aparte post uitvoering)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-VO-009', fase: 'VO', domein: 'CO',
    activiteit: 'Cultuurtechnisch onderzoek',
    inc: [
      'Inventarisatie bomen, groen en cultuurtechnische elementen langs het tracé',
      'Advies bomenkap, herplant en compensatieplicht',
      'Indicatief herplantschema',
    ],
    exc: [
      'Formele herplantvergunning (aparte post DO)',
      'Boomonderzoek NVTB door gecertificeerde boomtaxateur (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-VO-010', fase: 'VO', domein: 'CO',
    activiteit: 'BEA CROW 217 (Boomeffectanalyse)',
    inc: [
      'Boomeffectanalyse conform CROW 217 voor bomen binnen invloedszone tracé',
      'Beoordeling wortelbescherming, kap- en herplantadvies',
      'Rapportage met foto\'s en plattegrond',
    ],
    exc: [
      'Herplant en aanleg boomvriendelijke verharding (aparte post uitvoering)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-VO-011', fase: 'VO', domein: 'CO',
    activiteit: 'G-waardeonderzoek (grondwaterkwaliteit)',
    inc: [
      'Bepaling G-waarden grondwater conform Activiteitenbesluit milieubeheer',
      'Beoordeling grondwaterkwaliteit relevant voor bemaling en lozing',
    ],
    exc: [
      'Bemaling en lozing (aparte post uitvoering)',
      'Grondwatersanering (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-VO-012', fase: 'VO', domein: 'CO',
    activiteit: 'Omgevingsschouw',
    inc: [
      'Visuele opname bestaande toestand omgeving (bestrating, groen, schades) vóór aanvang werkzaamheden',
      'Nulmeting fotodocumentatie conform CROW 400-protocol',
      'Schouwrapport met GPS-gelokaliseerde foto\'s',
    ],
    exc: [
      'Eindschouw na oplevering (aparte post NAO)',
      'Herstelkosten schade aan derden',
    ],
    variabel: 0, variabele_velden: [],
  },

  // ─── VO / PB ─────────────────────────────────────────────────────────────────
  {
    id: 'PB-VO-001', fase: 'VO', domein: 'PB',
    activiteit: 'Documentmanagement VISI',
    inc: [
      'Inrichten VISI-communicatieomgeving voor de VO-fase',
      'Beheer en archivering projectdocumenten conform VISI-systematiek',
      'Opleiding projectteamleden in gebruik VISI',
    ],
    exc: [
      'Softwarelicentie VISI-platform (voor rekening opdrachtgever)',
      'Documentbeheer buiten VISI op verzoek opdrachtgever (meerwerk)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'PB-VO-002', fase: 'VO', domein: 'PB',
    activiteit: 'WBS en eisenanalyse',
    inc: [
      'Opstellen Work Breakdown Structure (WBS) voor het volledige project',
      'Eisenanalyse op basis van opdrachtomschrijving en BTO',
      'Koppeling WBS aan eisenregister en verificatieplan',
    ],
    exc: [
      'Systeemtechnisch eisenmanagement met gespecialiseerde tooling (DOORS etc.) – aparte post',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'PB-VO-003', fase: 'VO', domein: 'PB',
    activiteit: 'Afwijkingenbeheer',
    inc: [
      'Bijhouden afwijkingenregister voor technische en procesafwijkingen',
      'Tijdig signaleren, registreren en bewaken afwijkingen',
      'Maandelijkse rapportage afwijkingenstatus aan opdrachtgever',
    ],
    exc: [
      'Formele waiver-procedure bij opdrachtgever (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'PB-VO-004', fase: 'VO', domein: 'PB',
    activiteit: 'Planning en voortgang VO',
    inc: [
      'Opstellen en bewaken detailplanning VO-fase',
      'Tweewekelijkse voortgangsrapportage aan opdrachtgever',
      'Bijstellen planning bij afwijkingen en communiceren naar team',
    ],
    exc: [
      'Planningsvertraging door scopewijziging opdrachtgever (meerwerk)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'PB-VO-005', fase: 'VO', domein: 'PB',
    activiteit: 'Risicomanagement VO',
    inc: [
      'Actualiseren risicoregister in VO-fase',
      'Kwalitatieve risicobeoordeling (kans × impact)',
      'Beheersmaatregelen bewaken en afstemmen met projectteam',
    ],
    exc: [
      'Kwantitatieve risicoanalyse (Monte Carlo) – aparte post indien vereist',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'PB-VO-006', fase: 'VO', domein: 'PB',
    activiteit: 'Financieel beheer VO',
    inc: [
      'Kostenraming VO op basis van tracé en bouwblokken',
      'Bewaken budget versus raming in VO-fase',
      'Financiële voortgangsrapportage per maand',
    ],
    exc: [
      'Definitieve kostenraming (aparte post DO)',
      'Meerwerk als gevolg van scopewijziging opdrachtgever',
    ],
    variabel: 0, variabele_velden: [],
  },

  // ─── VO / PM ─────────────────────────────────────────────────────────────────
  {
    id: 'PM-VO-001', fase: 'VO', domein: 'PM',
    activiteit: 'BTO-vergaderingen en aansturing VO',
    inc: [
      'Tweewekelijkse BTO-vergadering met Liander: agenda, voorzitterschap, verslag',
      'Interne teamsturing en eskalatie-management VO-fase',
      'Coördinatie multidisciplinair projectteam (TM, OM, CO, PB)',
    ],
    exc: [
      'Aanwezigheid bij meer dan 2 extra vergaderingen per maand op verzoek opdrachtgever (meerwerk)',
    ],
    variabel: 0, variabele_velden: [],
  },

  // ─── DO / TM ─────────────────────────────────────────────────────────────────
  {
    id: 'TM-DO-001', fase: 'DO', domein: 'TM',
    activiteit: 'DO tracé opstellen',
    inc: [
      'Definitief tracéontwerp in AutoCAD (.dwg) + PDF conform NLCS++ Netbeheer V12',
      'Definitieve ontwerpnota met alle ontwerpbeslissingen',
      'Coördinatie-tekeningen met bestaande infrastructuur (kabels & leidingen)',
      'Verwerking proefsleuvenresultaten en KLIC-gegevens in ontwerp',
    ],
    exc: [
      'Re-engineering na scopewijziging opdrachtgever (meerwerk)',
      'Revisieverwerking na aannemeraanbestedingen (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-DO-002', fase: 'DO', domein: 'TM',
    activiteit: 'KLIC-melding DO',
    inc: [
      'Uitvoeren actuele KLIC-melding voor het definitieve tracé',
      'Verwerken en archiveren KLIC-resultaten',
      'Signaleren wijzigingen t.o.v. VO-KLIC en doorvoeren in ontwerp',
    ],
    exc: [
      'Herhaalde KLIC bij verlopen geldigheid tijdens uitvoeringsfase (meerwerk)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-DO-003', fase: 'DO', domein: 'TM',
    activiteit: 'Proefsleuven DO',
    inc: [
      'Uitvoering proefsleuven ter bevestiging definitieve tracé en ligging conflicten',
      'Fotodocumentatie en verslag proefsleuven DO',
      'Aantal DO-proefsleuven: _____  [invullen per project]',
    ],
    exc: [
      'Herstel straatwerk (aparte post uitvoering)',
    ],
    variabel: 1, variabele_velden: ['Aantal DO-proefsleuven (st)'],
  },
  {
    id: 'TM-DO-004', fase: 'DO', domein: 'TM',
    activiteit: 'HDD boorprofiel',
    inc: [
      'Opstellen boorprofiel(en) voor HDD/gestuurde boring per kruising',
      'Grondmechanisch advies op basis van geotechnisch onderzoek',
      'Aantal boorprofielen: _____  [invullen per project]',
    ],
    exc: [
      'Geotechnische boorpunten en laboratoriumanalyses (aparte post CO)',
      'Boorplan (aparte post TM-DO-005)',
    ],
    variabel: 1, variabele_velden: ['Aantal boorprofielen (st)'],
  },
  {
    id: 'TM-DO-005', fase: 'DO', domein: 'TM',
    activiteit: 'HDD boorplan',
    inc: [
      'Opstellen uitvoeringsgereed boorplan per HDD-kruising',
      'Slingerkrachtberekening en keuze boorspoeling',
      'Risicobeoordeling boorproces (frac-out, belemmering)',
      'Aantal boorplannen: _____  [invullen per project]',
    ],
    exc: [
      'Uitvoering HDD-boring (aparte post aannemer)',
    ],
    variabel: 1, variabele_velden: ['Aantal boorplannen (st)'],
  },
  {
    id: 'TM-DO-006', fase: 'DO', domein: 'TM',
    activiteit: 'Nano-boring',
    inc: [
      'Ontwerp en documentatie nano-boring(en) voor kleine kruisingen',
      'Specificatie boortechniek, lengte en diameter per kruising',
    ],
    exc: [
      'Uitvoering nano-boring (aparte post aannemer)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-DO-007', fase: 'DO', domein: 'TM',
    activiteit: 'DO stationsontwerp',
    inc: [
      'Definitief ontwerp MS-station(s): opsteltekeningen, fundering, bekabeling intern',
      'Aansluittekeningen netaansluiting conform Liander-richtlijnen',
      'Aantal stations DO: _____  [invullen per project]',
    ],
    exc: [
      'Bouw- en omgevingsvergunning station (aparte post OM)',
      'Levering en montage station (aparte post uitvoering)',
    ],
    variabel: 1, variabele_velden: ['Aantal stations DO (st)'],
  },
  {
    id: 'TM-DO-008', fase: 'DO', domein: 'TM',
    activiteit: 'DO-raming',
    inc: [
      'Gedetailleerde kostenraming DO-fase op basis van definitief ontwerp',
      'Budgetsplit per WBS-element',
      'Toelichting op ramingsonzekerheden en risico-opslag',
    ],
    exc: [
      'Aanbestedingsdocumenten en bestek (aparte post indien uitbesteed)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-DO-009', fase: 'DO', domein: 'TM',
    activiteit: 'Eisenverificatie DO',
    inc: [
      'Toetsen DO-ontwerp aan definitieve eisenspecificatie Liander',
      'Actualisering verificatiematrix DO met status per eis',
      'Vastleggen resterende openstaande punten richting UO',
    ],
    exc: [
      'Aanpassing eisenspecificatie door opdrachtgever (meerwerk)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-DO-010', fase: 'DO', domein: 'TM',
    activiteit: 'Tollgate DO',
    inc: [
      'Voorbereiding en presentatie tollgate DO aan opdrachtgever',
      'Tollgate-checklist: ontwerp, vergunningen, risico, planning en budget',
      'Vastleggen go/no-go besluit en actiepunten',
    ],
    exc: [
      'Herhaalde tollgate-presentatie bij afkeuring (meerwerk)',
    ],
    variabel: 0, variabele_velden: [],
  },

  // ─── DO / OM ─────────────────────────────────────────────────────────────────
  {
    id: 'OM-DO-001', fase: 'DO', domein: 'OM',
    activiteit: 'ZRO afronden per eigenaartype',
    inc: [
      'Definitief afsluiten openstaande ZRO\'s uit VO-fase per eigenaartype',
      'Registratie en archivering getekende overeenkomsten',
      'Overdracht getekende ZRO\'s aan notaris/opdrachtgever',
    ],
    exc: [
      'Notariële passering (aparte post)',
      'Juridische bijstand bij geschillen',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'OM-DO-002', fase: 'DO', domein: 'OM',
    activiteit: 'Betredingstoestemmingen DO',
    inc: [
      'Aanvragen betredingstoestemmingen voor DO-werkzaamheden (boringen, proefsleuven)',
      'Registratie en archivering verleende toestemmingen',
    ],
    exc: [
      'Betredingstoestemmingen UO-fase (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'OM-DO-003', fase: 'DO', domein: 'OM',
    activiteit: 'Inventarisatie bomenkap',
    inc: [
      'Definitieve inventarisatie te kappen bomen op basis van DO-tracé',
      'Aanvraag kapvergunning bij bevoegd gezag (gemeente)',
      'Herplantplan conform compensatieplicht',
    ],
    exc: [
      'Feitelijke kap en herplant (aparte post uitvoering)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'OM-DO-004', fase: 'DO', domein: 'OM',
    activiteit: 'Omgevingsvergunning',
    inc: [
      'Opstellen en indienen aanvraag omgevingsvergunning (Wabo/Omgevingswet)',
      'Begeleiden procedure tot onherroepelijk besluit',
      'Naam bevoegd gezag: _____  [invullen per project]',
    ],
    exc: [
      'Bezwaarprocedure bij weigering (aparte post)',
      'Leges vergunningaanvraag (voor rekening opdrachtgever)',
    ],
    variabel: 1, variabele_velden: ['Naam bevoegd gezag'],
  },
  {
    id: 'OM-DO-005', fase: 'DO', domein: 'OM',
    activiteit: 'Watervergunning Hoogheemraadschap Rijnland',
    inc: [
      'Opstellen en indienen vergunningaanvraag kruising watergang Rijnland',
      'Overleg met Rijnland en begeleiden behandeling',
      'Kruisinglocatie: _____  [invullen per project]',
    ],
    exc: [
      'Leges (voor rekening opdrachtgever)',
      'Bezwaarprocedure (aparte post)',
    ],
    variabel: 1, variabele_velden: ['Kruisinglocatie'],
  },
  {
    id: 'OM-DO-006', fase: 'DO', domein: 'OM',
    activiteit: 'Instemmingsbesluit gemeente',
    inc: [
      'Indienen aanvraag instemmingsbesluit conform AVOI/gemeentelijke verordening',
      'Begeleiden behandeling door gemeente',
      'Naam gemeente: _____  [invullen per project]',
    ],
    exc: [
      'Leges en werkzaamhedenplan (voor rekening aannemer)',
      'Bezwaarprocedure',
    ],
    variabel: 1, variabele_velden: ['Naam gemeente'],
  },
  {
    id: 'OM-DO-007', fase: 'DO', domein: 'OM',
    activiteit: 'Watervergunning RWS',
    inc: [
      'Opstellen en indienen vergunningaanvraag kruising rijkswater',
      'Overleg met RWS en begeleiden behandeling',
      'Naam vaarweg/watergang: _____  [invullen per project]',
    ],
    exc: [
      'Leges (voor rekening opdrachtgever)',
      'Bezwaarprocedure (aparte post)',
    ],
    variabel: 1, variabele_velden: ['Naam vaarweg'],
  },
  {
    id: 'OM-DO-008', fase: 'DO', domein: 'OM',
    activiteit: 'Spoorwegkruising ProRail',
    inc: [
      'Formele aanvraag toestemming spoorwegkruising bij ProRail',
      'Opstellen technisch dossier conform ProRail-vereisten',
      'Overleg met ProRail tracékruisingloket',
      'Locatie kruising: _____  [invullen per project]',
    ],
    exc: [
      'Spoortechnische begeleiding tijdens uitvoering (aparte post)',
      'Leges ProRail (voor rekening opdrachtgever)',
    ],
    variabel: 1, variabele_velden: ['Locatie kruising'],
  },
  {
    id: 'OM-DO-009', fase: 'DO', domein: 'OM',
    activiteit: 'Ontheffing Wet natuurbescherming (Wnb)',
    inc: [
      'Opstellen en indienen ontheffingsaanvraag Wnb bij bevoegd gezag',
      'Ecologisch werkprotocol als bijlage bij aanvraag',
      'Naam bevoegd gezag: _____  [invullen per project]',
    ],
    exc: [
      'Passende beoordeling (aparte post)',
      'Bezwaarprocedure (aparte post)',
    ],
    variabel: 1, variabele_velden: ['Naam bevoegd gezag'],
  },
  {
    id: 'OM-DO-010', fase: 'DO', domein: 'OM',
    activiteit: 'Omgevingsdialoog',
    inc: [
      'Plannen en uitvoeren informatiebijeenkomst voor omwonenden',
      'Beantwoording vragen en registratie zorgen/wensen',
      'Verslag omgevingsdialoog en communicatieplan uitvoering',
    ],
    exc: [
      'Mediationtraject bij conflicten (aparte post)',
      'PR-campagne of publiciteitswerk (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'OM-DO-011', fase: 'DO', domein: 'OM',
    activiteit: 'Vergunningenbewaking DO',
    inc: [
      'Bewaken status alle lopende vergunningentrajecten',
      'Tijdig signaleren knelpunten en initiëren bijsturing',
      'Vergunningenmatrix actueel houden voor DO-fase',
    ],
    exc: [
      'Bezwaarprocedures en rechtszaken (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },

  // ─── DO / CO ─────────────────────────────────────────────────────────────────
  {
    id: 'CO-DO-001', fase: 'DO', domein: 'CO',
    activiteit: 'IVO Archeologie',
    inc: [
      'Inventariserend veldonderzoek archeologie (IVO) conform KNA-protocol',
      'Booronderzoek of proefsleuvenonderzoek conform selectiebesluit',
      'Rapportage met advies over archeologische vrijgave',
    ],
    exc: [
      'Opgraving bij archeologische vondsten (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-DO-002', fase: 'DO', domein: 'CO',
    activiteit: 'NGE risicoanalyse DO',
    inc: [
      'Actualiseren NGE-risicokaart op basis van DO-tracé',
      'Definitieve detectiestrategie per tracésectie',
    ],
    exc: [
      'Detectieonderzoek (aparte post CO-DO-003)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-DO-003', fase: 'DO', domein: 'CO',
    activiteit: 'NGE detectieonderzoek',
    inc: [
      'Magnetometrisch oppervlaktedetectieonderzoek voor NGE-verdachte zones',
      'Rapport met detectiekaarten en vrijgavedocument voor uitvoering',
    ],
    exc: [
      'Ruiming aangetroffen explosieven (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-DO-004', fase: 'DO', domein: 'CO',
    activiteit: 'Bemalingsadvies',
    inc: [
      'Hydrologische modellering en bemalingsadvies voor ontgraving/bemalingsfase',
      'Lozingsadvies conform Activiteitenbesluit',
      'Monitoringsplan grondwater tijdens bemaling',
    ],
    exc: [
      'Uitvoering en installatie bemaling (aparte post aannemer)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-DO-005', fase: 'DO', domein: 'CO',
    activiteit: 'Ecologieonderzoek DO',
    inc: [
      'Nader veldonderzoek beschermde soorten (vleermuizen, amfibieën, planten)',
      'Ecologisch werkprotocol als basis voor ontheffingsaanvraag',
    ],
    exc: [
      'Begeleiding tijdens uitvoering door ecoloog (aparte post UO)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-DO-006', fase: 'DO', domein: 'CO',
    activiteit: 'Bodemonderzoek nader',
    inc: [
      'Nader bodemonderzoek ter afpaling aangetroffen verontreiniging',
      'Saneringsnoodzaakbeoordeling en kostenraming sanering',
    ],
    exc: [
      'Sanering (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-DO-007', fase: 'DO', domein: 'CO',
    activiteit: 'Asbestonderzoek DO (NEN 5707/5897)',
    inc: [
      'Nader asbestonderzoek op basis van VO-quickscan-uitkomsten',
      'Asbestinventarisatie type B conform NEN 5707 voor aangetaste secties',
    ],
    exc: [
      'Asbestsanering (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-DO-008', fase: 'DO', domein: 'CO',
    activiteit: 'Cultuurtechnisch advies DO',
    inc: [
      'Definitief cultuurtechnisch advies en herplantplan conform kapvergunning',
      'Groencompensatierapportage',
    ],
    exc: [
      'Uitvoering herplant (aparte post aannemer)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-DO-009', fase: 'DO', domein: 'CO',
    activiteit: 'Geotechnisch onderzoek',
    inc: [
      'Geotechnische boringen en/of sonderingen langs het tracé',
      'Grondmechanisch rapport met draaglast, zettingsgevaar en bodemopbouw',
      'Input voor HDD-boorplannen en fundering stations',
    ],
    exc: [
      'Grondwatermonitoring tijdens uitvoering (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-DO-010', fase: 'DO', domein: 'CO',
    activiteit: 'Bodemziektes (Phytophthora etc.)',
    inc: [
      'Inventarisatie risico bodemziektes (Phytophthora, essentaksterfte) langs tracé',
      'Advies maatregelen ter voorkoming verspreiding',
    ],
    exc: [
      'Behandeling of verwijdering aangetaste bomen/planten (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },

  // ─── DO / PB ─────────────────────────────────────────────────────────────────
  {
    id: 'PB-DO-001', fase: 'DO', domein: 'PB',
    activiteit: 'Scopebewaking DO',
    inc: [
      'Bewaken projectscope DO-fase versus BTO en VO-output',
      'Registreren en beoordelen meerwerk- en minderwerkverzoeken',
      'Maandelijkse scoperapportage aan opdrachtgever',
    ],
    exc: [
      'Contractbehandeling meerwerkgeschillen (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'PB-DO-002', fase: 'DO', domein: 'PB',
    activiteit: 'Planning + risico DO',
    inc: [
      'Detailplanning DO-fase opstellen en bewaken',
      'Risicoregister actualiseren DO-fase',
      'Tweewekelijkse voortgangsrapportage',
    ],
    exc: [],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'PB-DO-003', fase: 'DO', domein: 'PB',
    activiteit: 'Financieel beheer DO',
    inc: [
      'Actualiseren kostenraming op basis van DO-resultaten',
      'Bewaken budget en signaleren dreigende overschrijdingen',
      'Maandelijkse financiële rapportage aan opdrachtgever',
    ],
    exc: [
      'Meerwerk als gevolg van externe omstandigheden (force majeure)',
    ],
    variabel: 0, variabele_velden: [],
  },

  // ─── DO / PM ─────────────────────────────────────────────────────────────────
  {
    id: 'PM-DO-001', fase: 'DO', domein: 'PM',
    activiteit: 'BTO-vergaderingen DO',
    inc: [
      'Tweewekelijkse BTO-vergadering met Liander in DO-fase',
      'Interne teamsturing en escalatie-management',
      'Coördinatie alle disciplines (TM, OM, CO, PB)',
    ],
    exc: [
      'Extra vergaderingen buiten afgesproken frequentie (meerwerk)',
    ],
    variabel: 0, variabele_velden: [],
  },

  // ─── UO / TM ─────────────────────────────────────────────────────────────────
  {
    id: 'TM-UO-001', fase: 'UO', domein: 'TM',
    activiteit: 'UO tracé (uitvoeringsgereed)',
    inc: [
      'Uitvoeringsgereed tracétekeningen conform NLCS++ Netbeheer V12',
      'Detailtekeningen voor bijzondere constructies (mantelbuizen, kruisingen)',
      'Revisietekeningen als-gerealiseerd na oplevering',
    ],
    exc: [
      'Bouwtekeningen door aannemer (voor rekening aannemer)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-UO-002', fase: 'UO', domein: 'TM',
    activiteit: 'UO stations (uitvoeringsgereed)',
    inc: [
      'Uitvoeringsgereed stationstekeningen en installatiedocumenten',
      'Definitieve kabelschema\'s en aansluitdocumentatie',
    ],
    exc: [
      'Leveranciersdocumentatie station (voor rekening leverancier)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-UO-003', fase: 'UO', domein: 'TM',
    activiteit: 'Bedieningsplannen',
    inc: [
      'Opstellen bedieningsplannen voor het nieuwe MS-net segment',
      'Afstemming met Liander bedrijfsvoeringsdienst',
    ],
    exc: [
      'Implementatie in SCADA-systeem (aparte post Liander)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-UO-004', fase: 'UO', domein: 'TM',
    activiteit: 'Keuringsplannen',
    inc: [
      'Opstellen keuringsplan voor MS-kabel en stations conform Liander IQ-systematiek',
      'Testprocedures hoogspanningsproef, isolatiemeting en doorgangscontrole',
      'Checklist FAT-/SAT-activiteiten',
    ],
    exc: [
      'Uitvoering keuringen (aparte post aannemer/Liander)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-UO-005', fase: 'UO', domein: 'TM',
    activiteit: 'Civiele werkplannen',
    inc: [
      'Werkplannen voor civiele uitvoering (ontgraving, mantelbuizen, aanvulling)',
      'Methode beschrijving, volgorde werkzaamheden en kwaliteitscriteria',
    ],
    exc: [
      'Uitwerking door aannemer (voor rekening aannemer)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-UO-006', fase: 'UO', domein: 'TM',
    activiteit: 'Werkplannen warm werk',
    inc: [
      'Werkplannen voor elektrotechnische werkzaamheden (mofferen, aansluitingen)',
      'VGM-instructies voor werken nabij spanning',
    ],
    exc: [
      'Uitwerking door gecertificeerde aannemer (voor rekening aannemer)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-UO-007', fase: 'UO', domein: 'TM',
    activiteit: 'Controle K&L derden',
    inc: [
      'Beoordeling aanleveringen kabels & leidingen van derden in uitvoeringsfase',
      'Coördinatie conflicten met nutsbeheerders tijdens uitvoering',
    ],
    exc: [
      'Verlossing conflicterende leidingen derden (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-UO-008', fase: 'UO', domein: 'TM',
    activiteit: 'UO-raming + overdracht',
    inc: [
      'Definitieve uitvoeringsraming (kostprijsniveau)',
      'Dossieroverdracht naar opdrachtgever (as-built tekeningen, rapporten)',
    ],
    exc: [
      'Eindafrekening met aannemer (aparte post PB)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'TM-UO-009', fase: 'UO', domein: 'TM',
    activiteit: 'Tollgate UO',
    inc: [
      'Voorbereiding en presentatie tollgate UO (uitvoeringsgereed)',
      'Tollgate-checklist: vergunningen onherroepelijk, ontwerp gereed, materialen besteld',
      'Go/no-go besluit en vrijgave uitvoering',
    ],
    exc: [
      'Herhaalde tollgate bij afkeuring (meerwerk)',
    ],
    variabel: 0, variabele_velden: [],
  },

  // ─── UO / OM ─────────────────────────────────────────────────────────────────
  {
    id: 'OM-UO-001', fase: 'UO', domein: 'OM',
    activiteit: 'Vergunningenbewaking + ZRO\'s gereed',
    inc: [
      'Bewaken onherroepelijkheid alle vergunningen voor aanvang uitvoering',
      'Controleren beschikbaarheid getekende ZRO\'s per tracésectie',
      'Laatste afstemming met grondeigenaren vóór start werkzaamheden',
    ],
    exc: [
      'Nieuwe bezwaarprocedures (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'OM-UO-002', fase: 'UO', domein: 'OM',
    activiteit: 'Bouwcommunicatie',
    inc: [
      'Bewonersbrief vooraankondiging werkzaamheden (per tracésectie)',
      'Omgevingsloket voor vragen en meldingen tijdens uitvoering',
      'Nazorg klachten- en meldingenbeheer',
    ],
    exc: [
      'Advertentiekosten lokale krant/media (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },

  // ─── UO / CO ─────────────────────────────────────────────────────────────────
  {
    id: 'CO-UO-001', fase: 'UO', domein: 'CO',
    activiteit: 'Definitieve AERIUS-berekening',
    inc: [
      'Definitieve AERIUS Calculator-berekening voor aanlegfase (uitvoeringsfasering)',
      'Rapportage met toetsing Natura 2000-gebieden',
    ],
    exc: [
      'Passende beoordeling (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-UO-002', fase: 'UO', domein: 'CO',
    activiteit: 'CS-OOO (vlak vóór uitvoering)',
    inc: [
      'Civieltechnische schouw OOO vlak voor aanvang uitvoering',
      'Definitief vrijgavedocument tracé NGE',
    ],
    exc: [
      'Aanvullende detectie bij herbeoordeling (meerwerk)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-UO-003', fase: 'UO', domein: 'CO',
    activiteit: 'Ecologisch werkprotocol + begeleiding',
    inc: [
      'Definitief ecologisch werkprotocol conform ontheffing Wnb',
      'Ecologische begeleiding tijdens werkzaamheden in gevoelige perioden',
    ],
    exc: [
      'Extra begeleidingsdagen bij onvoorziene vondsten (meerwerk)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-UO-004', fase: 'UO', domein: 'CO',
    activiteit: 'Bemalingsplan',
    inc: [
      'Definitief bemalingsplan per bouwput conform Activiteitenbesluit',
      'Lozingsmelding bij waterschap/gemeente',
      'Monitoringsplan grondwater tijdens bemaling',
    ],
    exc: [
      'Uitvoering en installatie bemaling (aparte post aannemer)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-UO-005', fase: 'UO', domein: 'CO',
    activiteit: 'Verkeersmaatregelenplan',
    inc: [
      'Opstellen verkeersmaatregelenplan (VMP) per wegvak conform CROW 96a/b',
      'Afstemming met gemeentelijke verkeersdeskundige',
      'Aanvraag verkeersbesluit bij gemeente (indien vereist)',
    ],
    exc: [
      'Uitvoering verkeersmaatregelen (voor rekening aannemer)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'CO-UO-006', fase: 'UO', domein: 'CO',
    activiteit: 'PvE + cultuurtechnisch UO',
    inc: [
      'Programma van Eisen groen/straatwerk voor herstelfase na uitvoering',
      'Cultuurtechnische eindopname na oplevering',
    ],
    exc: [
      'Uitvoering groen- en straatwerkherstel (aparte post aannemer)',
    ],
    variabel: 0, variabele_velden: [],
  },

  // ─── UO / PB ─────────────────────────────────────────────────────────────────
  {
    id: 'PB-UO-001', fase: 'UO', domein: 'PB',
    activiteit: 'Scopebewaking UO',
    inc: [
      'Bewaken projectscope uitvoeringsfase',
      'Registreren en beoordelen meerwerk uitvoering',
    ],
    exc: [],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'PB-UO-002', fase: 'UO', domein: 'PB',
    activiteit: 'Planning + risico UO',
    inc: [
      'Detailplanning uitvoeringsfase bewaken',
      'Risicoregister actualiseren UO-fase',
      'Wekelijkse voortgangsrapportage uitvoering',
    ],
    exc: [],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'PB-UO-003', fase: 'UO', domein: 'PB',
    activiteit: 'Financieel beheer + eindafrekening',
    inc: [
      'Bewaken budget uitvoeringsfase',
      'Eindafrekening met aannemer en opdrachtgever',
      'Definitieve kostenoverzicht als-gerealiseerd',
    ],
    exc: [
      'Geschilprocedures met aannemer (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'PB-UO-004', fase: 'UO', domein: 'PB',
    activiteit: 'Kwaliteitsborging en VGM',
    inc: [
      'Kwaliteitsplan uitvoering (ITP — Inspection & Test Plan)',
      'VGM-toezicht op de bouw en bewaking naleving VGP',
      'Afwijkingenregistratie en -bewaking uitvoering',
    ],
    exc: [
      'Onafhankelijke derde-partij inspectie (aparte post)',
    ],
    variabel: 0, variabele_velden: [],
  },

  // ─── UO / PM ─────────────────────────────────────────────────────────────────
  {
    id: 'PM-UO-001', fase: 'UO', domein: 'PM',
    activiteit: 'BTO-vergaderingen UO',
    inc: [
      'Wekelijkse bouwvergadering met Liander, aannemer en projectteam',
      'Voorzitterschap, agenda en verslaggeving bouwvergaderingen',
      'Directievoering en toezicht op uitvoering',
    ],
    exc: [
      'Extra coördinatievergaderingen derden (meerwerk)',
    ],
    variabel: 0, variabele_velden: [],
  },

  // ─── NAO ─────────────────────────────────────────────────────────────────────
  {
    id: 'PM-NAO-001', fase: 'NAO', domein: 'PM',
    activiteit: 'Akkoord definitieve NAO',
    inc: [
      'Opstellen en afstemmen Nota van Aanmerkingen en Opmerkingen (NAO)',
      'Verwerking NAO-punten door aannemer en verificatie oplevering',
      'Formele tekening voor akkoord oplevering met Liander',
    ],
    exc: [
      'Herstelwerkzaamheden door aannemer (voor rekening aannemer)',
    ],
    variabel: 0, variabele_velden: [],
  },
  {
    id: 'PB-NAO-001', fase: 'NAO', domein: 'PB',
    activiteit: 'Eindcontrole versiebeheer + dossieroverdracht',
    inc: [
      'Eindcontrole volledigheid projectdossier (as-built, vergunningen, ZRO\'s, rapporten)',
      'Versiebeheercontrole alle deliverables',
      'Overdracht compleet digitaal projectdossier aan Liander/opdrachtgever',
    ],
    exc: [
      'Archivering bij externe DMS-dienstverlener (voor rekening opdrachtgever)',
    ],
    variabel: 0, variabele_velden: [],
  },
];

// Build insert data with sort_order
const insertBlock = db.prepare(`
  INSERT OR REPLACE INTO blocks (id, fase, domein, activiteit, inc_items, exc_items, variabel, variabele_velden, sort_order)
  VALUES (@id, @fase, @domein, @activiteit, @inc_items, @exc_items, @variabel, @variabele_velden, @sort_order)
`);

const insertAll = db.transaction(() => {
  blocks.forEach((b, i) => {
    insertBlock.run({
      id: b.id,
      fase: b.fase,
      domein: b.domein,
      activiteit: b.activiteit,
      inc_items: JSON.stringify(b.inc),
      exc_items: JSON.stringify(b.exc),
      variabel: b.variabel,
      variabele_velden: JSON.stringify(b.variabele_velden),
      sort_order: i,
    });
  });
});

insertAll();
console.log(`✅  Seed voltooid: ${blocks.length} bouwblokken ingevoerd.`);
