
const RESTAURANTS = [
  {
    id: "r1",
    name: "Raindear Coffee & Kitchen",
    city: "Kota Bogor",
    category: "Modern Indonesian",
    short: "A coastal bistro blending coastal flavors with slow-cooked classics.",
    banner: "https://picsum.photos/seed/r1/1400/700",
    images: [
      "https://picsum.photos/seed/r1a/800/600",
      "https://picsum.photos/seed/r1b/800/600",
      "https://picsum.photos/seed/r1c/800/600",
      "https://picsum.photos/seed/r1d/800/600",
      "https://picsum.photos/seed/r1e/800/600"
    ],
    dishes: ["Slow-braised Rendang", "Coconut Prawn Curry", "Charred Pisang"],
    price: "$$ - $$",
    ambience: "Beachfront • Sunset • Live music",
    ownerQuote: "We cook from our family recipes, but always invite new voices to the table.",
    location: "Seminyak, Bali — Jl. Sunset 12",
    hours: "11:00 — 23:00",
    phone: "+62 812 3456 7890",
    website: "#",
    featured: true
  },
  {
    id: "r2",
    name: "Karimata",
    city: "Kota Bogor",
    category: "Sea Food",
    short: "140+ delicious dishes",
banner: "https://picsum.photos/seed/r1/1400/700",
    images: [
      "https://picsum.photos/seed/r1a/800/600",
      "https://picsum.photos/seed/r1b/800/600",
      "https://picsum.photos/seed/r1c/800/600",
      "https://picsum.photos/seed/r1d/800/600",
      "https://picsum.photos/seed/r1e/800/600"
    ],    dishes: ["Sup Gurame Fillet", "Udang Bakar","Sup Udang","Teri Balado","Cumi Goreng","Lain Lain"],
    price: "Rp 50,000–1,00,000",
    ambience: "Minimal • Cozy",
    ownerQuote: "We roast to highlight origin notes — every cup should tell a story.",
    location: "Kota Bogor, Jakarta",
    hours: "11:00 — 21:00",
    phone: "+62 812-9509-9174",
    website: "#",
    featured: true
  },
  {
    id: "r3",
    name: "Dapur Lembah",
    city: "Bandung",
    category: "Fine Dining",
    short: "Contemporary tasting menu featuring Sundanese ingredients reimagined.",
    banner: "https://picsum.photos/seed/r3/1400/700",
    images: [
      "https://picsum.photos/seed/r3a/800/600",
      "https://picsum.photos/seed/r3b/800/600",
      "https://picsum.photos/seed/r3c/800/600",
      "https://picsum.photos/seed/r3d/800/600",
      "https://picsum.photos/seed/r3e/800/600",
      "https://picsum.photos/seed/r3f/800/600"
    ],
    dishes: ["Wild Herb Smoked Fish", "Volcanic Soil Chocolate"],
    price: "$$$",
    ambience: "Elegant • Intimate",
    ownerQuote: "We build menus like stories — each course has a memory.",
    location: "Dago, Bandung",
    hours: "17:00 — 23:00",
    phone: "+62 813 6543 2101",
    website: "#",
    featured: false
  }
];

/* -----------------------------------------------------------
   UTILITIES
----------------------------------------------------------- */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

/* -----------------------------------------------------------
   INIT
----------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  setYears();
  mountHeroFeatured();
  mountPreviewCards();
  mountListPage();
  bindSearchHome();
  bindParallax();

  if (document.body.contains($('#restaurantRoot'))) {
    renderRestaurantPage();
  }

  bindGlobalLightbox();
  bindContactForm();
});

/* -----------------------------------------------------------
   FOOTER YEAR
----------------------------------------------------------- */
function setYears(){
  const y = new Date().getFullYear();
  ['year','year2','year3','year4','year5'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = y;
  });
}

/* -----------------------------------------------------------
   PARALLAX
----------------------------------------------------------- */
function bindParallax(){
  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.15}px) scale(1.02)`;
  });
}

/* -----------------------------------------------------------
   HOME FEATURED LIST
----------------------------------------------------------- */
function mountHeroFeatured(){
  const list = $('#featuredList');
  if (!list) return;
  const featured = RESTAURANTS.filter(r => r.featured).slice(0,6);
  featured.forEach(r => {
    const card = document.createElement('div');
    card.className = 'featured__card';
    card.innerHTML = `
      <div style="background-image:url('${r.images[0]}');height:120px;border-radius:10px;background-size:cover;background-position:center"></div>
      <div style="margin-top:10px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong>${r.name}</strong>
          <small class="muted">${r.city}</small>
        </div>
        <div class="muted" style="font-size:13px">${r.category}</div>
        <div style="margin-top:8px">
          <a class="btn btn--ghost" href="restaurant.html?id=${r.id}">View</a>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

/* -----------------------------------------------------------
   HOME PREVIEW CARDS
----------------------------------------------------------- */
function mountPreviewCards(){
  const grid = $('#previewGrid');
  if (!grid) return;
  (RESTAURANTS.slice(0,6)).forEach(r => {
    const c = document.createElement('div');
    c.className = 'card restaurant-card';
    c.innerHTML = `
      <div class="thumb" style="background-image:url('${r.images[0]}')"></div>
      <div style="padding:6px 0">
        <div class="rc__meta">
          <div>
            <div class="rc__title">${r.name}</div>
            <div class="rc__cat">${r.category} • ${r.city}</div>
          </div>
          <div>
            <div class="influencer-badge" style="font-size:12px;padding:6px 8px">Mayur</div>
          </div>
        </div>
        <p class="muted" style="margin-top:8px">${r.short}</p>
        <div style="margin-top:8px;display:flex;gap:8px">
          <a class="btn btn--ghost" href="restaurant.html?id=${r.id}">Details</a>
        </div>
      </div>
    `;
    grid.appendChild(c);
  });
}

/* -----------------------------------------------------------
   RESTAURANT LIST PAGE
----------------------------------------------------------- */
function mountListPage(){
  const grid = $('#restaurantsGrid');
  if (!grid) return;

  const cities = Array.from(new Set(RESTAURANTS.map(r => r.city))).sort();
  const cat = Array.from(new Set(RESTAURANTS.map(r => r.category))).sort();

  const citySel = $('#filterCity');
  const catSel = $('#filterCategory');

  if (citySel){
    cities.forEach(c => citySel.appendChild(new Option(c,c)));
  }
  if (catSel){
    cat.forEach(c => catSel.appendChild(new Option(c,c)));
  }

  const listSearch = $('#listSearch');
  const listSearchBtn = $('#listSearchBtn');
  const resultCount = $('#resultCount');

  function render(filterFn = null){
    grid.innerHTML = '';
    const items = RESTAURANTS.filter(filterFn || (() => true));
    resultCount.textContent = items.length;
    items.forEach(r => {
      const card = document.createElement('article');
      card.className = 'card restaurant-card';
      card.innerHTML = `
        <div class="thumb" style="background-image:url('${r.images[0]}')"></div>
        <div>
          <div class="rc__meta">
            <div>
              <div class="rc__title">${r.name}</div>
              <div class="rc__cat">${r.category} • ${r.city}</div>
            </div>
            <div style="text-align:right">
              <div class="muted">${r.price}</div>
              <a class="btn btn--ghost" href="restaurant.html?id=${r.id}">Open</a>
            </div>
          </div>
          <p class="muted" style="margin-top:8px">${r.short}</p>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  render();

  if (listSearchBtn){
    listSearchBtn.addEventListener('click', () => {
      const q = (listSearch.value || '').toLowerCase().trim();
      const cityVal = citySel.value;
      const catVal = catSel.value;
      render(r => {
        const matchesQ = q === '' || (r.name + ' ' + r.city + ' ' + r.category + ' ' + r.dishes.join(' ')).toLowerCase().includes(q);
        const matchesCity = !cityVal || r.city === cityVal;
        const matchesCat = !catVal || r.category === catVal;
        return matchesQ && matchesCity && matchesCat;
      });
    });
  }

  if (citySel) citySel.addEventListener('change', () => {
    listSearchBtn.click();
  });
  if (catSel) catSel.addEventListener('change', () => {
    listSearchBtn.click();
  });
}

/* -----------------------------------------------------------
   HOME SEARCH
----------------------------------------------------------- */
function bindSearchHome(){
  const btn = document.getElementById('homeSearchBtn');
  const input = document.getElementById('homeSearch');
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const q = encodeURIComponent(input.value.trim());
    localStorage.setItem('topindo_search', q);
    window.location.href = `restaurants.html`;
  });

  if (window.location.pathname.endsWith('/restaurants.html')) {
    const q = localStorage.getItem('topindo_search') || '';
    if (q && $('#listSearch')) {
      $('#listSearch').value = decodeURIComponent(q);
      $('#listSearchBtn') && $('#listSearchBtn').click();
      localStorage.removeItem('topindo_search');
    }
  }
}

/* -----------------------------------------------------------
   RESTAURANT DETAIL PAGE
----------------------------------------------------------- */
function renderRestaurantPage(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const restaurant = RESTAURANTS.find(r => r.id === id) || RESTAURANTS[0];

  const banner = $('#restaurantBanner');
  banner.style.backgroundImage = `url('${restaurant.banner}')`;
  $('#rName').textContent = restaurant.name;
  $('#rCategory').textContent = `${restaurant.category} • ${restaurant.city}`;
  $('#rShort').textContent = restaurant.short;
  $('#rDishes').innerHTML = restaurant.dishes.map(d => `<li>${d}</li>`).join('');
  $('#rPrice').textContent = restaurant.price;
  $('#rAmbience').textContent = restaurant.ambience;
  $('#rQuote').textContent = restaurant.ownerQuote;
  $('#rOwner').textContent = `— Owner, ${restaurant.name}`;
  $('#rLocation').textContent = restaurant.location;
  $('#rHours').textContent = restaurant.hours;
  $('#rPhone').textContent = restaurant.phone;
  $('#rPhone').href = `tel:${restaurant.phone}`;
  $('#rWebsite').href = restaurant.website;

  const g = $('#rGallery');
  g.innerHTML = '';
  restaurant.images.slice(0,7).forEach((img, i) => {
    const el = document.createElement('img');
    el.src = img;
    el.alt = `${restaurant.name} photo ${i+1}`;
    el.dataset.index = i;
    el.addEventListener('click', () => openLightbox(img, `${restaurant.name} — photo ${i+1}`));
    g.appendChild(el);
  });

  $('#shareBtn').addEventListener('click', async () => {
    const link = `${location.origin}${location.pathname}?id=${restaurant.id}`;
    try {
      await navigator.clipboard.writeText(link);
      showTemp(`#shareBtn`, 'Link copied!');
    } catch (err) {
      alert('Copy link: ' + link);
    }
  });
}

/* -----------------------------------------------------------
   LIGHTBOX
----------------------------------------------------------- */
function bindGlobalLightbox(){
  const lb = $('#lightbox');
  if (!lb) return;
  const img = $('#lbImg');
  const caption = $('#lbCaption');
  $('#lbClose').addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });

  window.openLightbox = (src, cap='') => {
    openLightbox(src, cap);
  };
}

function openLightbox(src, captionText=''){
  const lb = $('#lightbox');
  $('#lbImg').src = src;
  $('#lbCaption').textContent = captionText;
  lb.classList.add('show');
  lb.setAttribute('aria-hidden','false');
}

function closeLightbox(){
  const lb = $('#lightbox');
  lb.classList.remove('show');
  lb.setAttribute('aria-hidden','true');
  $('#lbImg').src = '';
}

/* -----------------------------------------------------------
   TEMP TEXT UI HELPER
----------------------------------------------------------- */
function showTemp(sel, text, ms=1500){
  const el = (typeof sel === 'string') ? document.querySelector(sel) : sel;
  if (!el) return;
  const orig = el.textContent;
  el.textContent = text;
  setTimeout(()=> el.textContent = orig, ms);
}

/* -----------------------------------------------------------
   CONTACT FORM (DEMO)
----------------------------------------------------------- */
function bindContactForm(){
  const form = $('#contactForm');
  if (!form) return;
  const status = $('#contactStatus');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = 'Sending...';
    setTimeout(() => {
      status.textContent = 'Message sent — thank you!';
      form.reset();
    }, 900);
  });

  $('#saveDraft') && $('#saveDraft').addEventListener('click', () => {
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value
    };
    localStorage.setItem('contact_draft', JSON.stringify(data));
    showTemp('#saveDraft', 'Saved');
  });

  const draft = localStorage.getItem('contact_draft');
  if (draft) {
    try {
      const d = JSON.parse(draft);
      if (d.name) form.name.value = d.name;
      if (d.email) form.email.value = d.email;
      if (d.message) form.message.value = d.message;
    } catch(e){}
  }
}
