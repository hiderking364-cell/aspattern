/* --- محرك المحرر الاحترافي المتعدد الصفحات --- */

// 1. المتغيرات الأساسية
let pagesData = [null]; // مصفوفة لتخزين محتوى كل صفحة (صور DataURL)
let currentPageIdx = 0;
let currentTool = 'pen';
let isDrawing = false;

const canvas = document.getElementById('main-editor');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color-picker');

// 2. نظام التنقل والتحكم في المحرر
function showPage(id, el) {
    document.querySelectorAll('.page-container').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    if(el) {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        el.classList.add('active');
    }
    
    if(id === 'add') {
        setTimeout(initEditor, 100); // تأخير بسيط لضمان حساب مساحة الشاشة
    }
}

// 3. تهيئة المحرر (Canvas)
function initEditor() {
    // جعل حجم الكانفاس متناسباً مع شاشة اللابتوب أو الهاتف
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 550; // ارتفاع مناسب للرسم
    loadCurrentPage();

    // دعم الماوس (للكمبيوتر)
    canvas.onmousedown = startAction;
    canvas.onmousemove = drawingAction;
    canvas.onmouseup = stopAction;

    // دعم اللمس (للهاتف)
    canvas.ontouchstart = (e) => { startAction(e.touches[0]); e.preventDefault(); };
    canvas.ontouchmove = (e) => { drawingAction(e.touches[0]); e.preventDefault(); };
    canvas.ontouchend = stopAction;
}

// 4. أدوات الرسم والكتابة
function setTool(t) {
    currentTool = t;
    // تحديث شكل الأزرار
    document.querySelectorAll('.tool').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function startAction(e) {
    isDrawing = true;
    const pos = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);

    // ميزة الكتابة بالكيبورد
    if (currentTool === 'text') {
        const textValue = prompt("اكتب النص هنا (استخدم الكيبورد):");
        if (textValue) {
            ctx.font = "bold 24px Arial";
            ctx.fillStyle = colorPicker.value;
            ctx.fillText(textValue, pos.x, pos.y);
            saveState(); // حفظ بعد الكتابة
        }
        isDrawing = false;
    }
}

function drawingAction(e) {
    if (!isDrawing || currentTool !== 'pen') return;
    const pos = getMousePos(e);
    
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPicker.value;
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function stopAction() {
    if (isDrawing) {
        isDrawing = false;
        saveState(); // حفظ تلقائي عند رفع اليد أو الماوس
    }
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

// 5. إدارة تعدد الصفحات
function saveState() {
    pagesData[currentPageIdx] = canvas.toDataURL();
}

function loadCurrentPage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (pagesData[currentPageIdx]) {
        const img = new Image();
        img.src = pagesData[currentPageIdx];
        img.onload = () => ctx.drawImage(img, 0, 0);
    }
    updatePaginationUI();
}

function addNewPage() {
    saveState(); // حفظ الصفحة الحالية قبل الانتقال
    pagesData.push(null);
    currentPageIdx = pagesData.length - 1;
    loadCurrentPage();
}

function nextPage() {
    if (currentPageIdx < pagesData.length - 1) {
        saveState();
        currentPageIdx++;
        loadCurrentPage();
    }
}

function prevPage() {
    if (currentPageIdx > 0) {
        saveState();
        currentPageIdx--;
        loadCurrentPage();
    }
}

function updatePaginationUI() {
    document.getElementById('current-page-display').innerText = currentPageIdx + 1;
    document.getElementById('total-pages-display').innerText = pagesData.length;
}

// 6. استيراد الملفات والصور (مانجا جاهزة)
function importImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // توسيط الصورة وتنسيق حجمها لتناسب الكانفاس
            const ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, img.width * ratio, img.height * ratio);
            saveState();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function clearCurrentPage() {
    if (confirm("هل أنت متأكد من مسح محتوى هذه الصفحة بالكامل؟")) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        saveState();
    }
}

// 7. نظام الحفظ النهائي (نشر العمل)
function saveFullWork() {
    saveState(); // حفظ الصفحة الأخيرة
    const workTitle = prompt("أدخل اسم العمل للنشر:");
    if (!workTitle) return;

    const fullWork = {
        title: workTitle,
        author: user ? user.name : "زائر",
        pages: pagesData,
        date: new Date().toLocaleDateString()
    };

    // هنا يتم الحفظ في الذاكرة (أو إرساله للسيرفر لاحقاً)
    let allWorks = JSON.parse(localStorage.getItem('published_works')) || [];
    allWorks.unshift(fullWork);
    localStorage.setItem('published_works', JSON.stringify(allWorks));

    alert("تم نشر العمل بنجاح! يتكون من " + pagesData.length + " صفحة.");
    showPage('home');
}

// تشغيل عند التحميل
window.onload = () => {
    // التحقق من الجلسة (من الكود السابق)
    if (typeof checkAuth === "function") checkAuth();
};
