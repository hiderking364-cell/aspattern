// رابط الإعلان المباشر الخاص بك
const adUrl = "https://www.profitablecpmratenetwork.com/hz0rpumtw?key=92a31feb784de0b2a5e0e9dd9b3132b8";

function nextAd() {
    const frame = document.getElementById('ad-frame');
    const statusBar = document.querySelector('.status-bar');
    
    statusBar.innerText = "جاري تحميل الإعلان التفاعلي التالي...";
    
    // 1. تحديث الإطار الداخلي
    frame.src = adUrl;

    // 2. فتح الإعلان في نافذة جديدة (لضمان احتساب الأرباح 100%)
    window.open(adUrl, '_blank');

    setTimeout(() => {
        statusBar.innerText = "بث مباشر: عرض تفاعلي نشط";
    }, 2000);
}

// تحديث الإعلان تلقائياً كل 60 ثانية لزيادة الـ Impressions
setInterval(() => {
    console.log("تحديث العروض تلقائياً...");
    nextAd();
}, 60000); 

// ميزة ذكية: عند الضغط في أي مكان فارغ يفتح إعلان إضافي
document.addEventListener('click', function(e) {
    if (e.target.tagName !== 'BUTTON') {
        window.open(adUrl, '_blank');
    }
}, { once: false });
