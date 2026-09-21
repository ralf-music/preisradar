(() => {
  const DATA = window.PREISSCAN_DATA;
  const SETTINGS_KEY = "preisscan.settings.v2";
  const EXTRA_KEY = "preisscan.trackedExtra.v1";

  const state = {
    settings: loadJSON(SETTINGS_KEY, {}),
    trackedExtra: loadJSON(EXTRA_KEY, []),
    currentView: "overview",
    familyQuery: ""
  };

  const els = {
    overview: document.getElementById("overviewView"),
    comparison: document.getElementById("comparisonView"),
    searchView: document.getElementById("searchView"),
    alerts: document.getElementById("alertsView"),
    search: document.getElementById("searchInput"),
    filter: document.getElementById("productFilter"),
    refresh: document.getElementById("refreshBtn"),
    install: document.getElementById("installBtn"),
    toast: document.getElementById("toast")
  };

  function loadJSON(key, fallback){
    try{
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    }catch{
      return fallback;
    }
  }

  function saveJSON(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalize(value){
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[-–—_/]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function catalogToProduct(item){
    return {
      ...item,
      defaultAlarm:null,
      marketStates:{},
      imageLabel:`${item.name} ${item.size}`
    };
  }

  function trackedProducts(){
    const base = [...DATA.products];
    state.trackedExtra.forEach(id => {
      if(base.some(p => p.id === id)) return;
      const item = DATA.catalog.find(x => x.id === id);
      if(item) base.push(catalogToProduct(item));
    });
    return base;
  }

  function isTracked(id){
    return DATA.products.some(p => p.id === id) || state.trackedExtra.includes(id);
  }

  function addTracked(id){
    if(isTracked(id)) return;
    state.trackedExtra.push(id);
    saveJSON(EXTRA_KEY, state.trackedExtra);
    rebuildFilter();
    renderAll();
    showToast("Produkt wird jetzt beobachtet.");
  }

  function removeTracked(id){
    if(DATA.products.some(p => p.id === id)) return;
    state.trackedExtra = state.trackedExtra.filter(x => x !== id);
    saveJSON(EXTRA_KEY, state.trackedExtra);
    rebuildFilter();
    renderAll();
    showToast("Produkt aus der Beobachtung entfernt.");
  }

  function getAlarm(product){
    if(Object.prototype.hasOwnProperty.call(state.settings, product.id)){
      return state.settings[product.id];
    }
    return product.defaultAlarm;
  }

  function setAlarm(productId, value){
    state.settings[productId] = value;
    saveJSON(SETTINGS_KEY, state.settings);
  }

  function marketById(id){
    return DATA.markets.find(m => m.id === id);
  }

  function statusFor(product, marketId){
    return product.marketStates?.[marketId] || {status:"unchecked", checked:null};
  }

  function eur(value){
    return Number(value).toLocaleString("de-DE", {style:"currency",currency:"EUR"});
  }

  function initials(name){
    return String(name)
      .replace(/[^A-Za-zÄÖÜäöüß0-9 ]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0,2)
      .map(x => x[0])
      .join("")
      .toUpperCase();
  }

  function productImage(product, className="product-photo"){
    const alt = escapeHtml(product.imageLabel || `${product.name} ${product.size}`);
    const fallback = escapeHtml((product.name || "Produkt").split(" ").slice(0,2).join(" "));
    if(!product.image){
      return `<div class="${className} image-fallback"><span>${fallback}</span><small>${escapeHtml(product.size)}</small></div>`;
    }
    return `
      <div class="${className}">
        <img src="${escapeAttr(product.image)}" alt="${alt}" loading="lazy" referrerpolicy="no-referrer"
          onerror="this.hidden=true;this.nextElementSibling.hidden=false">
        <div class="image-fallback" hidden><span>${fallback}</span><small>${escapeHtml(product.size)}</small></div>
      </div>`;
  }

  function marketLogo(market){
    const label = escapeHtml(initials(market.name));
    if(!market.logo){
      return `<div class="market-logo"><span>${label}</span></div>`;
    }
    return `
      <div class="market-logo">
        <img src="${escapeAttr(market.logo)}" alt="${escapeHtml(market.name)} Logo" loading="lazy" referrerpolicy="no-referrer"
          onerror="this.hidden=true;this.nextElementSibling.hidden=false">
        <span hidden>${label}</span>
      </div>`;
  }

  function priceRows(product){
    return DATA.markets.map(m => ({market:m, entry:statusFor(product,m.id)}));
  }

  function actualPrices(product){
    return priceRows(product).filter(x => x.entry.status === "price" && typeof x.entry.value === "number");
  }

  function bestPrice(product){
    return [...actualPrices(product)].sort((a,b)=>a.entry.value-b.entry.value)[0] || null;
  }

  function worstPrice(product){
    return [...actualPrices(product)].sort((a,b)=>b.entry.value-a.entry.value)[0] || null;
  }

  function unitPrice(product, price){
    if(!product.amount || !price) return null;
    if(product.unitType === "weight"){
      return price / (product.amount / 1000);
    }
    return price / product.amount;
  }

  function unitPriceLabel(product){
    return product.unitType === "weight" ? "€/kg" : "€/l";
  }

  function futureOffers(product){
    return DATA.futureOffers.filter(x => x.productId === product.id);
  }

  function filteredProducts(){
    const q = normalize(els.search.value);
    const f = els.filter.value;
    return trackedProducts().filter(p => {
      if(f !== "all" && p.id !== f) return false;
      if(!q) return true;
      const marketText = DATA.markets.flatMap(m => [m.name,m.branch,m.area]).filter(Boolean).join(" ");
      return normalize(`${p.name} ${p.size} ${p.packageType || ""} ${marketText}`).includes(q);
    });
  }

  function alarmState(product){
    const alarm = getAlarm(product);
    if(alarm == null || alarm === "") return {type:"off", text:"Preiswecker aus"};
    const best = bestPrice(product);
    if(best && best.entry.value <= Number(alarm)) return {type:"hit", text:"Zielpreis aktuell erreicht"};
    const upcoming = futureOffers(product).filter(x => x.price <= Number(alarm)).sort((a,b)=>a.price-b.price)[0];
    if(upcoming) return {type:"future", text:"Zielpreis demnächst erreicht"};
    return {type:"wait", text:"Zielpreis noch nicht erreicht"};
  }

  function stateCounts(product){
    const rows = priceRows(product);
    return {
      price: rows.filter(x=>x.entry.status==="price").length,
      na: rows.filter(x=>x.entry.status==="na").length,
      unchecked: rows.filter(x=>x.entry.status==="unchecked").length,
      unknown: rows.filter(x=>x.entry.status==="unknown").length
    };
  }

  function latestCheck(product){
    const checks = priceRows(product).map(x=>x.entry.checked).filter(Boolean).map(v=>new Date(v));
    if(!checks.length) return null;
    return new Date(Math.max(...checks.map(d=>d.getTime())));
  }

  function formatCheck(value){
    if(!value) return "Noch nicht geprüft";
    const d = value instanceof Date ? value : new Date(value);
    if(Number.isNaN(d.getTime())) return "Noch nicht geprüft";
    return new Intl.DateTimeFormat("de-DE", {dateStyle:"short",timeStyle:"short"}).format(d);
  }

  function renderOverview(){
    const products = filteredProducts();
    els.overview.innerHTML = products.length ? `
      <div class="product-grid">
        ${products.map(product=>{
          const best = bestPrice(product);
          const worst = worstPrice(product);
          const counts = stateCounts(product);
          const alarm = alarmState(product);
          const latest = latestCheck(product);
          const upcoming = futureOffers(product);
          const removable = !DATA.products.some(p=>p.id===product.id);

          return `
            <article class="product-card">
              <div class="product-head">
                ${productImage(product)}
                <div class="product-copy">
                  <h3 class="product-title">${escapeHtml(product.name)}</h3>
                  <div class="product-sub">${escapeHtml(product.size)} · ${escapeHtml(product.packageType || "")}</div>
                  ${removable ? `<button class="text-action danger" data-untrack="${escapeAttr(product.id)}">Nicht mehr beobachten</button>` : ``}
                </div>
                <div class="best-block">
                  <span>günstigster Preis</span>
                  <strong>${best ? eur(best.entry.value) : "—"}</strong>
                  <span>${best ? escapeHtml(best.market.name) : "noch keine Live-Daten"}</span>
                </div>
              </div>

              <div class="card-body">
                <div class="metric-grid">
                  <div class="metric"><b>Preise vorhanden</b><strong>${counts.price} / ${DATA.markets.length}</strong></div>
                  <div class="metric"><b>Nicht im Sortiment</b><strong>${counts.na}</strong></div>
                  <div class="metric"><b>Letzte Prüfung</b><strong>${latest ? formatCheck(latest) : "Noch nicht geprüft"}</strong></div>
                </div>

                <div class="alarm-line">
                  <div class="alarm-controls">
                    <strong>Preiswecker</strong><span>≤</span>
                    <input class="price-input" data-alarm="${escapeAttr(product.id)}" type="number" min="0" step="0.01" value="${getAlarm(product) ?? ""}" placeholder="z. B. 1,00">
                    <span>€</span>
                  </div>
                  <span class="state-pill ${alarm.type === "hit" ? "hit" : alarm.type === "future" ? "future" : ""}">${alarm.text}</span>
                </div>

                <div class="metric-grid spaced">
                  <div class="metric"><b>Teuerster Preis</b><strong>${worst ? eur(worst.entry.value) : "—"}</strong><small>${worst ? escapeHtml(worst.market.name) : "keine Daten"}</small></div>
                  <div class="metric"><b>Unklar</b><strong>${counts.unknown}</strong><small>Preis nicht ermittelbar</small></div>
                  <div class="metric"><b>Noch offen</b><strong>${counts.unchecked}</strong><small>noch nicht geprüft</small></div>
                </div>

                <div class="future-box">
                  <h4>Kommende Angebote</h4>
                  ${upcoming.length
                    ? upcoming.map(x=>`<div>${escapeHtml(marketById(x.marketId)?.name || x.marketId)}: <strong>${eur(x.price)}</strong> · ${escapeHtml(x.validFrom)}</div>`).join("")
                    : `<div class="future-empty">Noch keine Zukunftsangebote hinterlegt.</div>`}
                </div>
              </div>
            </article>`;
        }).join("")}
      </div>` : emptyState("Keine beobachteten Produkte passen zur Suche.");

    bindAlarmInputs();
    bindUntrackButtons();
  }

  function renderComparison(){
    const products = filteredProducts();
    els.comparison.innerHTML = products.length ? products.map(product=>{
      const best = bestPrice(product);
      const worst = worstPrice(product);
      return `
        <section class="compare-card">
          <div class="compare-head compare-product-head">
            <div class="compare-product-ident">
              ${productImage(product,"product-photo compact")}
              <div><strong>${escapeHtml(product.name)} ${escapeHtml(product.size)}</strong><small>${escapeHtml(product.packageType || "")} · alle getrackten Märkte</small></div>
            </div>
            <div><small>Günstigster aktuell</small><br><strong class="best-text">${best ? eur(best.entry.value) : "—"}</strong></div>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Händler / Filiale</th><th>Preis</th><th>Status</th><th>${unitPriceLabel(product)}</th><th>Geprüft</th><th>Kommendes Angebot</th></tr></thead>
              <tbody>
                ${DATA.markets.map(market=>{
                  const entry = statusFor(product,market.id);
                  const future = futureOffers(product).find(x=>x.marketId===market.id);
                  let price="—", priceClass="price", unit="—", statusLabel="Noch nicht geprüft", statusClass="unchecked";
                  if(entry.status === "price"){
                    price = eur(entry.value);
                    unit = eur(unitPrice(product,entry.value));
                    statusLabel = "Preis vorhanden";
                    statusClass = "price";
                    if(best && entry.value === best.entry.value) priceClass += " best";
                    if(worst && entry.value === worst.entry.value) priceClass += " worst";
                  }else if(entry.status === "na"){
                    statusLabel = "Nicht im Sortiment";
                    statusClass = "na";
                  }else if(entry.status === "unknown"){
                    statusLabel = "Preis nicht ermittelbar";
                    statusClass = "unknown";
                  }
                  return `
                    <tr>
                      <td>
                        <div class="market-cell">
                          ${marketLogo(market)}
                          <div class="market-copy"><strong>${escapeHtml(market.name)}</strong>${market.branch ? `<small>${escapeHtml(market.branch)}</small>` : `<small>${escapeHtml(market.area)}</small>`}</div>
                        </div>
                      </td>
                      <td><span class="${priceClass}">${price}</span></td>
                      <td><span class="status-tag ${statusClass}">${statusLabel}</span></td>
                      <td>${unit}</td>
                      <td>${formatCheck(entry.checked)}</td>
                      <td>${future ? `<strong>${eur(future.price)}</strong><br><small>${escapeHtml(future.validFrom)}</small>` : "—"}</td>
                    </tr>`;
                }).join("")}
              </tbody>
            </table>
          </div>
        </section>`;
    }).join("") : emptyState("Keine Produkte für den Preisvergleich gefunden.");
  }

  function catalogMatches(query){
    const q = normalize(query);
    if(!q) return [];
    const tokens = q.split(" ").filter(Boolean);
    return DATA.catalog.filter(item=>{
      const haystack = normalize([item.name,item.size,item.packageType,...(item.searchTerms || [])].join(" "));
      return tokens.every(token => haystack.includes(token));
    }).sort((a,b)=>{
      if(a.family !== b.family) return a.family.localeCompare(b.family,"de");
      return Number(a.amount || 0) - Number(b.amount || 0);
    });
  }

  function renderSearch(){
    const matches = catalogMatches(state.familyQuery);
    const examples = `<button class="example-chip" data-example="Coca-Cola Zero">Coca-Cola Zero</button><button class="example-chip" data-example="gemischtes Hackfleisch">gemischtes Hackfleisch</button>`;

    els.searchView.innerHTML = `
      <section class="search-panel">
        <div class="search-panel-copy">
          <span class="section-kicker">Freie Produktsuche</span>
          <h3>Produktfamilie statt exakter Artikelbezeichnung</h3>
          <p>Die Suche zeigt ähnliche Varianten mit getrennten Größen und Verpackungsarten. Später kommen die Treffer aus den Händlerdaten; aktuell demonstriert der lokale Katalog die Logik.</p>
        </div>
        <div class="family-search-row">
          <input id="familySearchInput" type="search" value="${escapeAttr(state.familyQuery)}" placeholder="z. B. Coca-Cola Zero oder gemischtes Hackfleisch">
          <button id="familySearchBtn" class="primary-btn">Suchen</button>
        </div>
        <div class="example-row"><span>Beispiele:</span>${examples}</div>
      </section>

      <div id="familyResults">
        ${state.familyQuery
          ? matches.length ? renderCatalogResults(matches) : emptyState("Keine passende Produktfamilie im lokalen Testkatalog gefunden.")
          : `<div class="search-hint">Suchbegriff eingeben. Die Größen werden anschließend als einzelne trackbare Varianten angezeigt.</div>`}
      </div>`;

    const input = document.getElementById("familySearchInput");
    const trigger = () => {
      state.familyQuery = input.value.trim();
      renderSearch();
    };
    document.getElementById("familySearchBtn")?.addEventListener("click", trigger);
    input?.addEventListener("keydown", e=>{ if(e.key === "Enter") trigger(); });
    document.querySelectorAll("[data-example]").forEach(btn=>btn.addEventListener("click",()=>{
      state.familyQuery = btn.dataset.example;
      renderSearch();
    }));
    document.querySelectorAll("[data-track]").forEach(btn=>btn.addEventListener("click",()=>addTracked(btn.dataset.track)));
    document.querySelectorAll("[data-search-untrack]").forEach(btn=>btn.addEventListener("click",()=>removeTracked(btn.dataset.searchUntrack)));
  }

  function renderCatalogResults(items){
    const groups = new Map();
    items.forEach(item=>{
      if(!groups.has(item.family)) groups.set(item.family, []);
      groups.get(item.family).push(item);
    });

    return [...groups.entries()].map(([,group])=>`
      <section class="catalog-group">
        <div class="catalog-group-head">
          <div><span class="section-kicker">${escapeHtml(group[0].name)}</span><h3>${group.length} Varianten gefunden</h3></div>
          <div class="catalog-note">Grundpreis wird bei vorhandenen Preisen automatisch in ${group[0].unitType === "weight" ? "€/kg" : "€/l"} berechnet.</div>
        </div>
        <div class="variant-grid">
          ${group.map(item=>{
            const tracked = isTracked(item.id);
            return `
              <article class="variant-card ${tracked ? "tracked" : ""}">
                ${productImage(item,"variant-image")}
                <div class="variant-copy">
                  <h4>${escapeHtml(item.size)}</h4>
                  <p>${escapeHtml(item.packageType || "Packung")}</p>
                  <span class="variant-unit">Vergleich: ${item.unitType === "weight" ? "€/kg" : "€/l"}</span>
                </div>
                ${tracked
                  ? `<button class="variant-btn tracked-btn" ${DATA.products.some(p=>p.id===item.id) ? "disabled" : `data-search-untrack="${escapeAttr(item.id)}"`}>${DATA.products.some(p=>p.id===item.id) ? "Wird beobachtet" : "Beobachtung entfernen"}</button>`
                  : `<button class="variant-btn" data-track="${escapeAttr(item.id)}">Produkt beobachten</button>`}
              </article>`;
          }).join("")}
        </div>
      </section>`).join("");
  }

  function renderAlerts(){
    const products = filteredProducts();
    els.alerts.innerHTML = products.length ? `
      <div class="alert-list">
        ${products.map(product=>{
          const alarm = getAlarm(product);
          const status = alarmState(product);
          return `
            <article class="alert-card">
              <div class="alert-ident">${productImage(product,"product-photo tiny")}<div><h3>${escapeHtml(product.name)} ${escapeHtml(product.size)}</h3><p>${alarm == null || alarm === "" ? "Kein Preiswecker gesetzt." : `Benachrichtigung bei ${eur(alarm)} oder darunter.`}</p></div></div>
              <div><span class="state-pill ${status.type === "hit" ? "hit" : status.type === "future" ? "future" : ""}">${status.text}</span></div>
            </article>`;
        }).join("")}
      </div>` : emptyState("Keine Preiswecker-Produkte gefunden.");
  }

  function bindAlarmInputs(){
    document.querySelectorAll("[data-alarm]").forEach(input=>{
      input.addEventListener("change",()=>{
        const raw = input.value.trim();
        setAlarm(input.dataset.alarm, raw === "" ? null : Number(raw));
        renderAll();
        showToast("Preiswecker lokal gespeichert.");
      });
    });
  }

  function bindUntrackButtons(){
    document.querySelectorAll("[data-untrack]").forEach(btn=>btn.addEventListener("click",()=>removeTracked(btn.dataset.untrack)));
  }

  function renderStats(){
    const products = trackedProducts();
    document.getElementById("productCount").textContent = products.length;
    document.getElementById("marketCount").textContent = DATA.markets.length;
    document.getElementById("knownPriceCount").textContent = products.reduce((sum,p)=>sum+actualPrices(p).length,0);
  }

  function rebuildFilter(){
    const current = els.filter.value || "all";
    els.filter.innerHTML = `<option value="all">Alle beobachteten Produkte</option>`;
    trackedProducts().forEach(p=>{
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = `${p.name} ${p.size}`;
      els.filter.appendChild(option);
    });
    els.filter.value = [...els.filter.options].some(o=>o.value===current) ? current : "all";
  }

  function renderAll(){
    renderOverview();
    renderComparison();
    renderSearch();
    renderAlerts();
    renderStats();
  }

  function emptyState(text){
    return `<div class="empty-state"><strong>Nichts anzuzeigen</strong><span>${escapeHtml(text)}</span></div>`;
  }

  function showToast(message){
    els.toast.textContent = message;
    els.toast.classList.add("show");
    clearTimeout(window.__preisscanToast);
    window.__preisscanToast = setTimeout(()=>els.toast.classList.remove("show"),3500);
  }

  function escapeHtml(value){
    return String(value ?? "").replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]));
  }

  function escapeAttr(value){
    return escapeHtml(value);
  }

  document.querySelectorAll(".tab").forEach(tab=>{
    tab.addEventListener("click",()=>{
      document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
      document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));
      tab.classList.add("active");
      state.currentView = tab.dataset.view;
      const viewMap = {overview:els.overview, comparison:els.comparison, search:els.searchView, alerts:els.alerts};
      viewMap[state.currentView].classList.add("active");
    });
  });

  els.search.addEventListener("input", renderAll);
  els.filter.addEventListener("change", renderAll);
  els.refresh.addEventListener("click",()=>showToast("Live-Preisabfrage ist vorbereitet, aber ohne Backend noch nicht aktiv."));

  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", event=>{
    event.preventDefault();
    deferredPrompt = event;
    els.install.hidden = false;
  });
  els.install.addEventListener("click", async ()=>{
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    els.install.hidden = true;
  });

  rebuildFilter();
  renderAll();

  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("service-worker.js").catch(()=>{});
  }
})();
