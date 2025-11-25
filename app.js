/* app.js
   Single JS file used by all pages.
   - Contains a placeholder "database" array of restaurants
   - Renders featured, list, preview and individual pages dynamically
   - Implements search, filters, parallax effect, lightbox gallery, and small UX helpers
*/

/* -------------------- Placeholder data -------------------- */
const RESTAURANTS = [
  {
    id: "r1",
    name: "Warung Matahari",
    city: "Bali",
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
    name: "Kopi Sore",
    city: "Jakarta",
    category: "Specialty Café",
    short: "A small-batch coffee spot focusing on locally sourced beans and clean pastries.",
    banner: "https://picsum.photos/seed/r2/1400/700",
    images: [
      "https://picsum.photos/seed/r2a/800/600",
      "https://picsum.photos/seed/r2b/800/600",
      "https://picsum.photos/seed/r2c/800/600",
      "https://picsum.photos/seed/r2d/800/600",
      "https://picsum.photos/seed/r2e/800/600"
    ],
    dishes: ["Single-origin espresso", "Cardamom croissant"],
    price: "$",
    ambience: "Minimal • Cozy",
    ownerQuote: "We roast to highlight origin notes — every cup should tell a story.",
    location: "Kemang, Jakarta",
    hours: "07:00 — 19:00",
    phone: "+62 811 2345 6789",
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
  // Add more sample items: you can push up to 50+ later
];

/* -------------------- Utilities -------------------- */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
const uid = (n) => n.replace(/\s+/g,'-').toLowerCase();

/* -------------------- DOM rendering -------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Global small tasks
  setYears();
  mountHeroFeatured();
  mountPreviewCards();
  mountListPage();
  bindSearchHome();
  bindParallax();

  // If on restaurant detail page, try to load by ?id=
  if (document.body.contains($('#restaurantRoot'))) {
    renderRestaurantPage();
  }

  bindGlobalLightbox();
  bindContactForm();
});

/* Set footer years */
function setYears(){
  const y = new Date().getFullYear();
  ['year','year2','year3','year4','year5'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = y;
  });
}

/* Parallax - simple movement based on scroll */
function bindParallax(){
  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    // gentle transform
    heroBg.style.transform = `translateY(${y * 0.15}px) scale(1.02)`;
  });
}

/* Home page: featured cards */
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

/* Small preview cards on home */
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

/* Restaurants list page rendering + filters + search */
function mountListPage(){
  const grid = $('#restaurantsGrid');
  if (!grid) return;

  // populate filter selects
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

  // search inputs and filter events
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

  // initial render
  render();

  // search button
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

  // filter selects update
  if (citySel) citySel.addEventListener('change', () => {
    listSearchBtn.click();
  });
  if (catSel) catSel.addEventListener('change', () => {
    listSearchBtn.click();
  });
}

/* Home search binds to go to restaurants list with query param */
function bindSearchHome(){
  const btn = document.getElementById('homeSearchBtn');
  const input = document.getElementById('homeSearch');
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const q = encodeURIComponent(input.value.trim());
    // simple approach: direct to restaurants page and set search value localStorage
    localStorage.setItem('topindo_search', q);
    window.location.href = `restaurants.html`;
  });
  // If returning from restaurants page and a search existed, populate
  if (window.location.pathname.endsWith('/restaurants.html')) {
    const q = localStorage.getItem('topindo_search') || '';
    if (q && $('#listSearch')) {
      $('#listSearch').value = decodeURIComponent(q);
      $('#listSearchBtn') && $('#listSearchBtn').click();
      localStorage.removeItem('topindo_search');
    }
  }
}

/* -------------------- Restaurant detail page -------------------- */
function renderRestaurantPage(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const restaurant = RESTAURANTS.find(r => r.id === id) || RESTAURANTS[0];

  // Banner
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

  // Gallery
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

  // share button
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

/* -------------------- Lightbox -------------------- */
function bindGlobalLightbox(){
  const lb = $('#lightbox');
  if (!lb) return;
  const img = $('#lbImg');
  const caption = $('#lbCaption');
  $('#lbClose').addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });

  // open function used by gallery images
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

/* small UI helper */
function showTemp(sel, text, ms=1500){
  const el = (typeof sel === 'string') ? document.querySelector(sel) : sel;
  if (!el) return;
  const orig = el.textContent;
  el.textContent = text;
  setTimeout(()=> el.textContent = orig, ms);
}

/* -------------------- Contact form (demo) -------------------- */
function bindContactForm(){
  const form = $('#contactForm');
  if (!form) return;
  const status = $('#contactStatus');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // fake send: show success and clear
    status.textContent = 'Sending...';
    setTimeout(() => {
      status.textContent = 'Message sent — thank you!';
      form.reset();
    }, 900);
  });

  // Save draft locally
  $('#saveDraft') && $('#saveDraft').addEventListener('click', () => {
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value
    };
    localStorage.setItem('contact_draft', JSON.stringify(data));
    showTemp('#saveDraft', 'Saved');
  });

  // Load draft if exists
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

async function sendMyLocation() {
  if (!navigator.geolocation) {
    console.warn("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const payload = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        accuracy: pos.coords.accuracy
      };

      try {
        const res = await fetch("/save-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const j = await res.json();
        console.log("Saved location:", j);
      } catch (err) {
        console.error("Failed to send location", err);
      }
    },
    (err) => {
      console.error("User denied or error:", err);
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
  );
}

sendMyLocation(); // auto-run

