

const week = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

function getTodayIndex(){
  const g = new Date().getDay(); // 0=Sun,1=Mon..6=Sat
  return (g === 0) ? 6 : g - 1;
}

// Meal data
const meals = [
  { name: "Breakfast", time: "08:00", displayTime: "08:00 AM", detail: "Oats with fruits 🥣" },
  { name: "Lunch", time: "13:00", displayTime: "01:00 PM", detail: "Quinoa salad 🥗" },
  { name: "Dinner", time: "19:30", displayTime: "07:30 PM", detail: "Steamed veggies and dal 🍲" }
];
// Dynamic meal suggestions with real items and images
const mealSuggestions = {
  "Breakfast": [
    { name: "Poha", desc: "Flattened rice with veggies & peanuts.", calories: 280, img: "https://images.unsplash.com/photo-1647769169217-7c403016b669?q=80&w=400&auto=format&fit=crop" },
    { name: "Idli Sambar", desc: "Steamed rice cakes with lentil stew.", calories: 320, img: "https://images.unsplash.com/photo-1657210933410-9e9598e2ca3a?q=80&w=400&auto=format&fit=crop" },
    { name: "Upma", desc: "Semolina porridge with vegetables.", calories: 300, img: "https://images.unsplash.com/photo-1668236545902-2a0e6f5c8b9f?q=80&w=400&auto=format&fit=crop" },
    { name: "Masala Omelette", desc: "Egg omelette with onions & herbs.", calories: 260, img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop" },
    { name: "Fruit Bowl", desc: "Seasonal fruits with nuts & seeds.", calories: 220, img: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?q=80&w=400&auto=format&fit=crop" },
    { name: "Dosa & Chutney", desc: "Crispy dosa with coconut chutney.", calories: 380, img: "https://images.unsplash.com/photo-1596797038530-2c107229f18f?q=80&w=400&auto=format&fit=crop" }
  ],
  "Lunch": [
    { name: "Dal Tadka & Rice", desc: "Yellow lentils tempered with ghee.", calories: 520, img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400&auto=format&fit=crop" },
    { name: "Paneer Tikka Salad", desc: "Grilled paneer with fresh greens.", calories: 450, img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=400&auto=format&fit=crop" },
    { name: "Grilled Chicken & Quinoa", desc: "Lean protein with whole grain.", calories: 560, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop" },
    { name: "Veg Pulao & Raita", desc: "Fragrant rice with veggies.", calories: 540, img: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19f?q=80&w=400&auto=format&fit=crop" },
    { name: "Chapati & Mixed Sabzi", desc: "Whole wheat rotis with veg curry.", calories: 480, img: "https://images.unsplash.com/photo-1631451265368-9176550b1a95?q=80&w=400&auto=format&fit=crop" }
  ],
  "Dinner": [
    { name: "Khichdi with Ghee", desc: "Moong dal & rice comfort bowl.", calories: 430, img: "https://images.unsplash.com/photo-1625942994320-a522e8f17dad?q=80&w=400&auto=format&fit=crop" },
    { name: "Palak Paneer & Roti", desc: "Spinach and cottage cheese curry.", calories: 520, img: "https://images.unsplash.com/photo-1625944529919-1c1b2fc90d92?q=80&w=400&auto=format&fit=crop" },
    { name: "Fish Curry & Rice", desc: "Lightly spiced coastal style curry.", calories: 570, img: "https://images.unsplash.com/photo-1617191518002-489b5a0c0d0d?q=80&w=400&auto=format&fit=crop" },
    { name: "Mixed Veg Stir Fry", desc: "Seasonal veggies sautéed lightly.", calories: 360, img: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=400&auto=format&fit=crop" },
    { name: "Tomato Soup & Sandwich", desc: "Warm soup with grilled sandwich.", calories: 410, img: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop" }
  ]
};

// Build a standardized Ayurvedic info object with safe defaults
function getAyurvedaInfo(item){
  const name = (item && item.name) || 'Food';
  // Very light defaults to avoid misinformation; can be customized per item later
  return item.ayurveda || {
    dosha: 'Generally balancing',
    rasa: 'Madhura (sweet)/Mild',
    virya: 'Ushna (warming) or neutral',
    guna: 'Light, easy-to-digest',
    agniSupport: 'Supports digestion when eaten warm and fresh',
    bestTime: 'Best consumed during day time',
    notes: `Moderation recommended. Adjust spices/oil as per constitution.`
  };
}

function renderItemDetailHTML(item, uploadedUrl){
  const ayu = getAyurvedaInfo(item);
  const kcal = item.calories ? `${item.calories} kcal` : 'Varies by portion';
  const desc = item.desc || '';
  const imgSrc = uploadedUrl || item.img;
  return `
    <div class="item-detail-grid">
      <div class="item-info">
        <div class="item-media">
          <img src="${imgSrc}" alt="${item.name}" data-original="${item.img}"/>
        </div>
        <h5>${item.name}</h5>
        <div class="item-actions">
          <button class="btn-track">Track</button>
          <button class="btn-recipe">See recipe</button>
          <button class="btn-upload">Upload photo</button>
        </div>
        <div class="kv">
          <div class="kv-row"><span class="kv-key">Calories</span><span class="kv-val">${kcal}</span></div>
          <div class="kv-row"><span class="kv-key">Serving</span><span class="kv-val">1 serving</span></div>
        </div>
        <p class="item-desc">${desc}</p>
      </div>
      <div class="item-ayurveda">
        <h6>Ayurvedic properties</h6>
        <div class="ayu-grid">
          <div class="ayu-row"><span class="ayu-key">Dosha</span><span class="ayu-badge">${ayu.dosha}</span></div>
          <div class="ayu-row"><span class="ayu-key">Rasa</span><span class="ayu-badge">${ayu.rasa}</span></div>
          <div class="ayu-row"><span class="ayu-key">Virya</span><span class="ayu-badge">${ayu.virya}</span></div>
          <div class="ayu-row"><span class="ayu-key">Guna</span><span class="ayu-badge">${ayu.guna}</span></div>
          <div class="ayu-row"><span class="ayu-key">Agni</span><span class="ayu-badge">${ayu.agniSupport}</span></div>
          <div class="ayu-row"><span class="ayu-key">Best time</span><span class="ayu-badge">${ayu.bestTime}</span></div>
        </div>
        <div class="ayu-notes">${ayu.notes}</div>
      </div>
    </div>
    <div class="detail-actions-bottom">
      <button class="back-to-results">🔙 Back</button>
    </div>
  `;
}
const globaltodayIndex = getTodayIndex();
function renderMealPlanner(){
  const container = document.createElement('div');
  container.className = 'meal-container';

  const todayIndex = globaltodayIndex;
  const yesterdayIndex = (todayIndex - 1 + 7) % 7;
  const tomorrowIndex = (todayIndex + 1) % 7;

  // --- Day selector ---
  const selector = document.createElement('div');
  selector.className = 'day-selector';

  [yesterdayIndex, todayIndex, tomorrowIndex].concat([...Array(7).keys()].filter(i => i!==yesterdayIndex && i!==todayIndex && i!==tomorrowIndex))
  .forEach(i=>{
    const pill = document.createElement('div');
    pill.className='day-pill' + (i===todayIndex?' active':'');
    pill.innerHTML = `<div class="day-name">${week[i]}</div>
                      <div class="day-sub ${i===todayIndex?'today':i===yesterdayIndex?'yesterday':i===tomorrowIndex?'tomorrow':''}">
                        ${i===todayIndex?'Today':i===yesterdayIndex?'Yesterday':i===tomorrowIndex?'Tomorrow':''}
                      </div>`;
    selector.appendChild(pill);
  });

  container.appendChild(selector);

  // --- Day card ---
  const card = document.createElement('div'); 
  card.className='day-card';
  card.innerHTML = `
    <div class="left-section">
      <div class="circle"><div class="circle-inner">Balanced</div></div>
      <div class="score">Today’s Sthava Score: 82</div>
    </div>
    <div class="right-1">
      <h3>Ayurvedic Parameters</h3>
      <div class="param"><span><strong>Agni</strong></span><span>Strong 🔥</span></div>
      <div class="param"><span><strong>Dosha Balance</strong></span><span>Vata-Pitta balanced</span></div>
      <div class="param"><span><strong>Energy</strong></span><span>High ⚡</span></div>
      <div class="param"><span><strong>Mood</strong></span><span>Calm 😊</span></div>
    </div>
    <div class="right-2">
      <h3>Ayurvedic Parameters</h3>
      <div class="param"><span><strong>Agni</strong></span><span>Strong 🔥</span></div>
      <div class="param"><span><strong>Dosha Balance</strong></span><span>Vata-Pitta balanced</span></div>
      <div class="param"><span><strong>Energy</strong></span><span>High ⚡</span></div>
      <div class="param"><span><strong>Mood</strong></span><span>Calm 😊</span></div>
    </div>
  `;
  container.appendChild(card);

  // --- Today's Log ---
  const logSection = document.createElement('div');
  logSection.className = 'log-section';
  logSection.innerHTML = `<h3>Today's Log 📝</h3>`;
  const mealLogContainer = document.createElement('div');
  mealLogContainer.className = 'meal-log';

  const nowHour = new Date().getHours();
  const sortedMeals = [...meals].sort((a,b)=>{
    return Math.abs(parseInt(a.time.split(':')[0])-nowHour) - Math.abs(parseInt(b.time.split(':')[0])-nowHour);
  });

  sortedMeals.forEach(m=>{
    const entryWrapper = document.createElement('div');
    entryWrapper.className='meal-entry-container';

    const timeSpan = document.createElement('span');
    timeSpan.className='log-time';
    timeSpan.textContent = m.displayTime;

    const mealDiv = document.createElement('div');
    mealDiv.className='meal-entry';

    // Meal title + add icon (positioned top-right)
    mealDiv.innerHTML = `
      <div class="meal-title-wrapper">
        <div class="meal-detail"><strong>${m.name}:</strong> ${m.detail}</div>
        <div class="add-icon" title="Add item">+</div>
      </div>
    `;

    // Click to open floating modal/popup
    mealDiv.querySelector('.add-icon').addEventListener('click', () => {
      openFloatingPopup(m.name);
    });

	const suggestions = document.createElement('div');
	suggestions.className='meal-suggestions';

	const items = mealSuggestions[m.name] || [];
	if(items.length === 0){
		const empty = document.createElement('div');
		empty.className='meal-suggestion-text';
		empty.innerHTML = `<strong>No suggestions available.</strong>`;
		suggestions.appendChild(empty);
	}else{
		items.slice(0, 4).forEach(item => {
			const suggestion = document.createElement('div');
			suggestion.className='suggestion';
			suggestion.innerHTML = `
				<img src="${item.img}" alt="${item.name}" class="suggestion-img"/>
				<div class="suggestion-details">
					<div class="suggestion-text">
					<strong>${item.name}</strong>
					<div class="suggestion-calories">Approx. ${item.calories} kcal</div>
					</div>
					<p class="suggestion-desc">${item.desc}</p>
				</div>
			`;
			// Open popup preloaded with this item
			suggestion.addEventListener('click', (e)=>{
				e.stopPropagation();
				openFloatingPopupWithItem(item);
			});
			suggestions.appendChild(suggestion);
		});

		// Tips block as the 5th tile
		const tip = document.createElement('div');
		tip.className='meal-suggestion-text';
		tip.innerHTML = `<strong>More suggestions coming soon!</strong>`;
		suggestions.appendChild(tip);
	}

    mealDiv.appendChild(suggestions);
    entryWrapper.appendChild(timeSpan);
    entryWrapper.appendChild(mealDiv);
    mealLogContainer.appendChild(entryWrapper);
  });

  logSection.appendChild(mealLogContainer);
  container.appendChild(logSection);

  // mount
  const main = document.getElementById('main-content');
  main.innerHTML='';
  const h1 = document.createElement('h1'); 
  h1.textContent='Weekly Meal Plan 🥗';
  main.appendChild(h1);
  main.appendChild(container);
}

// Floating popup/modal function
function openFloatingPopup(mealName){
  if(document.querySelector('.floating-popup')) return;

  const popup = document.createElement('div');
  popup.className = 'floating-popup';
  popup.innerHTML = `
    <div class="popup-header">
      <h4>Add item to ${mealName}</h4>
      <button class="popup-close">&times;</button>
    </div>

    <!-- Camera snap section -->
    <div class="camera-snap">
      <div class="camera-box">
        <span class="camera-icon">📷</span>
        <div class="camera-text">Click a snap and Track</div>
      </div>
    </div>

    <!-- Search input -->
    <input type="text" placeholder="Search items..." class="popup-search"/>
    <div class="popup-results"></div>
    <div class="popup-item-detail" style="display:none;"></div>
    <input type="file" accept="image/*" class="popup-file-input" style="display:none;" />
  `;

  document.body.appendChild(popup);

  const searchInput = popup.querySelector('.popup-search');
  const resultsDiv = popup.querySelector('.popup-results');
  const detailDiv = popup.querySelector('.popup-item-detail');
  const header = popup.querySelector('.popup-header');
  const camera = popup.querySelector('.camera-snap');
  const fileInput = popup.querySelector('.popup-file-input');
  const cameraBox = popup.querySelector('.camera-box');

  // Store last uploaded image URL for this popup session
  let lastUploadedImageUrl = '';

  function renderCameraPlaceholder(){
    if(!cameraBox) return;
    cameraBox.innerHTML = `
      <span class="camera-icon">📷</span>
      <div class="camera-text">Click a snap and Track</div>
    `;
  }

  function applyCameraPreview(url){
    if(!cameraBox) return;
    cameraBox.innerHTML = `
      <div class="camera-preview">
        <img src="${url}" alt="Uploaded"/>
        <button class="remove-upload-button" title="Remove">&times;</button>
      </div>
    `;
    const removeBtn = cameraBox.querySelector('.remove-upload-button');
    if(removeBtn){
      removeBtn.addEventListener('click', (e)=>{
        e.stopPropagation();
        lastUploadedImageUrl = '';
        // revert camera box UI
        renderCameraPlaceholder();
        // revert detail image to original if visible
        const detailImg = popup.querySelector('.item-info img');
        if(detailImg){
          const orig = detailImg.getAttribute('data-original');
          if(orig) detailImg.src = orig;
        }
      });
    }
  }

  if(cameraBox){
    cameraBox.addEventListener('click', (e)=>{
      e.stopPropagation();
      if(fileInput) fileInput.click();
    });
  }
  if(fileInput){
    fileInput.addEventListener('change', ()=>{
      const file = fileInput.files && fileInput.files[0];
      if(!file) return;
      const url = URL.createObjectURL(file);
      lastUploadedImageUrl = url;
      if(cameraBox){
        applyCameraPreview(url);
      }
      const detailImg = popup.querySelector('.item-info img');
      if(detailImg){ detailImg.src = url; }
    });
  }

  // Build popup search list from all meal suggestions
	const suggestions = (()=>{
		const all = [];
		Object.keys(mealSuggestions).forEach(mealKey => {
			(mealSuggestions[mealKey] || []).forEach(item => {
				all.push({
					name: item.name,
					desc: item.desc,
					img: item.img,
					meal: mealKey
				});
			});
		});
		// Add a few base items that were previously in examples if missing
		const base = [
			{ name: "Herbal Tea", desc: "Calming and aids digestion.", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=400&auto=format&fit=crop", meal: "Any" }
		];
		base.forEach(b=>{ if(!all.find(x=>x.name.toLowerCase()===b.name.toLowerCase())) all.push(b); });
		return all;
	})();

  // Search input handler
  searchInput.addEventListener('input', ()=>{
    const query = searchInput.value.toLowerCase();
    resultsDiv.innerHTML = ''; 
    detailDiv.style.display = 'none'; 
    resultsDiv.style.display = 'block'; 

    if(query.length > 0){
      const filtered = suggestions.filter(item=>item.name.toLowerCase().includes(query));
      filtered.forEach(item=>{
        const resultItem = document.createElement('div');
		resultItem.className = 'popup-suggestion';
		resultItem.textContent = item.name;

        resultItem.addEventListener('click', (e)=>{
          e.stopPropagation();
          showItemDetail(item); 
        });

        resultsDiv.appendChild(resultItem);
      });
    }
  });

  function showItemDetail(item){
    header.style.display = 'none';
    camera.style.display = 'none';
    resultsDiv.style.display = 'none';

    detailDiv.style.display = 'block';
    detailDiv.innerHTML = renderItemDetailHTML(item, lastUploadedImageUrl);

    detailDiv.querySelector('.back-to-results').addEventListener('click', (e)=>{
      e.stopPropagation();
      detailDiv.style.display = 'none';
      resultsDiv.style.display = 'block';
      header.style.display = 'flex';
      camera.style.display = 'flex';
    });

	// Action handlers
	const trackBtn = detailDiv.querySelector('.btn-track');
	const recipeBtn = detailDiv.querySelector('.btn-recipe');
	const uploadBtn = detailDiv.querySelector('.btn-upload');
	if(trackBtn){
		trackBtn.addEventListener('click', (e)=>{
			e.stopPropagation();
			try{ alert(`Tracked: ${item.name}`); }catch(err){}
		});
	}
	if(recipeBtn){
		recipeBtn.addEventListener('click', (e)=>{
			e.stopPropagation();
			try{ window.open('https://www.google.com/search?q=' + encodeURIComponent(item.name + ' recipe'), '_blank'); }catch(err){}
		});
	}
	if(uploadBtn && fileInput){
		uploadBtn.addEventListener('click', (e)=>{
			e.stopPropagation();
			fileInput.click();
		});
	}
  }

  popup.querySelector('.popup-close').addEventListener('click', (e)=>{
    e.stopPropagation();
    document.body.removeChild(popup);
    document.removeEventListener('click', outsideClickListener);
  });

  function outsideClickListener(e) {
    if (!popup.contains(e.target)) {
      document.body.removeChild(popup);
      document.removeEventListener('click', outsideClickListener);
    }
  }

  setTimeout(()=>{
    document.addEventListener('click', outsideClickListener);
  }, 0);
}

// Helper to open popup directly with a selected item
function openFloatingPopupWithItem(item){
  openFloatingPopup(item.meal || 'Meal');
  // Wait a tick for DOM to render, then show details
  setTimeout(()=>{
    const detailDiv = document.querySelector('.floating-popup .popup-item-detail');
    const header = document.querySelector('.floating-popup .popup-header');
    const resultsDiv = document.querySelector('.floating-popup .popup-results');
    const camera = document.querySelector('.floating-popup .camera-snap');
    const fileInput = document.querySelector('.floating-popup .popup-file-input');
    const cameraBox = document.querySelector('.floating-popup .camera-box');
    if(!detailDiv || !resultsDiv || !header || !camera || !fileInput || !cameraBox) return;

    // replicate showItemDetail here since it's inner-scoped
    header.style.display = 'none';
    camera.style.display = 'none';
    resultsDiv.style.display = 'none';

    detailDiv.style.display = 'block';
    detailDiv.innerHTML = renderItemDetailHTML(item, null); // Pass null for uploadedUrl as it's not uploaded yet

    detailDiv.querySelector('.back-to-results').addEventListener('click', (e)=>{
      e.stopPropagation();
      detailDiv.style.display = 'none';
      resultsDiv.style.display = 'block';
      header.style.display = 'flex';
      camera.style.display = 'flex';
    });
    const trackBtn = detailDiv.querySelector('.btn-track');
    const recipeBtn = detailDiv.querySelector('.btn-recipe');
    const uploadBtn = detailDiv.querySelector('.btn-upload');
    if(trackBtn){
      trackBtn.addEventListener('click', (e)=>{
        e.stopPropagation();
        try{ alert(`Tracked: ${item.name}`); }catch(err){}
      });
    }
    if(recipeBtn){
      recipeBtn.addEventListener('click', (e)=>{
        e.stopPropagation();
        try{ window.open('https://www.google.com/search?q=' + encodeURIComponent(item.name + ' recipe'), '_blank'); }catch(err){}
      });
    }
    if(uploadBtn && fileInput){
      uploadBtn.addEventListener('click', (e)=>{
        e.stopPropagation();
        fileInput.click();
      });
    }
  }, 0);
}
function renderSettings() {
  const main = document.getElementById("main-content");
  main.innerHTML = `
    <div class="settings-container">
      <h1>⚙️ Settings</h1>
      <div class="settings-grid">

        <!-- Profile Settings -->
        <div class="settings-card">
          <h2>👤 Profile</h2>
          <label>Name:</label>
          <input type="text" value="Kavya" />
          <label>Email:</label>
          <input type="email" value="kavya@example.com" />
          <button class="save-btn">Save</button>
        </div>

        <!-- Preferences -->
        <div class="settings-card">
          <h2>🌙 Preferences</h2>
          <label>
            <input type="checkbox" checked> Enable Notifications
          </label>
          <label>
            <input type="checkbox"> Ayurvedic Tips Daily
          </label>
          <button class="save-btn">Update</button>
        </div>

        <!-- Ayurveda Help -->
        <div class="settings-card ayurveda-help">
          <h2>🌿 Ayurveda Help</h2>
          <p><strong>Balance Your Doshas:</strong> Ayurveda believes health is maintained by balancing the three doshas – <em>Vata</em>, <em>Pitta</em>, and <em>Kapha</em>.</p>
          <ul>
            <li>🥗 Eat fresh, seasonal foods</li>
            <li>🧘‍♀️ Practice yoga & meditation</li>
            <li>🌞 Wake up early, align with natural cycles</li>
            <li>🍵 Drink herbal teas for detoxification</li>
          </ul>
          <button class="learn-btn">Learn More</button>
        </div>

      </div>
    </div>
  `;
}


// Theme toggle + load pref
function toggleTheme(){
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  try{ localStorage.setItem('ayur_theme_dark', isDark); }catch(e){}
}
// --- Add theme toggle button ---
(function addThemeToggleIcon() {
  // Prevent adding multiple buttons
  if (document.getElementById('theme-toggle-global')) return;

  const btn = document.createElement('button');
  btn.id = 'theme-toggle-global';
  btn.className = 'theme-toggle-btn';
  btn.type = 'button';
  btn.title = 'Toggle Dark Mode';
  btn.setAttribute('aria-label', 'Toggle Dark Mode');
  btn.textContent = '🌗'; // you can change to any icon or emoji

  // Style: fixed at top-right
  Object.assign(btn.style, {
    position: 'fixed',
    top: '14px',
    right: '16px',
    zIndex: 9999,
    padding: '8px',
    fontSize: '18px',
    cursor: 'pointer',
    border: 'green 1px solid',
    background: 'transparent'
  });

  // Click event: toggle theme
  btn.addEventListener('click', () => {
    toggleTheme();
  });

  // Add to DOM
  document.body.appendChild(btn);
})();


(function(){
  try{
    const pref = localStorage.getItem('ayur_theme_dark');
    if(pref==='true') document.body.classList.add('dark-mode');
  }catch(e){}

  // ✅ Default section: Meal Plan
  renderMealPlanner();
})();
