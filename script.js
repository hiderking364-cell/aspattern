// --- 1. إدارة البيانات (التخزين المحلي) ---
// استرجاع الأعمال المحفوظة من ذاكرة المتصفح أو إنشاء مصفوفة فارغة
let works = JSON.parse(localStorage.getItem('myWorks')) || [];

// --- 2. نظام التنقل بين الصفحات ---
function showPage(id, el) {
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // إظهار الصفحة المطلوبة
    document.getElementById(id).classList.add('active');
    
    // تحديث حالة الأزرار في شريط التنقل
    if(el) {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        el.classList.add('active');
    }

    // تفعيل الكانفاس إذا دخلنا لصفحة الإضافة
    if(id === 'add') initCanvas();
    
    // تحديث القائمة عند العودة للرئيسية أو الأعمال
    if(id === 'home' || id === 'recent') renderWorks();
}

// --- 3. محرك الرسم (Canvas Engine) ---
let canvas, ctx, drawing = false;

function initCanvas() {
    canvas = document.getElementById('mainCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    // ضبط حجم الكانفاس ليناسب الشاشة الحالية
    canvas.width = canvas.offsetWidth;
    canvas.height = 350;
    
    // أحداث الماوس واللمس
    const start = (e) => { drawing = true; draw(e.touches ? e.touches[0] : e); };
    const move = (e) => { draw(e.touches ? e.touches[0] : e); if(e.touches) e.preventDefault(); };
    const stop = () => { drawing = false; ctx.beginPath(); };

    canvas.onmousedown = start; canvas.onmousemove = move; canvas.onmouseup = stop;
    canvas.ontouchstart = start; canvas.ontouchmove = move; canvas.ontouchend = stop;
}

function draw(e) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 3; 
    ctx.lineCap = "round";
    ctx.strokeStyle = document.getElementById('colorPicker').value;
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
}

function clearCanvas() { 
    if(ctx) ctx.clearRect(0, 0, canvas.width, canvas.height); 
}

// --- 4. وظائف العمل (إنشاء، حذف، قراءة) ---

// نشر العمل الجديد
function publishWork() {
    const title = document.getElementById('workTitle').value;
    if(!title) return alert("يرجى كتابة عنوان للعمل أولاً!");

    const canvasData = canvas.toDataURL(); // تحويل الرسم إلى صورة مشفرة
    const newWork = {
        id: Date.now(),
        title: title,
        content: canvasData,
        date: new Date().toLocaleDateString('ar-EG')
    };

    works.unshift(newWork); // إضافة العمل الجديد في بداية القائمة
    saveToStorage();
    alert("تم النشر بنجاح! ستجده في الرئيسية.");
    showPage('home', document.querySelectorAll('.nav-item')[5]);
}

// حذف عمل معين
function deleteWork(id) {
    if(confirm("هل تريد حذف هذا العمل نهائياً؟")) {
        works = works.filter(w => w.id !== id);
        saveToStorage();
        renderWorks();
    }
}

// فتح القارئ لمشاهدة محتوى العمل
function readWork(id) {
    const work = works.find(w => w.id === id);
    if(!work) return;

    document.getElementById('readerTitle').innerText = work.title;
    document.getElementById('readerContent').innerHTML = `<img src="${work.content}" style="width:100%;">`;
    showPage('reader');
}

// تحديث عرض القائمة في الصفحات
function renderWorks() {
    const containers = [document.getElementById('homeList'), document.getElementById('recentList')];
    
    const html = works.length === 0 ? "<p>لا توجد أعمال حالياً.</p>" : works.map(work => `
        <div class="card">
            <div class="work-preview" onclick="readWork(${work.id})">
                <img src="${work.content}">
                <div>
                    <strong>${work.title}</strong><br>
                    <small>نُشر في: ${work.date}</small>
                </div>
            </div>
            <button class="btn-delete" onclick="deleteWork(${work.id})">حذف العمل 🗑️</button>
        </div>
    `).join('');

    containers.forEach(c => { if(c) c.innerHTML = html; });
}

// حفظ البيانات في LocalStorage
function saveToStorage() {
    localStorage.setItem('myWorks', JSON.stringify(works));
}

// --- 5. نظام المسؤول والوضع الليلي ---
function adminLogin() {
    const email = document.getElementById('adminEmail').value;
    if(email === "hiderking364@gmail.com") {
        document.getElementById('adBtn').style.display = 'flex';
        alert("أهلاً hiderking، تم تفعيل لوحة الإعلانات.");
    }
}

function openAds(el) {
    document.getElementById('adFrame').src = "https://www.effectivegatecpm.com/hz0rpumtw?key=92a31feb784de0b2a5e0e9dd9b3132b8";
    showPage('ads', el);
}

function toggleTheme() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
}

// تشغيل العرض الأولي عند تحميل الصفحة
window.onload = renderWorks;
