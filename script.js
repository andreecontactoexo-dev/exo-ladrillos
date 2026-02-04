// Header transparente arriba, semitransparente al hacer scroll
window.addEventListener('scroll',()=>{
  const header = document.querySelector('.site-header');
  if(window.scrollY > 10){
    header.classList.add('scrolled');
  }else{
    header.classList.remove('scrolled');
  }
});
const whatsappNumber = '934066600';
// Plantilla profesional de mensaje (usa {name} y {id})
const waTemplateBody = 'Estoy interesado en el producto {name} (ID:{id}). ¿Podrían confirmarme precio por unidad, disponibilidad y plazos de entrega? Muchas gracias.';

const products = [
  {
    id:1,
    cat:'estructural',
    name:'Ladrillo Rojo Tradicional',
    img:'https://cdn.discordapp.com/attachments/871577262271647795/1468496496503558144/image_1024.png?ex=69843b70&is=6982e9f0&hm=968d84f82163b1d411202745c008b32732f7a99b677800f95cb60bdd1e69b7fb&',
    desc:'Ladrillo de arcilla, ideal para muros y fachadas.',
    features:[
      'Dimensiones: 24x11x5 cm',
      'Alta resistencia',
      'Color rojo clásico',
      'Peso promedio: 2.5 kg',
      'Unidades por m²: 50',
      'Resistencia a la compresión: 65 kg/cm²'
    ],
    pdf:'assets/ladrillo-rojo.pdf'
  },
  {
    id:2,
    cat:'muros',
    name:'Ladrillo Perforado',
        img:'https://cdn.discordapp.com/attachments/871577262271647795/1468496496503558144/image_1024.png?ex=69843b70&is=6982e9f0&hm=968d84f82163b1d411202745c008b32732f7a99b677800f95cb60bdd1e69b7fb&',
    desc:'Ladrillo ligero con perforaciones para mejor aislación térmica.',
    features:[
      'Dimensiones: 24x11x5 cm',
      'Buena aislación',
      'Fácil colocación',
      'Peso promedio: 2.1 kg',
      'Unidades por m²: 48',
      'Resistencia a la compresión: 55 kg/cm²'
    ],
    pdf:'assets/ladrillo-perforado.pdf'
  },
  {
    id:3,
    cat:'acabados',
    name:'Ladrillo Cara Vista',
    img:'https://cdn.discordapp.com/attachments/871577262271647795/1468496496503558144/image_1024.png?ex=69843b70&is=6982e9f0&hm=968d84f82163b1d411202745c008b32732f7a99b677800f95cb60bdd1e69b7fb&',
    desc:'Ladrillo acabado estético para fachadas visibles.',
    features:[
      'Dimensiones: 24x11x5 cm',
      'Acabado liso',
      'Color duradero',
      'Peso promedio: 2.3 kg',
      'Unidades por m²: 52',
      'Resistencia a la compresión: 60 kg/cm²'
    ],
    pdf:'assets/ladrillo-cara-vista.pdf'
  }
];

const grid = document.getElementById('productGrid');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage').querySelector('img');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');
const modalFeatures = document.getElementById('modalFeatures');
const waBtn = document.getElementById('waBtn');
const customerInput = document.getElementById('customerName');
const closeBtn = document.getElementById('closeBtn');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const catButtons = document.querySelectorAll('.cat-btn');
const floatingWa = document.getElementById('floatingWa');
const productosPanel = document.getElementById('productosPanel');
const productosBtn = document.getElementById('productosBtn');
const sliderSlides = document.querySelectorAll('.hero-slide');
const prevBtn = document.querySelector('.slider-arrow.prev');
const nextBtn = document.querySelector('.slider-arrow.next');
const dotsWrap = document.querySelector('.slider-dots');
let currentSlide = 0;
let slideInterval = null;

// crear dots
function initSlider(){
  if(!sliderSlides || sliderSlides.length===0) return;
  dotsWrap.innerHTML = '';
  sliderSlides.forEach((s,i)=>{
    const b = document.createElement('button');
    b.className = i===0 ? 'active' : '';
    b.addEventListener('click', ()=>goToSlide(i));
    dotsWrap.appendChild(b);
  });
  showSlide(0);
  slideInterval = setInterval(()=>nextSlide(), 6000);
}

function showSlide(i){
  sliderSlides.forEach((s,idx)=>{
    s.style.opacity = idx===i ? '1' : '0';
    s.style.visibility = idx===i ? 'visible' : 'hidden';
    s.style.transition = 'opacity .6s ease';
  });
  const dots = dotsWrap.querySelectorAll('button');
  dots.forEach((d,idx)=> d.classList.toggle('active', idx===i));
  currentSlide = i;
}

function nextSlide(){ showSlide((currentSlide+1) % sliderSlides.length); }
function prevSlide(){ showSlide((currentSlide-1+sliderSlides.length) % sliderSlides.length); }
function goToSlide(i){ clearInterval(slideInterval); showSlide(i); slideInterval = setInterval(()=>nextSlide(),6000); }

if(prevBtn) prevBtn.addEventListener('click', ()=>{ prevSlide(); });
if(nextBtn) nextBtn.addEventListener('click', ()=>{ nextSlide(); });


function openModal(product){
  modalImage.src = product.img;
  modalImage.alt = product.name;
  modalTitle.textContent = product.name;
  modalDesc.textContent = product.desc;
  modalPrice.textContent = product.price;
  modalFeatures.innerHTML = '';
  product.features.forEach(f => { const li = document.createElement('li'); li.textContent = f; modalFeatures.appendChild(li); });
  // Rellenar campo de nombre con valor guardado
  if(customerInput) customerInput.value = localStorage.getItem('customerName') || '';

  function buildWaHref(cust){
    if(!whatsappNumber || whatsappNumber.trim()==='') return '#';
    const greeting = cust && cust.trim() ? `Hola, soy ${cust.trim()}. ` : 'Hola, ';
    const body = waTemplateBody.replace('{name}', product.name).replace('{id}', product.id);
    return `https://wa.me/${whatsappNumber.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(greeting + body)}`;
  }

  if(whatsappNumber && whatsappNumber.trim()!==''){
    waBtn.href = buildWaHref(customerInput ? customerInput.value : '');
  } else {
    waBtn.href = '#';
    waBtn.addEventListener('click', (e)=>{ e.preventDefault(); alert('Configure el número de WhatsApp en la variable whatsappNumber del script.'); }, {once:true});
  }

  // Actualizar enlace al modificar el nombre y guardar en localStorage
  if(customerInput){
    customerInput.addEventListener('input', ()=>{
      localStorage.setItem('customerName', customerInput.value);
      if(whatsappNumber && whatsappNumber.trim()!=='') waBtn.href = buildWaHref(customerInput.value);
    });
  }
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
}

function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });
document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeModal(); });

function showSection(id){
  pages.forEach(p=>{ p.style.display = (p.id===id)?'block':'none'; });
  navLinks.forEach(l=>{ l.classList.toggle('active', l.dataset.target===id); });
  // Mostrar/ocultar barra de categorías según la sección
  const categoriesEl = document.querySelector('.categories');
  if(categoriesEl){
    categoriesEl.style.display = (id === 'products') ? 'flex' : 'none';
  }
  // Mostrar u ocultar hero (está fuera de las `page`). Si no es 'home', ocultarlo.
  const heroEl = document.querySelector('.hero');
  if(heroEl){
    if(id === 'home'){
      heroEl.style.display = '';
      // reanudar video si existe
      const hv = document.getElementById('heroVideo'); if(hv && hv.paused) try{ hv.play(); }catch(e){}
    } else {
      heroEl.style.display = 'none';
      // pausar video si existe
      const hv = document.getElementById('heroVideo'); if(hv && !hv.paused) try{ hv.pause(); }catch(e){}
    }
  }
  // Header transparente solo en home, sólido en otras secciones
  const header = document.querySelector('.site-header');
  if(header){
    if(id === 'home'){
      header.classList.remove('header-solid');
    }else{
      header.classList.add('header-solid');
    }
  }
}

navLinks.forEach(link=>{
  link.addEventListener('click',(e)=>{
    e.preventDefault();
    const target = link.dataset.target;
    showSection(target);
    // small focus animation
    const el = document.getElementById(target);
    el && el.classList.add('reveal');
    setTimeout(()=>el && el.classList.remove('reveal'),450);
  });
});

// CTA en hero (y otros botones) que usan data-target
// CTA en hero (y otros botones) que usan data-target
document.querySelectorAll('.btn-primary[data-target]').forEach(b=>{
  b.addEventListener('click',(e)=>{
    e.preventDefault();
    const target = b.dataset.target;
    // Si el botón es el del hero y apunta a productos, activa la categoría 'all'
    if(target === 'products') {
      activateCategory('all');
    } else if(target) {
      showSection(target);
      const el = document.getElementById(target);
      el && el.classList.add('reveal');
      setTimeout(()=>el && el.classList.remove('reveal'),450);
    }
  });
});

// Render products
function renderProducts(){
  grid.innerHTML = '';
  // default: show all
  const currentFilter = grid.dataset.filter || 'all';
  products.filter(p => currentFilter==='all' ? true : p.cat===currentFilter).forEach(p=>{
    const ficha = document.createElement('section');
    ficha.className = 'product-ficha reveal';
    ficha.dataset.cat = p.cat;
        ficha.innerHTML = `
          <div class="ficha-img"><img src="${p.img}" alt="${p.name}"></div>
          <div class="ficha-body">
            <div class="ficha-cat">${p.cat ? p.cat.charAt(0).toUpperCase() + p.cat.slice(1) : ''}</div>
            <h2 class="ficha-title">${p.name}</h2>
            <p class="ficha-desc">${p.desc}</p>
            <ul class="ficha-features">
              ${p.features.map(f=>`<li>${f}</li>`).join('')}
            </ul>
            <div class="ficha-actions">
              <a class="btn-cotizar" href="#" onclick="event.preventDefault();openModal(products.find(x=>x.id==${p.id}))">Cotizar</a>
            </div>
            ${p.pdf ? `<div class="ficha-pdf"><a class="btn-pdf" href="${p.pdf}" target="_blank" rel="noopener"><span style="margin-right:8px">📄</span>Descargar ficha técnica</a></div>` : ''}
          </div>
        `;
    grid.appendChild(ficha);
  });
}

// Reveal on scroll
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('reveal'); });
},{threshold:0.12});

function observeCards(){
  document.querySelectorAll('.card').forEach(c=>observer.observe(c));
}

// init
renderProducts();
observeCards();
showSection('home');

// Categorías: filtrar productos
function activateCategory(cat){
  catButtons.forEach(b=> b.classList.toggle('active', b.dataset.cat===cat));
  document.querySelectorAll('.dd-cat').forEach(d=> d.classList.toggle('active', d.dataset.cat===cat));
  grid.dataset.filter = cat;
  renderProducts();
  observeCards();
  showSection('products');
}

catButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const cat = btn.dataset.cat || 'all';
    activateCategory(cat);
  });
});

// Dropdown category buttons (en menú Productos) delegan al mismo filtrado
document.querySelectorAll('.dd-cat').forEach(d => {
  d.addEventListener('click', ()=>{
    const cat = d.dataset.cat || 'all';
    activateCategory(cat);
    // cerrar panel en móvil
    if(productosPanel) productosPanel.style.display = 'none';
  });
});

// Cerrar dropdown si se hace click fuera
document.addEventListener('click', (e)=>{
  if(productosPanel && productosBtn){
    if(!productosPanel.contains(e.target) && !productosBtn.contains(e.target)){
      productosPanel.style.display = 'none';
    }
  }
});

// toggle panel on click (mobile)
if(productosBtn){
  productosBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    // Lleva directamente a la categoría 'Todos' en productos
    activateCategory('all');
    // Opcional: cerrar el panel si está abierto
    if(productosPanel) productosPanel.style.display='none';
  });
}

// Inicializar slider una vez cargado el DOM
window.addEventListener('load', ()=>{
  initSlider();
  // Si hay un video de fondo no inicializamos el hero slider
  if(!document.getElementById('heroVideo')){
    initHeroSlider();
  }
});

// Hero slides (imágenes y contenido sobre ladrillos)
const heroSlides = [
  {
    img: 'https://images.unsplash.com/photo-1605902711622-cfb43c44367e?auto=format&fit=crop&w=1600&q=60',
    title: 'Ladrillos estructurales de alta resistencia',
    desc: 'Ladrillos pensados para estructuras portantes, con control dimensional y resistencia garantizada.',
    bullets: ['Alta compresibilidad','Control dimensional','Certificación técnica']
  },
  {
    img: 'https://images.unsplash.com/photo-1542293787938-c9e299b8803d?auto=format&fit=crop&w=1600&q=60',
    title: 'Ladrillos para acabados y fachadas',
    desc: 'Acabados estéticos y colores duraderos que realzan cualquier fachada.',
    bullets: ['Variedad de tonos','Superficie lisa','Resistencia a intemperie']
  },
  {
    img: 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=1600&q=60',
    title: 'Soluciones para techos y tabiquería',
    desc: 'Bloques y piezas diseñadas para ligereza y buen aislamiento térmico.',
    bullets: ['Ligereza','Aislamiento térmico','Fácil colocación']
  }
];

const heroBg = document.getElementById('heroBg');
const heroTitle = document.getElementById('heroTitle');
const heroDesc = document.getElementById('heroDesc');
const heroList = document.getElementById('heroList');
const heroDots = document.getElementById('heroDots');
let heroIndex = 0;
let heroInterval = null;

function initHeroSlider(){
  if(!heroBg) return;
  heroBg.innerHTML = '';
  heroDots && (heroDots.innerHTML = '');
  heroSlides.forEach((s,i)=>{
    const div = document.createElement('div');
    div.className = 'slide' + (i===0 ? ' active' : '');
    div.style.backgroundImage = `url('${s.img}')`;
    heroBg.appendChild(div);
    if(heroDots){
      const b = document.createElement('button');
      b.className = i===0 ? 'active' : '';
      b.addEventListener('click', ()=> goToHero(i));
      heroDots.appendChild(b);
    }
  });
  updateHeroContent(0);
  heroInterval = setInterval(()=> nextHero(), 6000);
}

function updateHeroContent(i){
  const s = heroSlides[i];
  if(!s) return;
  heroTitle.textContent = s.title;
  heroDesc.textContent = s.desc;
  heroList.innerHTML = '';
  s.bullets.forEach(it=>{ const li = document.createElement('li'); li.textContent = it; heroList.appendChild(li); });
  // update dots
  if(heroDots){
    Array.from(heroDots.children).forEach((b,idx)=> b.classList.toggle('active', idx===i));
  }
}

function goToHero(i){
  clearInterval(heroInterval);
  showHero(i);
  heroInterval = setInterval(()=> nextHero(),6000);
}

function showHero(i){
  const slides = heroBg.querySelectorAll('.slide');
  slides.forEach((sl,idx)=> sl.classList.toggle('active', idx===i));
  heroIndex = i;
  updateHeroContent(i);
}

function nextHero(){ showHero((heroIndex+1) % heroSlides.length); }


// Floating WhatsApp: enlaza a chat general
function buildFloatingWa(){
  if(!floatingWa) return;
  const cust = localStorage.getItem('customerName') || '';
  const greeting = cust.trim() ? `Hola, soy ${cust.trim()}. ` : 'Hola, ';
  const body = 'Quisiera información general sobre sus productos y precios.';
  if(whatsappNumber && whatsappNumber.trim()!==''){
    floatingWa.href = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(greeting + body)}`;
  } else {
    floatingWa.href = '#';
    floatingWa.addEventListener('click',(e)=>{ e.preventDefault(); alert('Configure el número de WhatsApp en la variable whatsappNumber del script.'); },{once:true});
  }
}
buildFloatingWa();

// Cerrar caja informativa del hero
const heroInfo = document.getElementById('heroInfo');
if(heroInfo){
  const closeBtn = heroInfo.querySelector('.close-info');
  closeBtn && closeBtn.addEventListener('click', ()=> heroInfo.style.display='none');
}
