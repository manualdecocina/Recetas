import type { LegalPageContentMap } from '@/lib/legal-content'

export const PRIVACIDAD_CONTENT: LegalPageContentMap = {
  es: {
    metaTitle: 'Política de privacidad | Manual de Cocina',
    metaDescription: 'Política de privacidad de Manual de Cocina: qué datos se tratan, con qué base legal, qué proveedores intervienen y qué derechos tienes.',
    eyebrow: 'Privacidad',
    title: 'Política de privacidad',
    intro: 'Esta política explica, en un lenguaje claro, qué información trata Manual de Cocina, con qué finalidad, durante cuánto tiempo y qué derechos puedes ejercer. Última actualización: septiembre de 2026.',
    sections: [
      {
        heading: '1. Responsable del tratamiento',
        html: "<p>El responsable de este sitio es Néstor Bastidas, con domicilio en Cali, Valle del Cauca, Colombia.</p><p>Contacto: <a href='mailto:hola@manualdecocina.com'>hola@manualdecocina.com</a> · Teléfono: 302 815 0839.</p>",
      },
      {
        heading: '2. Qué datos tratamos',
        html: "<p>Manual de Cocina es un sitio de lectura libre: no es necesario registrarse ni crear una cuenta para navegar, buscar recetas, leerlas o guardarlas como favoritas.</p><p>No recopilamos datos personales por el simple hecho de visitar el sitio. El único dato personal que tratamos es el que tú mismo nos envías voluntariamente al escribirnos por correo (tu dirección de email, tu nombre si lo incluyes y el contenido del mensaje), y únicamente para responder tu consulta.</p>",
      },
      {
        heading: '3. Base legal del tratamiento',
        html: '<p>Cuando nos escribes, tratamos tus datos con base en tu consentimiento, expresado al enviarnos voluntariamente el mensaje, y en nuestro interés legítimo de poder responderte. No usamos esos datos para ningún otro fin ni los cedemos a terceros.</p>',
      },
      {
        heading: '4. Almacenamiento local en tu navegador',
        html: '<p>Dos funciones del sitio guardan información únicamente en tu propio dispositivo, usando la memoria local del navegador (localStorage), sin enviarla a nuestros servidores ni a nadie más:</p><ul><li><strong>Recetas favoritas:</strong> guarda los identificadores de las recetas que marcas para recordarlas en ese navegador.</li><li><strong>Preferencia de tema (claro/oscuro):</strong> recuerda si prefieres el sitio en modo claro o modo oscuro.</li></ul><p>Puedes borrar esta información en cualquier momento desde la configuración de tu navegador; al hacerlo, perderás tus favoritas guardadas en ese dispositivo.</p>',
      },
      {
        heading: '5. Proveedores que intervienen en el sitio',
        html: '<p>Para operar el sitio usamos los siguientes proveedores, que actúan como encargados técnicos y pueden procesar datos en servidores fuera de Colombia:</p><ul><li><strong>Supabase</strong> (base de datos e infraestructura donde vive el contenido editorial del sitio).</li><li><strong>Hostinger</strong> (alojamiento y entrega del sitio web).</li><li><strong>Google AdSense</strong> (publicidad; ver la sección siguiente).</li></ul><p>No compartimos con estos proveedores más información de la estrictamente necesaria para que el sitio funcione.</p>',
      },
      {
        heading: '6. Publicidad con Google AdSense',
        html: "<p>Manual de Cocina se monetiza exclusivamente con Google AdSense; no usamos ni tenemos previsto usar ningún otro servicio publicitario. El dominio manualdecocina.com ya está dado de alta y aprobado en Google AdSense (ID de publisher <code>pub-2592990699767586</code>).</p><p>Cuando los anuncios estén activos, Google y sus socios publicitarios pueden utilizar cookies, identificadores de dispositivo y tecnologías similares para mostrar anuncios, medir su rendimiento y, si corresponde, personalizarlos según tu actividad. Nosotros no tenemos acceso a esos datos ni los recibimos: los trata Google como responsable independiente, conforme a su propia <a href='https://policies.google.com/technologies/ads' target='_blank' rel='noopener noreferrer'>política de publicidad</a>.</p><p>Puedes gestionar la personalización de anuncios de Google desde <a href='https://adssettings.google.com' target='_blank' rel='noopener noreferrer'>adssettings.google.com</a>, y consultar qué empresas participan en la subasta de anuncios en <a href='https://www.google.com/settings/ads/authenticated' target='_blank' rel='noopener noreferrer'>Configuración de anuncios de Google</a>. Antes de mostrar anuncios a personas usuarias de la Unión Europea, Reino Unido o Suiza, incorporaremos en el sitio una herramienta de consentimiento de cookies para que puedas aceptarlas o rechazarlas.</p>",
      },
      {
        heading: '7. Sin analítica ni rastreo propio',
        html: '<p>No utilizamos Google Analytics, píxeles de redes sociales ni ningún servicio propio de analítica o seguimiento de comportamiento. La única medición que puede existir en el sitio es la que realiza Google AdSense para el funcionamiento de sus propios anuncios, descrita en la sección anterior.</p>',
      },
      {
        heading: '8. Tus derechos',
        html: "<p>Sobre cualquier dato personal que nos hayas enviado por correo, puedes solicitarnos en cualquier momento: acceder a él, rectificarlo, pedir su supresión, oponerte a su tratamiento o solicitar su portabilidad. Escríbenos a <a href='mailto:hola@manualdecocina.com'>hola@manualdecocina.com</a> y atenderemos tu solicitud en un plazo razonable.</p><p>Si nos escribes desde la Unión Europea, también tienes derecho a presentar una reclamación ante la autoridad de protección de datos de tu país.</p>",
      },
      {
        heading: '9. Menores de edad',
        html: 'El sitio no está dirigido a menores de edad y no solicitamos ni recopilamos intencionalmente datos de menores. Si detectamos que hemos recibido datos de un menor sin el consentimiento correspondiente, los eliminaremos.',
      },
      {
        heading: '10. Conservación de los mensajes',
        html: 'Conservamos los correos que nos envías solo durante el tiempo necesario para atender tu consulta y, después, el tiempo razonable para conservar un histórico de soporte, salvo que nos pidas su eliminación antes.',
      },
      {
        heading: '11. Cambios en esta política',
        html: 'Podemos actualizar esta política cuando cambien nuestras herramientas o el marco legal aplicable. La fecha de la última actualización aparece al inicio de esta página.',
      },
    ],
  },
  en: {
    metaTitle: 'Privacy Policy | Manual de Cocina',
    metaDescription: 'Privacy policy of Manual de Cocina: what data we process, on what legal basis, which providers are involved and what rights you have.',
    eyebrow: 'Privacy',
    title: 'Privacy Policy',
    intro: 'This policy explains, in plain language, what information Manual de Cocina processes, for what purpose, for how long, and what rights you can exercise. Last updated: September 2026.',
    sections: [
      {
        heading: '1. Data controller',
        html: "<p>The controller of this site is Néstor Bastidas, based in Cali, Valle del Cauca, Colombia.</p><p>Contact: <a href='mailto:hola@manualdecocina.com'>hola@manualdecocina.com</a> · Phone: +57 302 815 0839.</p>",
      },
      {
        heading: '2. What data we process',
        html: "<p>Manual de Cocina is free to read: no sign-up or account is needed to browse, search, read or save recipes as favorites.</p><p>We don't collect personal data simply because you visit the site. The only personal data we process is what you voluntarily send us by email (your address, your name if you include it, and the content of your message), and only to answer your request.</p>",
      },
      {
        heading: '3. Legal basis',
        html: "<p>When you write to us, we process your data based on your consent, given by voluntarily sending the message, and on our legitimate interest in being able to reply. We don't use that data for anything else and we don't share it with third parties.</p>",
      },
      {
        heading: '4. Local storage on your browser',
        html: "<p>Two features of the site store information only on your own device, using your browser's local storage (localStorage), without sending it to our servers or to anyone else:</p><ul><li><strong>Favorite recipes:</strong> stores the IDs of the recipes you bookmark, to remember them on that browser.</li><li><strong>Theme preference (light/dark):</strong> remembers whether you prefer light or dark mode.</li></ul><p>You can clear this information at any time from your browser settings; doing so will remove your saved favorites on that device.</p>",
      },
      {
        heading: '5. Providers involved',
        html: '<p>To run the site we use the following providers, acting as technical processors, which may process data on servers outside Colombia:</p><ul><li><strong>Supabase</strong> (the database and infrastructure holding the site\'s editorial content).</li><li><strong>Hostinger</strong> (web hosting and delivery).</li><li><strong>Google AdSense</strong> (advertising; see the next section).</li></ul><p>We only share with these providers the information strictly necessary for the site to work.</p>',
      },
      {
        heading: '6. Advertising with Google AdSense',
        html: "<p>Manual de Cocina is monetized exclusively through Google AdSense; we don't use, and have no plans to use, any other advertising service. The domain manualdecocina.com is already registered and approved with Google AdSense (publisher ID <code>pub-2592990699767586</code>).</p><p>Once ads are active, Google and its advertising partners may use cookies, device identifiers and similar technologies to serve ads, measure their performance and, where applicable, personalize them based on your activity. We don't have access to that data ourselves — it's processed by Google as an independent controller, under its own <a href='https://policies.google.com/technologies/ads' target='_blank' rel='noopener noreferrer'>advertising policy</a>.</p><p>You can manage Google ad personalization at <a href='https://adssettings.google.com' target='_blank' rel='noopener noreferrer'>adssettings.google.com</a>, and see which companies take part in ad auctions at <a href='https://www.google.com/settings/ads/authenticated' target='_blank' rel='noopener noreferrer'>Google Ads Settings</a>. Before showing ads to visitors from the EU, UK or Switzerland, we will add a cookie-consent tool to the site so you can accept or reject them.</p>",
      },
      {
        heading: '7. No analytics or tracking of our own',
        html: "<p>We don't use Google Analytics, social-media pixels, or any analytics or behavior-tracking service of our own. The only measurement that may exist on the site is the one Google AdSense performs for its own ads, described above.</p>",
      },
      {
        heading: '8. Your rights',
        html: "<p>Regarding any personal data you've sent us by email, you can ask us at any time to: access it, correct it, delete it, object to its processing, or request its portability. Write to <a href='mailto:hola@manualdecocina.com'>hola@manualdecocina.com</a> and we'll handle your request within a reasonable time.</p><p>If you write to us from the European Union, you also have the right to lodge a complaint with your country's data protection authority.</p>",
      },
      {
        heading: '9. Minors',
        html: "The site is not directed at minors and we don't knowingly request or collect data from minors. If we learn that we've received data from a minor without appropriate consent, we will delete it.",
      },
      {
        heading: '10. Retention of messages',
        html: "We keep the emails you send us only for as long as needed to handle your request, plus a reasonable period afterward to keep a support record, unless you ask us to delete them sooner.",
      },
      {
        heading: '11. Changes to this policy',
        html: 'We may update this policy when our tools or the applicable legal framework change. The last-updated date appears at the top of this page.',
      },
    ],
  },
  de: {
    metaTitle: 'Datenschutzerklärung | Manual de Cocina',
    metaDescription: 'Datenschutzerklärung von Manual de Cocina: welche Daten wir verarbeiten, auf welcher Rechtsgrundlage, welche Anbieter beteiligt sind und welche Rechte du hast.',
    eyebrow: 'Datenschutz',
    title: 'Datenschutzerklärung',
    intro: 'Diese Erklärung beschreibt in klarer Sprache, welche Informationen Manual de Cocina verarbeitet, zu welchem Zweck, wie lange und welche Rechte du hast. Letzte Aktualisierung: September 2026.',
    sections: [
      {
        heading: '1. Verantwortlicher',
        html: "<p>Verantwortlicher dieser Website ist Néstor Bastidas mit Sitz in Cali, Valle del Cauca, Kolumbien.</p><p>Kontakt: <a href='mailto:hola@manualdecocina.com'>hola@manualdecocina.com</a> · Telefon: +57 302 815 0839.</p>",
      },
      {
        heading: '2. Welche Daten wir verarbeiten',
        html: "<p>Manual de Cocina ist frei zugänglich: Zum Stöbern, Suchen, Lesen oder Speichern von Rezepten als Favoriten ist keine Registrierung oder kein Konto nötig.</p><p>Allein durch den Besuch der Website erheben wir keine personenbezogenen Daten. Die einzigen personenbezogenen Daten, die wir verarbeiten, sind jene, die du uns freiwillig per E-Mail sendest (deine E-Mail-Adresse, deinen Namen, falls angegeben, und den Inhalt deiner Nachricht) – ausschließlich, um deine Anfrage zu beantworten.</p>",
      },
      {
        heading: '3. Rechtsgrundlage',
        html: '<p>Wenn du uns schreibst, verarbeiten wir deine Daten auf Grundlage deiner Einwilligung, die du durch das freiwillige Absenden der Nachricht erteilst, sowie unseres berechtigten Interesses, dir antworten zu können. Wir nutzen diese Daten für keinen anderen Zweck und geben sie nicht an Dritte weiter.</p>',
      },
      {
        heading: '4. Lokaler Speicher in deinem Browser',
        html: '<p>Zwei Funktionen der Website speichern Informationen ausschließlich auf deinem eigenen Gerät, im lokalen Speicher deines Browsers (localStorage), ohne sie an unsere Server oder an Dritte zu senden:</p><ul><li><strong>Favorisierte Rezepte:</strong> speichert die IDs der von dir markierten Rezepte, um sie in diesem Browser wiederzuerkennen.</li><li><strong>Design-Einstellung (hell/dunkel):</strong> merkt sich, ob du den hellen oder dunklen Modus bevorzugst.</li></ul><p>Du kannst diese Informationen jederzeit über die Einstellungen deines Browsers löschen; dabei gehen deine auf diesem Gerät gespeicherten Favoriten verloren.</p>',
      },
      {
        heading: '5. Beteiligte Anbieter',
        html: '<p>Für den Betrieb der Website nutzen wir folgende Anbieter als technische Auftragsverarbeiter, die Daten auch auf Servern außerhalb Kolumbiens verarbeiten können:</p><ul><li><strong>Supabase</strong> (Datenbank und Infrastruktur für die redaktionellen Inhalte der Website).</li><li><strong>Hostinger</strong> (Hosting und Auslieferung der Website).</li><li><strong>Google AdSense</strong> (Werbung; siehe nächster Abschnitt).</li></ul><p>Wir teilen mit diesen Anbietern nur die Informationen, die für den Betrieb der Website unbedingt notwendig sind.</p>',
      },
      {
        heading: '6. Werbung mit Google AdSense',
        html: "<p>Manual de Cocina finanziert sich ausschließlich über Google AdSense; wir nutzen keinen anderen Werbedienst und planen dies auch nicht. Die Domain manualdecocina.com ist bei Google AdSense bereits registriert und genehmigt (Publisher-ID <code>pub-2592990699767586</code>).</p><p>Sobald Anzeigen aktiv sind, können Google und seine Werbepartner Cookies, Geräte-Kennungen und ähnliche Technologien nutzen, um Anzeigen auszuliefern, ihre Leistung zu messen und sie gegebenenfalls anhand deiner Aktivität zu personalisieren. Wir selbst haben keinen Zugriff auf diese Daten – sie werden von Google als eigenständigem Verantwortlichen gemäß dessen eigener <a href='https://policies.google.com/technologies/ads' target='_blank' rel='noopener noreferrer'>Werberichtlinie</a> verarbeitet.</p><p>Du kannst die Personalisierung von Google-Anzeigen unter <a href='https://adssettings.google.com' target='_blank' rel='noopener noreferrer'>adssettings.google.com</a> verwalten und einsehen, welche Unternehmen an den Anzeigenauktionen teilnehmen, unter <a href='https://www.google.com/settings/ads/authenticated' target='_blank' rel='noopener noreferrer'>Google Anzeigeneinstellungen</a>. Bevor wir Besucherinnen und Besuchern aus der EU, Großbritannien oder der Schweiz Anzeigen zeigen, integrieren wir ein Cookie-Consent-Tool, mit dem du sie akzeptieren oder ablehnen kannst.</p>",
      },
      {
        heading: '7. Keine eigene Analyse oder Nachverfolgung',
        html: '<p>Wir verwenden weder Google Analytics noch Social-Media-Pixel noch einen eigenen Analyse- oder Tracking-Dienst. Die einzige Messung, die auf der Website vorkommen kann, ist jene, die Google AdSense für den Betrieb seiner eigenen Anzeigen durchführt, wie im vorigen Abschnitt beschrieben.</p>',
      },
      {
        heading: '8. Deine Rechte',
        html: "<p>Bezüglich personenbezogener Daten, die du uns per E-Mail gesendet hast, kannst du jederzeit verlangen: Zugang, Berichtigung, Löschung, Widerspruch gegen die Verarbeitung oder Übertragbarkeit. Schreib uns an <a href='mailto:hola@manualdecocina.com'>hola@manualdecocina.com</a>, und wir bearbeiten deine Anfrage innerhalb einer angemessenen Frist.</p><p>Wenn du uns aus der Europäischen Union schreibst, hast du zudem das Recht, dich bei der Datenschutzbehörde deines Landes zu beschweren.</p>",
      },
      {
        heading: '9. Minderjährige',
        html: 'Die Website richtet sich nicht an Minderjährige, und wir fordern oder erheben wissentlich keine Daten von Minderjährigen. Sollten wir erfahren, dass wir ohne die erforderliche Einwilligung Daten eines Minderjährigen erhalten haben, werden wir diese löschen.',
      },
      {
        heading: '10. Aufbewahrung der Nachrichten',
        html: 'Wir speichern die E-Mails, die du uns sendest, nur so lange, wie es zur Bearbeitung deiner Anfrage nötig ist, zuzüglich einer angemessenen Frist zur Dokumentation, sofern du nicht um eine frühere Löschung bittest.',
      },
      {
        heading: '11. Änderungen dieser Erklärung',
        html: 'Wir können diese Erklärung aktualisieren, wenn sich unsere Werkzeuge oder der geltende rechtliche Rahmen ändern. Das Datum der letzten Aktualisierung erscheint oben auf dieser Seite.',
      },
    ],
  },
  fr: {
    metaTitle: 'Politique de confidentialité | Manual de Cocina',
    metaDescription: 'Politique de confidentialité de Manual de Cocina : quelles données nous traitons, sur quelle base légale, quels prestataires interviennent et quels droits tu as.',
    eyebrow: 'Confidentialité',
    title: 'Politique de confidentialité',
    intro: "Cette politique explique, en langage clair, quelles informations Manual de Cocina traite, dans quel but, pendant combien de temps et quels droits tu peux exercer. Dernière mise à jour : septembre 2026.",
    sections: [
      {
        heading: '1. Responsable du traitement',
        html: "<p>Le responsable de ce site est Néstor Bastidas, domicilié à Cali, Valle del Cauca, Colombie.</p><p>Contact : <a href='mailto:hola@manualdecocina.com'>hola@manualdecocina.com</a> · Téléphone : +57 302 815 0839.</p>",
      },
      {
        heading: '2. Quelles données nous traitons',
        html: "<p>Manual de Cocina est en libre lecture : aucune inscription ni aucun compte n'est nécessaire pour naviguer, chercher, lire des recettes ou les enregistrer en favoris.</p><p>Nous ne collectons aucune donnée personnelle du simple fait de ta visite sur le site. La seule donnée personnelle que nous traitons est celle que tu nous envoies volontairement par e-mail (ton adresse, ton nom si tu l'indiques, et le contenu de ton message), uniquement pour répondre à ta demande.</p>",
      },
      {
        heading: '3. Base légale',
        html: "<p>Lorsque tu nous écris, nous traitons tes données sur la base de ton consentement, exprimé en envoyant volontairement le message, et de notre intérêt légitime à pouvoir te répondre. Nous n'utilisons ces données pour aucune autre finalité et ne les cédons à aucun tiers.</p>",
      },
      {
        heading: '4. Stockage local dans ton navigateur',
        html: "<p>Deux fonctions du site enregistrent des informations uniquement sur ton propre appareil, via le stockage local du navigateur (localStorage), sans les envoyer à nos serveurs ni à personne d'autre :</p><ul><li><strong>Recettes favorites :</strong> enregistre les identifiants des recettes que tu marques, pour t'en souvenir sur ce navigateur.</li><li><strong>Préférence de thème (clair/sombre) :</strong> mémorise si tu préfères le mode clair ou le mode sombre.</li></ul><p>Tu peux effacer ces informations à tout moment depuis les paramètres de ton navigateur ; tu perdras alors tes favoris enregistrés sur cet appareil.</p>",
      },
      {
        heading: '5. Prestataires impliqués',
        html: "<p>Pour faire fonctionner le site, nous utilisons les prestataires suivants, qui agissent comme sous-traitants techniques et peuvent traiter des données sur des serveurs situés hors de Colombie :</p><ul><li><strong>Supabase</strong> (base de données et infrastructure hébergeant le contenu éditorial du site).</li><li><strong>Hostinger</strong> (hébergement et diffusion du site).</li><li><strong>Google AdSense</strong> (publicité ; voir la section suivante).</li></ul><p>Nous ne partageons avec ces prestataires que les informations strictement nécessaires au fonctionnement du site.</p>",
      },
      {
        heading: '6. Publicité avec Google AdSense',
        html: "<p>Manual de Cocina est monétisé exclusivement via Google AdSense ; nous n'utilisons et ne prévoyons d'utiliser aucun autre service publicitaire. Le domaine manualdecocina.com est déjà inscrit et approuvé sur Google AdSense (identifiant éditeur <code>pub-2592990699767586</code>).</p><p>Une fois les annonces actives, Google et ses partenaires publicitaires peuvent utiliser des cookies, des identifiants d'appareil et des technologies similaires pour diffuser des annonces, mesurer leur performance et, le cas échéant, les personnaliser selon ton activité. Nous n'avons pas nous-mêmes accès à ces données : elles sont traitées par Google en tant que responsable indépendant, conformément à sa propre <a href='https://policies.google.com/technologies/ads' target='_blank' rel='noopener noreferrer'>politique publicitaire</a>.</p><p>Tu peux gérer la personnalisation des annonces Google sur <a href='https://adssettings.google.com' target='_blank' rel='noopener noreferrer'>adssettings.google.com</a>, et consulter les entreprises participant aux enchères publicitaires dans les <a href='https://www.google.com/settings/ads/authenticated' target='_blank' rel='noopener noreferrer'>paramètres des annonces Google</a>. Avant de montrer des annonces aux visiteurs de l'UE, du Royaume-Uni ou de la Suisse, nous ajouterons au site un outil de gestion du consentement aux cookies te permettant de les accepter ou de les refuser.</p>",
      },
      {
        heading: "7. Pas d'analyse ni de suivi propre",
        html: "<p>Nous n'utilisons ni Google Analytics, ni pixels de réseaux sociaux, ni aucun service d'analyse ou de suivi comportemental qui nous soit propre. La seule mesure pouvant exister sur le site est celle réalisée par Google AdSense pour le fonctionnement de ses propres annonces, décrite ci-dessus.</p>",
      },
      {
        heading: '8. Tes droits',
        html: "<p>Concernant toute donnée personnelle que tu nous as envoyée par e-mail, tu peux à tout moment nous demander d'y accéder, de la rectifier, de la supprimer, de t'opposer à son traitement ou d'en demander la portabilité. Écris-nous à <a href='mailto:hola@manualdecocina.com'>hola@manualdecocina.com</a> et nous traiterons ta demande dans un délai raisonnable.</p><p>Si tu nous écris depuis l'Union européenne, tu as également le droit de déposer une réclamation auprès de l'autorité de protection des données de ton pays.</p>",
      },
      {
        heading: '9. Mineurs',
        html: "Le site ne s'adresse pas aux mineurs et nous ne demandons ni ne collectons sciemment de données les concernant. Si nous apprenons avoir reçu des données d'un mineur sans le consentement requis, nous les supprimerons.",
      },
      {
        heading: '10. Conservation des messages',
        html: "Nous conservons les e-mails que tu nous envoies uniquement le temps nécessaire pour traiter ta demande, plus un délai raisonnable à des fins d'historique, sauf si tu nous demandes de les supprimer plus tôt.",
      },
      {
        heading: '11. Modifications de cette politique',
        html: 'Nous pouvons mettre à jour cette politique lorsque nos outils ou le cadre légal applicable évoluent. La date de dernière mise à jour figure en haut de cette page.',
      },
    ],
  },
  it: {
    metaTitle: 'Informativa sulla privacy | Manual de Cocina',
    metaDescription: 'Informativa sulla privacy di Manual de Cocina: quali dati trattiamo, con quale base giuridica, quali fornitori intervengono e quali diritti hai.',
    eyebrow: 'Privacy',
    title: 'Informativa sulla privacy',
    intro: "Questa informativa spiega, con un linguaggio chiaro, quali informazioni tratta Manual de Cocina, per quale finalità, per quanto tempo e quali diritti puoi esercitare. Ultimo aggiornamento: settembre 2026.",
    sections: [
      {
        heading: '1. Titolare del trattamento',
        html: "<p>Il titolare di questo sito è Néstor Bastidas, con sede a Cali, Valle del Cauca, Colombia.</p><p>Contatto: <a href='mailto:hola@manualdecocina.com'>hola@manualdecocina.com</a> · Telefono: +57 302 815 0839.</p>",
      },
      {
        heading: '2. Quali dati trattiamo',
        html: "<p>Manual de Cocina è un sito a lettura libera: non serve registrarsi né creare un account per navigare, cercare, leggere ricette o salvarle tra i preferiti.</p><p>Non raccogliamo dati personali per il solo fatto di visitare il sito. L'unico dato personale che trattiamo è quello che ci invii volontariamente via email (il tuo indirizzo, il tuo nome se lo includi e il contenuto del messaggio), e solo per rispondere alla tua richiesta.</p>",
      },
      {
        heading: '3. Base giuridica',
        html: "<p>Quando ci scrivi, trattiamo i tuoi dati sulla base del tuo consenso, espresso inviandoci volontariamente il messaggio, e del nostro legittimo interesse a poterti rispondere. Non utilizziamo questi dati per nessun altro scopo e non li condividiamo con terzi.</p>",
      },
      {
        heading: '4. Archiviazione locale nel tuo browser',
        html: "<p>Due funzioni del sito salvano informazioni esclusivamente sul tuo dispositivo, tramite l'archiviazione locale del browser (localStorage), senza inviarle ai nostri server né a chiunque altro:</p><ul><li><strong>Ricette preferite:</strong> salva gli identificativi delle ricette che contrassegni, per ricordarle su quel browser.</li><li><strong>Preferenza del tema (chiaro/scuro):</strong> ricorda se preferisci la modalità chiara o scura.</li></ul><p>Puoi cancellare queste informazioni in qualsiasi momento dalle impostazioni del tuo browser; così facendo perderai i preferiti salvati su quel dispositivo.</p>",
      },
      {
        heading: '5. Fornitori coinvolti',
        html: "<p>Per far funzionare il sito utilizziamo i seguenti fornitori, che agiscono come responsabili tecnici del trattamento e possono trattare dati su server fuori dalla Colombia:</p><ul><li><strong>Supabase</strong> (database e infrastruttura che ospita i contenuti editoriali del sito).</li><li><strong>Hostinger</strong> (hosting ed erogazione del sito).</li><li><strong>Google AdSense</strong> (pubblicità; vedi la sezione seguente).</li></ul><p>Con questi fornitori condividiamo solo le informazioni strettamente necessarie al funzionamento del sito.</p>",
      },
      {
        heading: '6. Pubblicità con Google AdSense',
        html: "<p>Manual de Cocina si finanzia esclusivamente tramite Google AdSense; non utilizziamo né prevediamo di utilizzare alcun altro servizio pubblicitario. Il dominio manualdecocina.com è già registrato e approvato su Google AdSense (ID publisher <code>pub-2592990699767586</code>).</p><p>Quando gli annunci saranno attivi, Google e i suoi partner pubblicitari potranno utilizzare cookie, identificativi del dispositivo e tecnologie simili per mostrare annunci, misurarne le prestazioni e, se applicabile, personalizzarli in base alla tua attività. Noi non abbiamo accesso a questi dati: vengono trattati da Google in qualità di titolare autonomo, secondo la propria <a href='https://policies.google.com/technologies/ads' target='_blank' rel='noopener noreferrer'>informativa sulla pubblicità</a>.</p><p>Puoi gestire la personalizzazione degli annunci Google su <a href='https://adssettings.google.com' target='_blank' rel='noopener noreferrer'>adssettings.google.com</a> e consultare quali aziende partecipano alle aste pubblicitarie nelle <a href='https://www.google.com/settings/ads/authenticated' target='_blank' rel='noopener noreferrer'>impostazioni annunci di Google</a>. Prima di mostrare annunci a visitatori dell'UE, del Regno Unito o della Svizzera, aggiungeremo al sito uno strumento per gestire il consenso ai cookie, così potrai accettarli o rifiutarli.</p>",
      },
      {
        heading: '7. Nessuna analisi o tracciamento proprio',
        html: "<p>Non utilizziamo Google Analytics, pixel dei social network né alcun servizio proprio di analisi o tracciamento del comportamento. L'unica misurazione presente sul sito è quella effettuata da Google AdSense per il funzionamento dei propri annunci, descritta sopra.</p>",
      },
      {
        heading: '8. I tuoi diritti',
        html: "<p>Riguardo a qualsiasi dato personale che ci hai inviato via email, puoi chiederci in qualsiasi momento di: accedervi, rettificarlo, cancellarlo, opporti al suo trattamento o richiederne la portabilità. Scrivici a <a href='mailto:hola@manualdecocina.com'>hola@manualdecocina.com</a> e gestiremo la tua richiesta entro un termine ragionevole.</p><p>Se ci scrivi dall'Unione Europea, hai anche il diritto di presentare un reclamo all'autorità di protezione dei dati del tuo paese.</p>",
      },
      {
        heading: '9. Minori',
        html: 'Il sito non è rivolto ai minori e non richiediamo né raccogliamo consapevolmente dati relativi a minori. Se venissimo a conoscenza di aver ricevuto dati di un minore senza il consenso necessario, li elimineremmo.',
      },
      {
        heading: '10. Conservazione dei messaggi',
        html: 'Conserviamo le email che ci invii solo per il tempo necessario a gestire la tua richiesta, più un periodo ragionevole a fini di archivio, salvo tua richiesta di cancellazione anticipata.',
      },
      {
        heading: '11. Modifiche a questa informativa',
        html: "Possiamo aggiornare questa informativa quando cambiano i nostri strumenti o il quadro normativo applicabile. La data dell'ultimo aggiornamento è indicata in cima a questa pagina.",
      },
    ],
  },
  ja: {
    metaTitle: 'プライバシーポリシー | Manual de Cocina',
    metaDescription: 'Manual de Cocinaのプライバシーポリシー：取り扱うデータの内容、法的根拠、関与する事業者、そしてお客様の権利について。',
    eyebrow: 'プライバシー',
    title: 'プライバシーポリシー',
    intro: 'このポリシーでは、Manual de Cocinaがどのような情報を、どのような目的で、どのくらいの期間取り扱い、どのような権利を行使できるかをわかりやすく説明します。最終更新日：2026年9月。',
    sections: [
      {
        heading: '1. データ管理者',
        html: "<p>当サイトの管理責任者はNéstor Bastidasで、コロンビア・バジェ・デル・カウカ県カリを拠点としています。</p><p>連絡先：<a href='mailto:hola@manualdecocina.com'>hola@manualdecocina.com</a>・電話：+57 302 815 0839。</p>",
      },
      {
        heading: '2. 取り扱うデータ',
        html: '<p>Manual de Cocinaは自由に閲覧できるサイトです。閲覧、検索、レシピの閲覧やお気に入り保存に登録やアカウント作成は必要ありません。</p><p>サイトを訪問しただけで個人情報を収集することはありません。当サイトが取り扱う唯一の個人情報は、メールでお問い合わせいただいた際にご自身で任意にお送りいただく情報（メールアドレス、記載いただいた場合はお名前、メッセージ内容）であり、お問い合わせへの対応のみを目的として使用します。</p>',
      },
      {
        heading: '3. 法的根拠',
        html: '<p>お問い合わせをいただいた際は、メッセージを任意でお送りいただいたことによる同意、および対応するための当社の正当な利益に基づいてデータを取り扱います。これらのデータをほかの目的に使用したり、第三者に提供したりすることはありません。</p>',
      },
      {
        heading: '4. ブラウザ内のローカルストレージ',
        html: '<p>サイトの2つの機能は、情報をお使いの端末内にのみ、ブラウザのローカルストレージ（localStorage）を使って保存し、当社サーバーや第三者に送信することはありません。</p><ul><li><strong>お気に入りレシピ：</strong>マークしたレシピのIDを保存し、そのブラウザで記憶します。</li><li><strong>テーマ設定（ライト/ダーク）：</strong>ライトモードとダークモードのどちらを好むかを記憶します。</li></ul><p>この情報はブラウザの設定からいつでも削除できます。削除すると、その端末に保存したお気に入りは失われます。</p>',
      },
      {
        heading: '5. 関与する事業者',
        html: '<p>サイトの運営のために、以下の事業者を技術的な委託先として利用しており、コロンビア国外のサーバーでデータが処理される場合があります。</p><ul><li><strong>Supabase</strong>（サイトの編集コンテンツを保管するデータベースおよびインフラ）。</li><li><strong>Hostinger</strong>（サイトのホスティングおよび配信）。</li><li><strong>Google AdSense</strong>（広告。次のセクションを参照）。</li></ul><p>これらの事業者とは、サイトの運営に厳密に必要な情報のみを共有しています。</p>',
      },
      {
        heading: '6. Google AdSenseによる広告',
        html: "<p>Manual de CocinaはGoogle AdSenseのみで収益化しており、ほかの広告サービスは使用しておらず、導入の予定もありません。ドメインmanualdecocina.comはすでにGoogle AdSenseに登録・承認済みです（パブリッシャーID <code>pub-2592990699767586</code>）。</p><p>広告が有効になると、GoogleおよびそのパートナーはCookie、デバイス識別子、類似の技術を使用して広告を配信し、その効果を測定し、必要に応じてお客様の活動に基づいて広告をパーソナライズすることがあります。当社はこれらのデータにアクセスできません。これらはGoogleが独立した管理者として、独自の<a href='https://policies.google.com/technologies/ads' target='_blank' rel='noopener noreferrer'>広告ポリシー</a>に基づいて処理します。</p><p>Google広告のパーソナライズは<a href='https://adssettings.google.com' target='_blank' rel='noopener noreferrer'>adssettings.google.com</a>で管理でき、広告オークションに参加する企業は<a href='https://www.google.com/settings/ads/authenticated' target='_blank' rel='noopener noreferrer'>Google広告設定</a>で確認できます。EU、英国、スイスからの訪問者に広告を表示する前に、Cookieの同意を管理するツールをサイトに追加し、承諾または拒否できるようにします。</p>",
      },
      {
        heading: '7. 独自の解析・追跡は行いません',
        html: '<p>Google Analytics、SNSのピクセル、その他独自の解析・行動追跡サービスは一切使用していません。サイト上に存在しうる唯一の測定は、上記のGoogle AdSenseが自身の広告のために行うものです。</p>',
      },
      {
        heading: '8. お客様の権利',
        html: "<p>メールで送信いただいた個人情報について、いつでも次のことを request できます：アクセス、訂正、削除、取り扱いへの異議、データポータビリティ。<a href='mailto:hola@manualdecocina.com'>hola@manualdecocina.com</a> までご連絡いただければ、妥当な期間内に対応いたします。</p><p>EU域内からお問い合わせいただいた場合は、お住まいの国のデータ保護当局に苦情を申し立てる権利もあります。</p>",
      },
      {
        heading: '9. 未成年者について',
        html: '当サイトは未成年者を対象としておらず、未成年者のデータを意図的に要求・収集することはありません。必要な同意なく未成年者のデータを受け取ったことが判明した場合は、これを削除します。',
      },
      {
        heading: '10. メッセージの保存期間',
        html: 'お送りいただいたメールは、お問い合わせへの対応に必要な期間、およびその後のサポート記録として妥当な期間のみ保存します。早期の削除をご希望の場合はお申し付けください。',
      },
      {
        heading: '11. 本ポリシーの変更',
        html: '利用するツールや適用される法的枠組みが変わった場合、本ポリシーを更新することがあります。最終更新日はこのページの冒頭に記載しています。',
      },
    ],
  },
  pt: {
    metaTitle: 'Política de privacidade | Manual de Cocina',
    metaDescription: 'Política de privacidade do Manual de Cocina: quais dados tratamos, com que base legal, quais fornecedores estão envolvidos e quais direitos você tem.',
    eyebrow: 'Privacidade',
    title: 'Política de privacidade',
    intro: 'Esta política explica, em linguagem clara, quais informações o Manual de Cocina trata, para qual finalidade, por quanto tempo e quais direitos você pode exercer. Última atualização: setembro de 2026.',
    sections: [
      {
        heading: '1. Responsável pelo tratamento',
        html: "<p>O responsável por este site é Néstor Bastidas, com domicílio em Cali, Valle del Cauca, Colômbia.</p><p>Contato: <a href='mailto:hola@manualdecocina.com'>hola@manualdecocina.com</a> · Telefone: +57 302 815 0839.</p>",
      },
      {
        heading: '2. Quais dados tratamos',
        html: "<p>O Manual de Cocina é um site de leitura livre: não é preciso se cadastrar nem criar conta para navegar, buscar, ler receitas ou salvá-las como favoritas.</p><p>Não coletamos dados pessoais pelo simples fato de você visitar o site. O único dado pessoal que tratamos é o que você mesmo nos envia voluntariamente ao escrever por e-mail (seu endereço, seu nome, se incluído, e o conteúdo da mensagem), e apenas para responder à sua solicitação.</p>",
      },
      {
        heading: '3. Base legal',
        html: '<p>Quando você nos escreve, tratamos seus dados com base no seu consentimento, manifestado ao enviar voluntariamente a mensagem, e no nosso interesse legítimo em poder responder. Não usamos esses dados para nenhuma outra finalidade nem os compartilhamos com terceiros.</p>',
      },
      {
        heading: '4. Armazenamento local no seu navegador',
        html: '<p>Duas funções do site guardam informações apenas no seu próprio dispositivo, usando o armazenamento local do navegador (localStorage), sem enviá-las aos nossos servidores nem a mais ninguém:</p><ul><li><strong>Receitas favoritas:</strong> guarda os identificadores das receitas que você marca, para lembrá-las nesse navegador.</li><li><strong>Preferência de tema (claro/escuro):</strong> lembra se você prefere o modo claro ou escuro.</li></ul><p>Você pode apagar essas informações a qualquer momento nas configurações do seu navegador; ao fazer isso, perderá os favoritos salvos nesse dispositivo.</p>',
      },
      {
        heading: '5. Fornecedores envolvidos',
        html: '<p>Para operar o site, usamos os seguintes fornecedores, que atuam como operadores técnicos e podem tratar dados em servidores fora da Colômbia:</p><ul><li><strong>Supabase</strong> (banco de dados e infraestrutura onde vive o conteúdo editorial do site).</li><li><strong>Hostinger</strong> (hospedagem e entrega do site).</li><li><strong>Google AdSense</strong> (publicidade; veja a próxima seção).</li></ul><p>Compartilhamos com esses fornecedores apenas as informações estritamente necessárias para o funcionamento do site.</p>',
      },
      {
        heading: '6. Publicidade com o Google AdSense',
        html: "<p>O Manual de Cocina é monetizado exclusivamente com o Google AdSense; não usamos nem temos planos de usar nenhum outro serviço de publicidade. O domínio manualdecocina.com já está cadastrado e aprovado no Google AdSense (ID de publisher <code>pub-2592990699767586</code>).</p><p>Quando os anúncios estiverem ativos, o Google e seus parceiros de publicidade podem usar cookies, identificadores de dispositivo e tecnologias semelhantes para exibir anúncios, medir seu desempenho e, quando aplicável, personalizá-los com base na sua atividade. Nós não temos acesso a esses dados: eles são tratados pelo Google como responsável independente, conforme sua própria <a href='https://policies.google.com/technologies/ads' target='_blank' rel='noopener noreferrer'>política de publicidade</a>.</p><p>Você pode gerenciar a personalização de anúncios do Google em <a href='https://adssettings.google.com' target='_blank' rel='noopener noreferrer'>adssettings.google.com</a>, e consultar quais empresas participam dos leilões de anúncios nas <a href='https://www.google.com/settings/ads/authenticated' target='_blank' rel='noopener noreferrer'>Configurações de anúncios do Google</a>. Antes de exibir anúncios a visitantes da UE, do Reino Unido ou da Suíça, incluiremos no site uma ferramenta de consentimento de cookies para que você possa aceitá-los ou recusá-los.</p>",
      },
      {
        heading: '7. Sem análise ou rastreamento próprios',
        html: '<p>Não utilizamos Google Analytics, pixels de redes sociais nem nenhum serviço próprio de análise ou rastreamento de comportamento. A única medição que pode existir no site é a que o Google AdSense realiza para o funcionamento de seus próprios anúncios, descrita acima.</p>',
      },
      {
        heading: '8. Seus direitos',
        html: "<p>Sobre qualquer dado pessoal que você tenha nos enviado por e-mail, você pode nos solicitar a qualquer momento: acesso, retificação, exclusão, oposição ao tratamento ou portabilidade. Escreva para <a href='mailto:hola@manualdecocina.com'>hola@manualdecocina.com</a> e atenderemos sua solicitação em um prazo razoável.</p><p>Se você nos escrever a partir da União Europeia, também tem o direito de apresentar uma reclamação à autoridade de proteção de dados do seu país.</p>",
      },
      {
        heading: '9. Menores de idade',
        html: 'O site não é direcionado a menores de idade e não solicitamos nem coletamos intencionalmente dados de menores. Se identificarmos que recebemos dados de um menor sem o consentimento devido, iremos excluí-los.',
      },
      {
        heading: '10. Retenção das mensagens',
        html: 'Guardamos os e-mails que você nos envia apenas pelo tempo necessário para atender sua solicitação, mais um período razoável de histórico de suporte, salvo se você pedir a exclusão antes disso.',
      },
      {
        heading: '11. Alterações nesta política',
        html: 'Podemos atualizar esta política quando nossas ferramentas ou o marco legal aplicável mudarem. A data da última atualização aparece no início desta página.',
      },
    ],
  },
}
