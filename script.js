// --- 1. إدارة التنقل بين الصفحات ---
function go(pageId, element) {
    // إخفاء كل الصفحات
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    // إظهار الصفحة المطلوبة
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');

    // تحديث شكل الأزرار النشطة
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    // تشغيل أداة الرسم إذا دخلنا لصفحة الإضافة
    if (pageId === 'add') {
        setTimeout(initCanvas, 100); // تأخير بسيط لضمان ظهور الـ Canvas
    }
}

// --- 2. إدارة المظهر (الوضع الليلي) ---
function toggleTheme() {
    const current = document.body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

// --- 3. نظام المسؤول (hiderking364) ---
function checkAdmin() {
    const emailInput = document.getElementById('loginEmail').value.trim();
    if (emailInput === "hiderking364@gmail.com") {
        document.getElementById('adBtn').style.display = 'flex';
        document.getElementById('adminBadge').style.display = 'block';
        alert("مرحباً بك يا مدير hiderking. تم تفعيل صفحة الإعلانات.");
    } else {
        alert("تم تسجيل الدخول كمستخدم.");
    }
}

// --- 4. نظام تغيير الاسم (يومين انتظار) ---
function saveNewName() {
    const name = document.getElementById('nickNameInput').value;
    const lastUpdate = localStorage.getItem('nameUpdateTimestamp');
    const now = new Date().getTime();
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;

    if (lastUpdate && (now - lastUpdate < twoDaysInMs)) {
        const remaining = Math.ceil((twoDaysInMs - (now - lastUpdate)) / (1000 * 60 * 60));
        alert(`لا يمكنك التغيير الآن. انتظر ${remaining} ساعة أخرى.`);
    } else {
        localStorage.setItem('savedNickName', name);
        localStorage.setItem('nameUpdateTimestamp', now);
        alert("تم حفظ الاسم بنجاح!");
    }
}

// --- 5. أداة الرسم والإنشاء الاحترافية ---
let canvas, ctx, isDrawing = false;
let currentTool = 'pencil'; // الأداة الافتراضية

function initCanvas() {
    canvas = document.getElementById('drawingCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    // ضبط حجم الكانفاس ليناسب الشاشة
    canvas.width = canvas.offsetWidth;
    canvas.height = 350;

    // أحداث الماوس (للـ Dell Precision الخاص بك)
    canvas.onmousedown = (e) => { isDrawing = true; draw(e); };
    canvas.onmousemove = draw;
    canvas.onmouseup = () => { isDrawing = false; ctx.beginPath(); };

    // أحداث اللمس (للموبايل)
    canvas.ontouchstart = (e) => { isDrawing = true; draw(e.touches[0]); };
    canvas.ontouchmove = (e) => { draw(e.touches[0]); e.preventDefault(); };
    canvas.ontouchend = () => { isDrawing = false; ctx.beginPath(); };
}

function setTool(tool) {
    currentTool = tool;
}

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = document.getElementById('colorPicker').value;

    if (currentTool === 'pencil') {
        ctx.lineTo(x, y);
        ctx.stroke();
    } else if (currentTool === 'rect') {
        // رسم مربع بسيط (للتطوير القادم: سحب وإفلات)
        ctx.strokeRect(x, y, 50, 50);
    } else if (currentTool === 'circle') {
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// --- 6. معاينة الصور المرفوعة ---
function previewWorkImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const preview = document.getElementById('workImagePreview');
        preview.src = reader.result;
        preview.style.display = 'block';
    }
    reader.readAsDataURL(event.target.files[0]);
}

// استعادة الإعدادات عند فتح الموقع
window.onload = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
};
