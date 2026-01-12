/* --- المحرك البرمجي المتكامل --- */

// 1. إدارة الحالة والبيانات
let user = JSON.parse(localStorage.getItem('user_session')) || null;
let canvas, ctx, isDrawing = false;
let currentTool = 'pen';
let startX, startY; // لتحديد إحداثيات بداية رسم الأشكال

// 2. نظام تسجيل الدخول المحاكي لجوجل (بشكل مستقل لكل حساب)
function login(method) {
    const email = prompt("يرجى إدخال بريدك الإلكتروني (جوجل):");
    if (!email || !email.includes('@')) return alert("البريد غير صحيح");

    // إنشاء كائن مستخدم فريد
    user = {
        email: email,
        name: email.split('@')[0],
        avatar: 'https://via.placeholder.com/90',
        lastNamingDate: 0,
        works: [],
        isAdmin: (email === "hiderking364@gmail.com") // التحقق من هويتك كمسؤول بصمت
    };

    localStorage.setItem('user_session', JSON.stringify(user));
    location.reload(); // إعادة التحميل لتفعيل الحساب
}

// 3. نظام التنقل والتحقق من الجلسة
function nav(pageId, element) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    element.classList.add('active');

    if (pageId === 'add') setTimeout(initCanvas, 100);
    if (pageId === 'settings') checkUserStatus();
}

function checkUserStatus() {
    const authUI = document.getElementById('auth-ui');
    const profileUI = document.getElementById('profile-ui');

    if (user) {
        authUI.classList.add('hidden');
        profileUI.classList.remove('hidden');
        document.getElementById('u-name').innerText = user.name;
        document.getElementById('user-avatar').src = user.avatar;
    }
}

// 4. أداة الإنشاء والرسم المتطورة
function initCanvas() {
    canvas = document.getElementById('editor-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 450;

    // الماوس واللمس
    canvas.onmousedown = startAction;
    canvas.onmousemove = moveAction;
    canvas.onmouseup = endAction;
    
    canvas.ontouchstart = (e) => startAction(e.touches[0]);
    canvas.ontouchmove = (e) => { moveAction(e.touches[0]); e.preventDefault(); };
    canvas.ontouchend = endAction;
}

function startAction(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    
    if (currentTool === 'pen') {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
    }
}

function moveAction(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 3;
    ctx.strokeStyle = document.getElementById('pen-color').value;
    ctx.lineCap = 'round';

    if (currentTool === 'pen') {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    // ملاحظة: رسم المربع والدائرة يتم "عند الرفع" أو بمسح مؤقت لتطوير السحب (توسعة مستقبلية)
}

function endAction(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === 'rect') {
        ctx.strokeRect(startX, startY, x - startX, y - startY);
    } else if (currentTool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.stroke();
    } else if (currentTool === 'text') {
        const txt = prompt("أدخل النص المراد كتابته:");
        if (txt) {
            ctx.font = document.getElementById('font-size').value + "px Arial";
            ctx.fillStyle = ctx.strokeStyle;
            ctx.fillText(txt, startX, startY);
        }
    }
    isDrawing = false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 5. إدارة الحساب (الاسم والصورة)
function changeName() {
    const newName = document.getElementById('change-name-input').value;
    const now = Date.now();
    const twoDays = 48 * 60 * 60 * 1000;

    if (!newName) return;
    if (now - user.lastNamingDate < twoDays) {
        const remaining = Math.ceil((twoDays - (now - user.lastNamingDate)) / (1000 * 60 * 60));
        document.getElementById('name-error').innerText = `يجب الانتظار ${remaining} ساعة إضافية.`;
        return;
    }

    user.name = newName;
    user.lastNamingDate = now;
    updateUserAndStorage();
    alert("تم تحديث الاسم بنجاح!");
}

function updateAvatar(input) {
    const reader = new FileReader();
    reader.onload = function() {
        user.avatar = reader.result;
        updateUserAndStorage();
        document.getElementById('user-avatar').src = reader.result;
    };
    reader.readAsDataURL(input.files[0]);
}

function updateUserAndStorage() {
    localStorage.setItem('user_session', JSON.stringify(user));
}

function logout() {
    localStorage.removeItem('user_session');
    location.reload();
}

// 6. التحكم في نمط الإنشاء (PDF أو رسم)
function setMode(mode) {
    document.getElementById('pdf-area').style.display = (mode === 'pdf') ? 'block' : 'none';
    document.getElementById('draw-area').style.display = (mode === 'draw') ? 'block' : 'none';
}

function toggleDarkMode() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    body.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
}

// التشغيل الأولي
window.onload = checkUserStatus;
