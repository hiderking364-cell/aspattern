// مصفوفة تحتوي على رابط الإعلان (يمكنك إضافة روابط أخرى هنا)
const adUrl = "https://www.effectivegatecpm.com/hz0rpumtw?key=92a31feb784de0b2a5e0e9dd9b3132b8";

function nextAd() {
    const frame = document.getElementById('ad-frame');
    const statusBar = document.querySelector('.status-bar');
    
    statusBar.innerText = "جاري تحميل الإعلان التفاعلي التالي...";
    
    // إعادة تحميل الإطار لإظهار إعلان جديد تماماً
    frame.src = adUrl;

    setTimeout(() => {
        statusBar.innerText = "بث مباشر: عرض تفاعلي نشط";
    }, 2000);
}

// السكربت الذكي: تحديث الإعلان تلقائياً كل 45 ثانية (متوسط مدة فيديو الإعلان)
setInterval(() => {
    console.log("تغيير الإعلان تلقائياً لزيادة الأرباح...");
    nextAd();
}, 45000); 

// تفعيل ميزة منع الخروج: إذا حاول الزائر لمس الشاشة يفتح له إعلان إضافي
document.addEventListener('click', function(e) {
    if (e.target.tagName !== 'BUTTON') {
        window.open(adUrl, '_blank');
    }
}, { once: false });
