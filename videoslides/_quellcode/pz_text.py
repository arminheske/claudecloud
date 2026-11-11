import json
D=json.load(open('pk.json'))[:36]
Z='Zahlungsverzug';S='Zusammenfassung'
D+=[
(Z,'Was ist ein Zahlungsverzug?','Ein Zahlungsverzug liegt vor, wenn der Käufer eine Rechnung nicht rechtzeitig bezahlt. Entscheidend ist dabei der Fälligkeitstag, also der Tag, an dem spätestens bezahlt werden muss.'),
(Z,'Wer ist beteiligt?','Wann genau Zahlungsverzug eintritt, hängt davon ab, wer an dem Geschäft beteiligt ist:'),
(Z,'B2B','• Bei Geschäften zwischen zwei Unternehmen (B2B) muss das Geld am Fälligkeitstag bereits auf dem Konto des Verkäufers gutgeschrieben sein.'),
(Z,'B2C und C2C','• Bei Geschäften zwischen Unternehmen und Privatpersonen (B2C) oder zwischen zwei Privatpersonen (C2C) reicht es, wenn der Käufer den Betrag am Fälligkeitstag überweist.'),
(Z,'Zahlungsbedingung','Damit der Fälligkeitstag eindeutig ist, sollte die Zahlungsbedingung genau formuliert sein, zum Beispiel: „Zahlbar innerhalb von 30 Tagen ab Rechnungsdatum.“'),
(Z,'Was kann der Verkäufer tun?','Was kann der Verkäufer tun, wenn der Käufer nicht zahlt?'),
(Z,'Zuerst mahnen','Rein rechtlich könnte der Verkäufer den offenen Betrag sofort einklagen. Im Geschäftsalltag ist es aber üblich, zuerst zu mahnen. Ein möglicher Mahnplan sieht so aus:'),
(Z,'1. Mahnung','• 1 Woche nach Fälligkeit: 1. Mahnung, eine freundliche Zahlungserinnerung.'),
(Z,'2. Mahnung','• 2 Wochen später: 2. Mahnung mit einer neuen Frist. Verzugszinsen und Mahnspesen werden angedroht.'),
(Z,'3. Mahnung','• 1 Woche nach dieser Frist: 3. Mahnung per Einschreiben. Sie ist die letzte Frist, Verzugszinsen und Mahnspesen werden verrechnet und rechtliche Schritte angedroht.'),
(Z,'Inkasso, Anwalt, Gericht','• Zahlt der Käufer immer noch nicht, wird ein Inkassobüro, ein Rechtsanwalt oder das Gericht eingeschaltet.'),
(Z,'Verzugszinsen','Verzugszinsen dürfen ab dem Tag nach dem Fälligkeitstag verrechnet werden. Bei Privatpersonen (B2C und C2C) betragen sie 4 % pro Jahr. Bei Geschäften zwischen Unternehmen (B2B) sind sie deutlich höher: 9,2 Prozentpunkte über dem Basiszinssatz der Oesterreichischen Nationalbank.'),
(Z,'Mahnspesen und Umsatzsteuer','Dazu kann der Verkäufer bei B2B-Geschäften Mahnspesen verlangen, zum Beispiel eine Pauschale von 40 Euro. Übrigens: Auf Verzugszinsen und Mahnspesen wird keine Umsatzsteuer verrechnet.'),
(Z,'Formel für die Verzugszinsen','Die Verzugszinsen berechnet man so: Rechnungsbetrag mal Zinssatz mal Tage, geteilt durch 360.'),
(Z,'Gerichtliches Mahnverfahren','Und wenn auch das nichts hilft? Bei Forderungen bis 75.000 Euro gibt es das gerichtliche Mahnverfahren. Das Gericht schickt dem Käufer einen bedingten Zahlungsbefehl.'),
(Z,'Zahlen oder Einspruch','Er muss dann innerhalb von 14 Tagen zahlen oder innerhalb von 4 Wochen Einspruch erheben.'),
(Z,'Drei Ausgänge','Zahlt er, ist das Verfahren beendet. Erhebt er Einspruch, kommt es zu einem Zivilprozess. Tut er gar nichts, wird der Zahlungsbefehl rechtskräftig, und es kann gepfändet werden.'),
(Z,'Über 75.000 Euro','Bei Forderungen über 75.000 Euro kommt es sofort zum Zivilprozess.'),
(Z,'Beispiel: Fahrrad auf Rechnung','Sehen wir uns auch das an einem Beispiel an: Moritz kauft ein Fahrrad um 600 Euro auf Rechnung. Die Rechnung ist am 1. März fällig, aber Moritz vergisst zu zahlen.'),
(Z,'Erinnerung und Zinsen','Der Händler schickt ihm zuerst eine freundliche Zahlungserinnerung. Weil Moritz eine Privatperson ist, darf der Händler 4 % Verzugszinsen pro Jahr verlangen.'),
(Z,'Berechnung','Zahlt Moritz 30 Tage zu spät, sind das 600 mal 4 % mal 30, geteilt durch 360, also 2 Euro.'),
(Z,'Nicht reagieren','Das klingt nach wenig. Wer aber gar nicht reagiert, riskiert ein Gerichtsverfahren und am Ende sogar eine Pfändung.'),
(S,'Lieferverzug','„Fassen wir das Ganze noch einmal zusammen.“ Lieferverzug: Wenn die Ware zu spät kommt, kannst du eine Nachfrist setzen, zurücktreten oder Schadensersatz fordern.'),
(S,'Mängel','Mängel: Wenn die Ware defekt ist, hast du Anspruch auf Reparatur, Ersatz oder Erstattung.'),
(S,'Zahlungsverzug','Zahlungsverzug: Wenn du eine Rechnung zu spät zahlst, kann der Verkäufer mahnen, Verzugszinsen und bei Unternehmen auch Mahnspesen verlangen und im schlimmsten Fall vor Gericht gehen.'),
(S,'Abspann','Jetzt kennt ihr die Probleme, die beim Kauf auftreten können. Wenn ihr das nächste Betriebswirtschaft Video nicht verpassen wollt abonniert unseren Kanal.'),
]
json.dump(D,open('pz.json','w'),ensure_ascii=False);print(len(D))
