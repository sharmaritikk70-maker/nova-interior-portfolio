const steps = [...document.querySelectorAll(".step")];
let current = 0;
const data = {};
const nav = document.querySelector(".nav");
const progressBar = document.getElementById("progressBar");
const stepLabel = document.getElementById("stepLabel");
const summary = document.getElementById("summary");

const slides = [...document.querySelectorAll(".hero-slide")];
let activeSlide = 0;
setInterval(() => {
  if (!slides.length) return;
  slides[activeSlide].classList.remove("active");
  activeSlide = (activeSlide + 1) % slides.length;
  slides[activeSlide].classList.add("active");
}, 5200);

function showStep(index){
  steps.forEach((s,i)=>s.classList.toggle("active", i===index));
  current = index;
  const visibleStep = Math.min(index + 1, 9);
  stepLabel.textContent = `Step ${visibleStep} of 9`;
  progressBar.style.width = `${Math.min((visibleStep/9)*100,100)}%`;
  nav.style.display = (index === 0 || index === 9) ? "none" : "flex";
  if(index === 9) renderSummary();
}

function collectOptions(){
  document.querySelectorAll(".options").forEach(group=>{
    const name = group.dataset.name;
    const selected = [...group.querySelectorAll(".selected")].map(b=>b.textContent.trim());
    if(selected.length) data[name] = selected.join(", ");
  });
  const formData = new FormData(document.getElementById("leadForm"));
  for(const [k,v] of formData.entries()){
    if(typeof v === "string" && v.trim()) data[k] = v.trim();
  }
}

function renderSummary(){
  collectOptions();
  summary.innerHTML = Object.entries(data).map(([k,v])=>`<strong>${k}:</strong> ${v}`).join("<br>");
}

document.querySelectorAll(".options").forEach(group=>{
  const isSingle = group.classList.contains("single");
  group.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click",()=>{
      if(isSingle){
        group.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));
      }
      btn.classList.toggle("selected");
      setTimeout(()=>{ if(isSingle && current < 8) showStep(current+1); }, 160);
    });
  });
});

document.querySelectorAll(".next").forEach(btn=>{
  btn.addEventListener("click",()=>{ if(current < steps.length-1) showStep(current+1); });
});

document.querySelectorAll(".prev").forEach(btn=>{
  btn.addEventListener("click",()=>{ if(current > 0) showStep(current-1); });
});

document.getElementById("leadForm").addEventListener("submit",(e)=>{
  e.preventDefault();
  collectOptions();
  const messageLines = [
    "New NOVA Interior Project Inquiry",
    "",
    ...Object.entries(data).map(([k,v]) => `${k}: ${v}`),
    "",
    "Note: Floor plan/site photos/reference images can be shared in this WhatsApp chat."
  ];
  const message = encodeURIComponent(messageLines.join("\n"));
  window.open(`https://wa.me/917057047957?text=${message}`, "_blank");
  document.getElementById("leadForm").style.display = "none";
  document.querySelector(".progress-wrap").style.display = "none";
  document.getElementById("thankYou").classList.add("show");
});

showStep(0);


// Fullscreen "Click to View 3D" gallery
(function(){
  const images = window.NOVA_HERO_IMAGES || [];
  const modal = document.getElementById("viewerModal");
  const openBtn = document.getElementById("open3DGallery");
  const closeBtn = document.getElementById("viewerClose");
  const prevBtn = document.getElementById("viewerPrev");
  const nextBtn = document.getElementById("viewerNext");
  const img = document.getElementById("viewerImage");
  const count = document.getElementById("viewerCount");
  let index = 0;

  function updateViewer(){
    if(!images.length || !img) return;
    img.src = images[index];
    count.textContent = `${index + 1} / ${images.length}`;
  }

  function openViewer(){
    if(!modal || !images.length) return;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    updateViewer();
  }

  function closeViewer(){
    if(!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function next(){
    index = (index + 1) % images.length;
    updateViewer();
  }

  function prev(){
    index = (index - 1 + images.length) % images.length;
    updateViewer();
  }

  if(openBtn) openBtn.addEventListener("click", openViewer);
  if(closeBtn) closeBtn.addEventListener("click", closeViewer);
  if(nextBtn) nextBtn.addEventListener("click", next);
  if(prevBtn) prevBtn.addEventListener("click", prev);

  document.addEventListener("keydown", (e)=>{
    if(!modal || !modal.classList.contains("show")) return;
    if(e.key === "Escape") closeViewer();
    if(e.key === "ArrowRight") next();
    if(e.key === "ArrowLeft") prev();
  });

  if(modal){
    modal.addEventListener("click", (e)=>{
      if(e.target === modal) closeViewer();
    });
  }
})();
