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

function renderMealPlanner(){
  const container = document.createElement('div');
  container.className = 'meal-container';

  const todayIndex = getTodayIndex();
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

    for (let i = 1; i <= 4; i++) {
      const suggestion = document.createElement('div');
      suggestion.className='suggestion';
      suggestion.innerHTML = `
        <img src="https://via.placeholder.com/50" alt="food" class="suggestion-img"/>
        <div class="suggestion-details">
          <div class="suggestion-text">
          <strong>${m.name} Suggestion ${i}</strong>
          <div class="suggestion-calories">Approx. ${150 + i*50} kcal</div>
          </div>
          <p class="suggestion-desc">A healthy choice for ${m.name.toLowerCase()} option ${i}.</p>
        </div>
      `;
      suggestions.appendChild(suggestion);
    }
    const text=document.createElement('div');
    text.className='meal-suggestion-text';
    text.innerHTML = `<strong>More suggestions coming soon!</strong>`;
    suggestions.appendChild(text);

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
  `;

  document.body.appendChild(popup);

  const searchInput = popup.querySelector('.popup-search');
  const resultsDiv = popup.querySelector('.popup-results');
  const detailDiv = popup.querySelector('.popup-item-detail');
  const header = popup.querySelector('.popup-header');
  const camera = popup.querySelector('.camera-snap');

  // Example suggestion list
  const suggestions = [
    { name: "Oats with fruits", desc: "Rich in fiber and vitamins.", img: "https://via.placeholder.com/120" },
    { name: "Quinoa Salad", desc: "High protein, gluten-free option.", img: "https://via.placeholder.com/120" },
    { name: "Steamed Veggies", desc: "Light, nutritious and easy to digest.", img: "https://via.placeholder.com/120" },
    { name: "Herbal Tea", desc: "Calming and aids digestion.", img: "https://via.placeholder.com/120" }
  ];

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
    detailDiv.innerHTML = `
      <div class="item-detail-card">
        <img src="${item.img}" alt="${item.name}"/>
        <h5>${item.name}</h5>
        <p>${item.desc}</p>
        <button class="back-to-results">🔙 Back</button>
      </div>
    `;

    detailDiv.querySelector('.back-to-results').addEventListener('click', (e)=>{
      e.stopPropagation();
      detailDiv.style.display = 'none';
      resultsDiv.style.display = 'block';
      header.style.display = 'flex';
      camera.style.display = 'flex';
    });
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


// Left nav handler
function showContent(section){
  if(section==='meal'){ renderMealPlanner(); return; }
  const main=document.getElementById('main-content');
  switch(section){
    case 'wellness': main.innerHTML='<h1>Personal Wellness 🌼</h1><p>Track daily routines, yoga, sleep and dosha balance.</p>'; break;
    case 'prescriptions': main.innerHTML="<h1>Doctor's Prescriptions 💊</h1><p>Prescribed Ayurvedic medicines.</p>"; break;
    case 'notes': main.innerHTML="<h1>Doctor's Notes 📝</h1><p>Advice & lifestyle tips from your doctor.</p>"; break;
    case 'reports': main.innerHTML='<h1>Reports 📄</h1><p>Your health reports and lab results.</p>'; break;
    case "track":
      renderTrackPerformance();
      break;
    default: renderMealPlanner(); break;
  }
}

// Theme toggle + load pref
function toggleTheme(){
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  try{ localStorage.setItem('ayur_theme_dark', isDark); }catch(e){}
}

(function(){
  try{
    const pref = localStorage.getItem('ayur_theme_dark');
    if(pref==='true') document.body.classList.add('dark-mode');
  }catch(e){}

  // ✅ Default section: Meal Plan
  renderMealPlanner();
})();
