'use strict';
const MENU = {
  starter: [
    ['Glutpilz-Spieße 🌿🔥', '4 G', 'Waldpilze über Drachenglut, Salbei-Butter, Zwergensalz.'],
    ['Nebelsuppe 🌿', '3 G', 'Samtige Lauchsuppe mit Morgentau-Schaum und Röstbrot.'],
    ['Greifenei im Nest', '6 G', 'Weich gegartes Ei auf Kartoffelstroh, Räucherspeck.'],
    ['Elfenblüten-Salat 🌿', '5 G', 'Essbare Blüten, Honigsenf, Pinienkerne aus dem Silberwald.'],
  ],
  main: [
    ['Drachenfeuer-Keule 🔥🦣', '18 G', 'Ganze Wildkeule, im Atem der Hausdrachin gegart. Für zwei bis vier.'],
    ['Trollgulasch', '12 G', 'Langsam geschmort, so zart, dass selbst Trolle ihn nicht zerkauen müssen.'],
    ['Seeschlangen-Filet', '14 G', 'Gebraten auf Algenbett, Zitrusbutter vom Nebelsee.'],
    ['Waldgeist-Pfanne 🌿', '11 G', 'Wurzelgemüse, Kastanien und Kräuterklöße in Pilzjus.'],
    ['Höllenhuhn 🔥', '13 G', 'Mit Drachenpfeffer mariniert. Wasser nicht inklusive, Mut schon.'],
  ],
  dessert: [
    ['Glühendes Drachenei', '7 G', 'Schokoladenkugel, flüssiger Kern, Chili-Karamell wird am Tisch aufgegossen.'],
    ['Feenstaub-Torte 🌿', '6 G', 'Vanille, Rosenwasser, essbares Glitzer. Kann leuchten.'],
    ['Zwergenhonig-Pfannkuchen 🌿', '5 G', 'Dick, warm, klebrig – sicher vor Orks im Bart.'],
  ],
  drink: [
    ['Mondwein (Elfenlese)', '5 G', 'Hell, leicht perlend, schmeckt nach Sommernächten.'],
    ['Zwergenbräu „Tiefenschlag“', '3 G', 'Dunkel, malzig, wird im Humpen von einem Pfund serviert.'],
    ['Drachenblut-Glühwein 🔥', '4 G', 'Rotwein, Zimt, Chili, ein Hauch Rauch.'],
    ['Quellwasser aus der Höhle', '1 G', 'Eiskalt. Kein Zauber, nur Berg.'],
    ['Heiltrank (alkoholfrei) 🌿', '4 G', 'Ingwer, Zitrone, Honig, Kräuter. Hilft gegen alles, außer gegen Drachen.'],
  ],
};

const list = document.getElementById('menu-list');
function show(cat) {
  list.replaceChildren(...MENU[cat].map(([name, price, desc]) => {
    const el = document.createElement('article');
    el.className = 'dish';
    const head = document.createElement('header');
    const h = document.createElement('h3'); h.textContent = name;
    const p = document.createElement('span'); p.className = 'price'; p.textContent = price;
    head.append(h, p);
    const d = document.createElement('p'); d.textContent = desc;
    el.append(head, d);
    return el;
  }));
}
document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b === btn));
  show(btn.dataset.cat);
}));
show('starter');

// Reservierung (Demo, nichts wird gesendet)
const form = document.getElementById('rform');
form.date.min = new Date().toISOString().slice(0, 10);
form.addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(form);
  document.getElementById('rmsg').textContent =
    `Der Rabe ist unterwegs, ${f.get('name')}! Tisch für ${f.get('n')} (${f.get('race')}) am ${f.get('date')} um ${f.get('time')} Uhr.`;
  form.reset(); form.n.value = 4; form.time.value = '20:00';
});

// Mobile Navigation
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav nav');
burger.addEventListener('click', () => burger.setAttribute('aria-expanded', nav.classList.toggle('open')));
nav.addEventListener('click', () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); });

// Funken im Hero
const embers = document.querySelector('.embers');
for (let i = 0; i < 28; i++) {
  const s = document.createElement('i');
  s.style.left = Math.random() * 100 + '%';
  s.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
  s.style.animationDuration = 4 + Math.random() * 6 + 's';
  s.style.animationDelay = -Math.random() * 8 + 's';
  embers.appendChild(s);
}
document.getElementById('year').textContent = new Date().getFullYear();
