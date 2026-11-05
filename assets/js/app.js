/* Kaïra Boutique : JavaScript natif, sans dépendance. Config et produits : products.js */
(() => {
'use strict';
document.documentElement.classList.add('js');
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => new Intl.NumberFormat('fr-FR').format(n).replace(/[\u202f\u00a0]/g, ' ') + ' FCFA';
const wa = t => `https://wa.me/${SITE.whatsapp}` + (t ? `?text=${encodeURIComponent(t)}` : '');
const find = id => PRODUCTS.find(p => p.id === id);
const norm = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/* ---------- Structure commune : en-tête, pied de page, WhatsApp ---------- */
function layout() {
  const page = location.pathname.split('/').pop() || 'index.html';
  const links = [['index.html', 'Accueil'], ['catalogue.html', 'Catalogue'], ['commande.html', 'Commande'], ['index.html#contact', 'Contact']];
  const head = $('#site-header'), foot = $('#site-footer');
  const brand = c => `<a class="brand ${c}" href="index.html" aria-label="Kaïra Boutique, accueil"><span class="brand-mark">K</span><span>Kaïra <em>Boutique</em></span></a>`;
  if (head) { head.insertAdjacentHTML('beforebegin', `<div class="announcement">Kaïra Boutique · Élégance, féminité et détails précieux</div>
    <header class="site-header">${brand('')}
    <button class="menu-toggle" aria-label="Ouvrir le menu" aria-expanded="false">☰</button>
    <nav class="main-nav" aria-label="Navigation principale">${links.map(([h, t]) => `<a href="${h}"${h === page ? ' class="active" aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
    <a class="header-cart" href="panier.html" aria-label="Voir le panier">Panier <span class="cart-count">0</span></a></header>`); head.remove(); }
  if (foot) { foot.insertAdjacentHTML('beforebegin', `<footer class="site-footer">${brand('brand-footer')}<p>La féminité dans chaque détail.</p>
    <div class="footer-links"><a href="catalogue.html">Catalogue</a><a href="panier.html">Panier</a><a href="commande.html">Commande</a><a href="index.html#contact">Contact</a></div>
    <small>WhatsApp : ${esc(SITE.whatsappAffiche)} · © ${new Date().getFullYear()} Kaïra Boutique</small></footer>`); foot.remove(); }
  document.body.insertAdjacentHTML('beforeend', `<a class="wa-float" data-wa href="${wa()}" target="_blank" rel="noopener" aria-label="Nous écrire sur WhatsApp"><svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M12 2C6.5 2 2 6.2 2 11.4c0 2.2.8 4.2 2.1 5.8L3 22l5-1.7c1.2.5 2.6.8 4 .8 5.5 0 10-4.200 10-9.700S17.500 2 12 2z"/></svg></a><div class="toast" role="status" aria-live="polite"></div>`);
  $$('[data-wa]').forEach(a => a.href = wa('Bonjour Kaïra Boutique, je souhaite avoir des informations.'));
  $$('[data-wa-text]').forEach(e => e.textContent = SITE.whatsappAffiche);
  const t = $('.menu-toggle'), n = $('.main-nav');
  const setMenu = o => { n.classList.toggle('open', o); t.setAttribute('aria-expanded', String(o)); t.textContent = o ? '×' : '☰'; };
  t.addEventListener('click', () => setMenu(!n.classList.contains('open')));
  n.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
}

/* ---------- Retours visuels ---------- */
let tt;
function toast(msg, lien) {
  const t = $('.toast'); if (!t) return;
  t.innerHTML = esc(msg) + (lien ? ` <a href="${lien[1]}">${lien[0]}</a>` : '');
  t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ---------- Panier (localStorage, avec repli mémoire) ---------- */
const KEY = 'kaira-cart'; let mem = [];
const Cart = {
  read() {
    let c; try { c = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { c = null; }
    if (!Array.isArray(c)) c = mem;
    return c.filter(i => i && find(i.id) && find(i.id).price != null && i.quantity > 0);
  },
  write(c) { mem = c; try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* navigation privée */ } Cart.badge(); },
  add(id) { const c = Cart.read(), l = c.find(i => i.id === id); l ? l.quantity++ : c.push({ id, quantity: 1 }); Cart.write(c); },
  set(id, q) { Cart.write(Cart.read().map(i => i.id === id ? { ...i, quantity: q } : i).filter(i => i.quantity > 0)); },
  lines() { return Cart.read().map(i => ({ p: find(i.id), q: i.quantity })); },
  count() { return Cart.read().reduce((s, i) => s + i.quantity, 0); },
  total() { return Cart.lines().reduce((s, l) => s + l.p.price * l.q, 0); },
  badge() { $$('.cart-count').forEach(e => { e.textContent = Cart.count(); e.classList.remove('bump'); void e.offsetWidth; e.classList.add('bump'); }); }
};

/* ---------- Cartes produits, catalogue, accueil ---------- */
function card(p) {
  const a = document.createElement('article'); a.className = 'product-card reveal';
  const prix = p.price != null;
  const msg = prix ? `Bonjour Kaïra Boutique, je souhaite commander : ${p.name} (${fmt(p.price)}).` : `Bonjour Kaïra Boutique, je souhaite connaître le prix du ${p.name}.`;
  const actions = !p.available ? '<button class="button button-dark" disabled>Indisponible</button>'
    : (prix ? `<button class="button button-dark" type="button" data-add="${esc(p.id)}">Ajouter au panier</button>` : '')
      + `<a class="button button-wa" target="_blank" rel="noopener" href="${wa(msg)}">${prix ? 'Commander sur WhatsApp' : 'Demander le prix sur WhatsApp'}</a>`;
  a.innerHTML = `<div class="product-image"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">${p.featured ? '<span class="product-tag">Coup de cœur</span>' : ''}</div>
    <div class="product-info"><div><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p></div><span class="price${prix ? '' : ' ask'}">${prix ? fmt(p.price) : 'Prix sur demande'}</span></div>
    <div class="card-actions">${actions}</div>`;
  return a;
}
function catalogue() {
  const grid = $('#catalog-products'); if (!grid) return;
  const s = $('#product-search'), c = $('#category-filter'), o = $('#sort-order'), note = $('#catalog-note');
  c.innerHTML = '<option value="all">Toutes les couleurs</option>' + [...new Set(PRODUCTS.map(p => p.category))].map(x => `<option>${esc(x)}</option>`).join('');
  const sorts = { featured: (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0), asc: (a, b) => (a.price ?? 1e12) - (b.price ?? 1e12), desc: (a, b) => (b.price ?? -1) - (a.price ?? -1), name: (a, b) => a.name.localeCompare(b.name, 'fr') };
  const render = () => {
    const t = norm(s.value.trim());
    const l = PRODUCTS.filter(p => (c.value === 'all' || p.category === c.value) && norm(p.name + ' ' + p.description + ' ' + p.category).includes(t)).sort(sorts[o.value]);
    grid.replaceChildren(...l.map(card));
    note.textContent = l.length ? `${l.length} article${l.length > 1 ? 's' : ''} affiché${l.length > 1 ? 's' : ''}.` : 'Aucun produit ne correspond à votre recherche.';
    reveal();
  };
  [s, c, o].forEach(e => e.addEventListener(e === s ? 'input' : 'change', render)); render();
}
function tailles() {
  const b = $('#size-body'); if (b) { b.innerHTML = SIZES.map(([t, m]) => `<tr><th scope="row">${esc(t)}</th><td>${esc(m)}</td></tr>`).join(''); $('#size-head').textContent = SIZE_LABEL; }
  const sel = $('#order-form [name=taille]'); if (sel) sel.innerHTML = '<option value="">Choisir ma taille</option>' + SIZES.map(([t, m]) => `<option value="${esc(t)}">${esc(t)} (${esc(m)} cm)</option>`).join('');
}
function accueil() {
  const g = $('#featured-products'); if (!g) return;
  const f = PRODUCTS.filter(p => p.featured); g.replaceChildren(...(f.length ? f : PRODUCTS).slice(0, 3).map(card));
  g.classList.toggle('single', g.children.length === 1);
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-add]'); if (!b) return;
  const p = find(b.dataset.add); if (!p) return;
  Cart.add(p.id); toast(`${p.name} ajouté au panier`, ['Voir le panier', 'panier.html']);
  b.textContent = 'Ajouté ✓'; b.classList.add('done'); setTimeout(() => { b.textContent = 'Ajouter au panier'; b.classList.remove('done'); }, 1400);
});
document.addEventListener('error', e => { if (e.target.tagName === 'IMG') e.target.classList.add('img-missing'); }, true);

/* ---------- Page panier ---------- */
const ICON_TRASH = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>';
function panier() {
  const root = $('#cart-root'); if (!root) return;
  const draw = () => {
    const L = Cart.lines();
    if (!L.length) { root.innerHTML = '<div class="empty"><p>Votre panier est vide.</p><a class="button button-dark" href="catalogue.html">Découvrir nos bayas</a></div>'; return; }
    root.innerHTML = `<div class="cart-grid"><div class="cart-list">${L.map(({ p, q }) => `<article class="cart-line"><img src="${esc(p.image)}" alt="${esc(p.name)}">
      <div class="cl-info"><h3>${esc(p.name)}</h3><p>${fmt(p.price)} l’unité</p>
      <div class="qty"><button type="button" data-q="-1" data-id="${esc(p.id)}" aria-label="Diminuer la quantité">−</button><span aria-live="polite">${q}</span><button type="button" data-q="1" data-id="${esc(p.id)}" aria-label="Augmenter la quantité">+</button></div></div>
      <div class="cl-side"><strong>${fmt(p.price * q)}</strong><button class="btn-del" type="button" data-del="${esc(p.id)}" aria-label="Supprimer ${esc(p.name)} du panier">${ICON_TRASH}<span>Supprimer</span></button></div></article>`).join('')}</div>
      <aside class="cart-summary"><h3>Récapitulatif</h3><div class="sum-row"><span>Total</span><strong>${fmt(Cart.total())}</strong></div>
      <p class="fine">Frais de livraison confirmés avec la boutique sur WhatsApp.</p>
      <a class="button button-dark" href="commande.html">Passer la commande</a><a class="button button-soft" href="catalogue.html">Continuer mes achats</a>
      <button class="btn-clear" type="button" id="clear">${ICON_TRASH}<span>Vider le panier</span></button></aside></div>`;
  };
  root.addEventListener('click', e => {
    const q = e.target.closest('[data-q]'), d = e.target.closest('[data-del]');
    if (q) { const l = Cart.read().find(i => i.id === q.dataset.id); Cart.set(q.dataset.id, (l ? l.quantity : 0) + +q.dataset.q); draw(); }
    else if (d) { Cart.set(d.dataset.del, 0); toast('Produit retiré du panier'); draw(); }
    else if (e.target.closest('#clear')) {
      const b = e.target.closest('#clear'), t = $('span', b);
      if (!b.classList.contains('confirm')) {   // 1er clic : on demande confirmation
        b.classList.add('confirm'); t.textContent = 'Oui, tout vider';
        setTimeout(() => { b.classList.remove('confirm'); t.textContent = 'Vider le panier'; }, 3000);
      } else { Cart.write([]); toast('Panier vidé'); draw(); }
    }
  });
  draw();
}

/* ---------- Page commande : message WhatsApp ---------- */
function commande() {
  const form = $('#order-form'); if (!form) return;
  const sum = $('#order-summary'), err = $('#form-error'), L = Cart.lines();
  if (!L.length) { $('#order-root').innerHTML = '<div class="empty"><p>Votre panier est vide : ajoutez un produit avant de commander.</p><a class="button button-dark" href="catalogue.html">Découvrir nos bayas</a></div>'; return; }
  sum.innerHTML = `<h3>Votre commande</h3>${L.map(({ p, q }) => `<div class="sum-row"><span>${esc(p.name)} × ${q}</span><span>${fmt(p.price * q)}</span></div>`).join('')}
    <div class="sum-row total"><span>Total</span><strong>${fmt(Cart.total())}</strong></div><a class="text-link" href="panier.html">Modifier le panier</a>`;
  form.addEventListener('submit', e => {
    e.preventDefault(); const f = Object.fromEntries(new FormData(form)); Object.keys(f).forEach(k => f[k] = f[k].trim());
    const chiffres = f.tel.replace(/\D/g, '');
    if (!f.taille) return err.textContent = 'Veuillez choisir votre taille (voir le guide des tailles).';
    if (!f.nom || !f.commune || !f.adresse) return err.textContent = 'Veuillez renseigner votre nom, votre commune et votre adresse de livraison.';
    if (chiffres.length < 8 || chiffres.length > 15) return err.textContent = 'Veuillez entrer un numéro de téléphone valide.';
    err.textContent = '';
    const lignes = Cart.lines().map(({ p, q }) => `- ${p.name} × ${q} = ${fmt(p.price * q)}`).join('\n');
    const msg = `Bonjour Kaïra Boutique, je souhaite passer commande.\n\nNom : ${f.nom}\nTaille : ${f.taille}\nTéléphone : ${f.tel}\nCommune : ${f.commune}\nAdresse : ${f.adresse}${f.note ? '\nIndication : ' + f.note : ''}\n\nProduits :\n${lignes}\n\nTotal : ${fmt(Cart.total())}`;
    if (!window.open(wa(msg), '_blank', 'noopener')) location.href = wa(msg);
    toast('WhatsApp est prêt : envoyez le message pour que la boutique confirme votre commande.');
  });
}

/* ---------- Vidéos publicitaires : galerie, une seule lecture à la fois, jamais d'écran noir ---------- */
function pubs() {
  const g = $('#ad-gallery'); if (!g || typeof VIDEOS === 'undefined') return;
  g.innerHTML = VIDEOS.map((v, i) => `<div class="video-box" style="background-image:url('${esc(v.poster)}')"><video data-ad autoplay muted loop playsinline preload="${i < 2 ? 'metadata' : 'none'}" poster="${esc(v.poster)}" aria-label="${esc(v.title)}"><source src="${esc(v.src)}" type="video/mp4"></video>
    <span class="video-title">${esc(v.title)}</span><button class="video-play" type="button">▶ Lire la publicité</button></div>`).join('');
  $$('.gal-btn').forEach(b => b.addEventListener('click', () => g.scrollBy({ left: +b.dataset.d * g.clientWidth * .8, behavior: 'smooth' })));
}
function videos() {
  const eco = navigator.connection && navigator.connection.saveData, regs = [];
  const tick = () => {   // démarre une vidéo visible, seulement si aucune autre ne joue
    if (regs.some(r => !r.v.paused)) return;
    const r = regs.find(x => x.visible && !x.user && x.v.dataset.state !== 'failed'); if (r) r.start();
  };
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => {
    es.forEach(x => { const r = regs.find(q => q.box === x.target); r.visible = x.isIntersecting; if (!r.visible) r.v.pause(); }); tick();
  }, { threshold: .6 }) : null;
  $$('video[data-ad]').forEach(v => {
    const box = v.closest('.video-box'), btn = $('.video-play', box), r = { v, box, visible: !io, user: false };
    v.muted = v.defaultMuted = true; v.loop = true; v.playsInline = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    const tap = on => box.classList.toggle('needs-tap', on);
    r.start = () => { if (eco) return tap(true); const p = v.play(); if (p && p.then) p.then(() => tap(false), () => tap(true)); };
    btn.addEventListener('click', () => { r.user = false; r.start(); });
    v.addEventListener('click', () => { if (v.paused) { r.user = false; r.start(); } else { r.user = true; v.pause(); tap(true); } });
    v.addEventListener('playing', () => tap(false));
    v.addEventListener('play', () => regs.forEach(o => { if (o.v !== v) o.v.pause(); }));
    const fail = () => { v.dataset.state = 'failed'; box.classList.add('video-failed'); box.classList.remove('needs-tap'); };
    const src = $('source', v); if (src) src.addEventListener('error', fail); v.addEventListener('error', fail);
    const verif = () => { if (v.error || (v.networkState === 3 && v.preload !== 'none')) fail(); };
    v.addEventListener('loadeddata', () => { delete v.dataset.state; box.classList.remove('video-failed'); });
    addEventListener('load', () => setTimeout(verif, 1500)); setTimeout(verif, 4000);
    regs.push(r); if (io) io.observe(box);
  });
  if (!io) tick();
  // Un premier geste de la cliente débloque la lecture si le navigateur l'avait bloquée
  ['pointerdown', 'touchstart', 'keydown'].forEach(t => document.addEventListener(t, () => { if (regs.some(r => r.box.classList.contains('needs-tap'))) tick(); }, { once: true, passive: true }));
  document.addEventListener('visibilitychange', () => { if (document.hidden) regs.forEach(r => r.v.pause()); else tick(); });
}

/* ---------- Défilement automatique de la galerie de publicités ----------
   Passe à la vidéo suivante quand la vidéo en cours a fini de jouer (3 à 8 s), puis revient au début.
   Se met en pause : au survol (ordinateur), au toucher / clic / clavier (reprend après 9 s), hors écran, onglet masqué.
   Désactivé si la personne a demandé moins d'animations ou le mode économie de données. */
function defilementAuto() {
  const g = $('#ad-gallery'), wrap = g && g.closest('.ad-wrap'); if (!g || !wrap) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || (navigator.connection && navigator.connection.saveData)) return;
  let timer, hover = false, hold = 0, visible = true;
  const cards = () => $$('.video-box', g), left = c => c.offsetLeft - g.offsetLeft;
  const current = () => { const c = cards(); let b = 0; c.forEach((x, i) => { if (Math.abs(left(x) - g.scrollLeft) < Math.abs(left(c[b]) - g.scrollLeft)) b = i; }); return b; };
  const blocked = () => hover || !visible || document.hidden || Date.now() < hold;
  const waitTime = () => {
    const v = $$('video[data-ad]', g).find(x => !x.paused && !x.ended);
    return v && isFinite(v.duration) && v.duration ? Math.min(Math.max((v.duration - v.currentTime) * 1000 + 300, 3000), 8000) : 4500;
  };
  const step = () => {
    if (g.scrollWidth <= g.clientWidth + 4) return;
    const c = cards(), i = current(), fin = g.scrollLeft + g.clientWidth >= g.scrollWidth - 4;
    if (fin || i >= c.length - 1) g.scrollTo({ left: 0, behavior: 'auto' });   // retour au début
    else { g.scrollTo({ left: left(c[i + 1]), behavior: 'smooth' });
      const nv = c[i + 2] && $('video', c[i + 2]); if (nv && nv.preload === 'none') nv.preload = 'metadata'; }   // prépare la suivante
  };
  const arm = () => { clearTimeout(timer); timer = setTimeout(go, waitTime()); };
  const go = () => { if (blocked()) return arm(); step(); timer = setTimeout(arm, 1500); };
  const pause = ms => { hold = Date.now() + ms; };
  ['pointerdown', 'touchstart', 'wheel', 'keydown', 'focusin'].forEach(t => wrap.addEventListener(t, () => pause(9000), { passive: true }));
  if (matchMedia('(hover:hover)').matches) {   // le survol n'existe pas au tactile
    wrap.addEventListener('mouseenter', () => { hover = true; });
    wrap.addEventListener('mouseleave', () => { hover = false; pause(1500); });
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(x => {
    visible = x.isIntersecting; if (visible) { clearTimeout(timer); timer = setTimeout(arm, 1200); }
  }), { threshold: .25 }).observe(wrap);
  arm();
}

/* ---------- Photo d'accueil : image de secours ---------- */
function hero() {
  const h = $('.hero'); if (!h) return;
  const i = new Image();
  i.onerror = () => { const u = 'url("assets/images/baya-lavande.jpg")'; h.style.setProperty('--hero-img', u); h.style.setProperty('--hero-img-m', u); };
  i.src = 'assets/images/baya-modele-dos.jpg';
}

/* ---------- Apparition au défilement ---------- */
let io;
function reveal() {
  const els = $$('.reveal:not(.in)');
  if (!('IntersectionObserver' in window)) return els.forEach(e => e.classList.add('in'));
  io = io || new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: .12 });
  els.forEach(e => io.observe(e));
}

document.addEventListener('DOMContentLoaded', () => {
  layout(); Cart.badge(); accueil(); catalogue(); tailles(); panier(); commande(); tailles(); hero(); pubs(); videos(); defilementAuto(); reveal();
  $$('.cart-count').forEach(e => e.classList.remove('bump'));
});
})();
