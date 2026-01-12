// 1. نظام التنقل بين الصفحات
function navigate(pageId) {
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // إظهار الصفحة المختارة
    const targetPage = document.getElementById(pageId);
    if(targetPage) targetPage.classList.add('active');

    // تحديث شكل الأزرار في الشريط السفلي
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    // ملاحظة: يتم تحديد الزر النشط عبر الـ event في HTML
}

// 2. إدارة الوضع الليلي (Dark Mode)
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('selectedTheme', newTheme); // حفظ الاختيار
}

// 3. التحقق من حساب المسؤول (hiderking364)
function handleLogin() {
    const emailInput = document.getElementById('userEmail').value.trim();
    const adminEmail = "hiderking364@gmail.com";
    const adTab = document.getElementById('adTab');
    const adminNote = document.getElementById('adminNote');

    if (emailInput === adminEmail) {
        adTab.style.display = 'flex'; // إظهار زر الإعلانات
        adminNote.style.display = 'block';
        alert("أهلاً بك يا مدير. تم تفعيل صلاحياتك الخاصة.");
    } else {
        adTab.style.display = 'none';
        adminNote.style.display = 'none';
        alert("تم تسجيل الدخول كمستخدم عادي.");
    }
}

// 4. نظام تغيير الاسم (قيد الانتظار يومين)
function updateUserName() {
    const newName = document.getElementById('displayName').value;
    const lastChange = localStorage.getItem('lastUpdateDate');
    const now = new Date().getTime();
    
    // حساب الفرق بالمللي ثانية (2 يوم = 172,800,000 مللي ثانية)
    const twoDays = 2 * 24 * 60 * 60 * 1000;

    if (lastChange && (now - lastChange < twoDays)) {
        const remainingHours = Math.ceil((twoDays - (now - lastChange)) / (1000 * 60 * 60));
        alert(`عذراً، يجب عليك الانتظار ${remainingHours} ساعة أخرى لتغيير اسمك.`);
    } else {
        localStorage.setItem('userName', newName);
        localStorage.setItem('lastUpdateDate', now);
        alert("تم تحديث الاسم بنجاح!");
    }
}

// 5. أساس أداة الرسم (الكانفاس)
// سنبدأ بتعريف المتغيرات الأساسية للرسم
let canvas, ctx;
let isDrawing = false;

function initCanvas() {
    canvas = document.getElementById('drawingCanvas');
    if(!canvas) return;
    ctx = canvas.getContext('2d');
    
    // جعل الكانفاس متجاوب مع حجم الشاشة
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 400;

    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        ctx.beginPath(); // لضمان عدم ربط الخطوط ببعضها
    });
    canvas.addEventListener('mousemove', draw);
}

function draw(e) {
    if (!isDrawing) return;
    
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#3498db'; // اللون الافتراضي

    // تحديد مكان الماوس بدقة داخل الكانفاس
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
}

// تشغيل الوظائف عند تحميل الصفحة
window.onload = () => {
    // استعادة الثيم المحفوظ
    const savedTheme = localStorage.getItem('selectedTheme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
};
