/* 1. المتغيرات الأساسية لإدارة الألوان بسهولة */
:root {
    --primary-color: #3498db;      /* اللون الأزرق الأساسي */
    --success-color: #2ecc71;      /* لون النجاح/الحفظ */
    --bg-light: #f8f9fa;           /* خلفية الوضع النهاري */
    --bg-dark: #121212;            /* خلفية الوضع الليلي */
    --card-light: #ffffff;
    --card-dark: #1e1e1e;
    --text-light: #333333;
    --text-dark: #e0e0e0;
    --nav-height: 70px;
    --transition: all 0.3s ease;
}

/* 2. الإعدادات العامة للموقع */
* {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

body {
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--bg-light);
    color: var(--text-light);
    direction: rtl; /* لضمان الترتيب من اليمين لليوم */
    transition: var(--transition);
}

/* 3. وضعية الشاشات (Responsive) */
main {
    max-width: 1200px; /* ليظهر بشكل ممتاز على شاشة 17.3 بوصة */
    margin: 0 auto;
    padding: 20px;
    padding-bottom: 100px; /* مساحة لعدم التداخل مع الشريط السفلي */
}

/* 4. الوضع الليلي */
[data-theme="dark"] {
    background-color: var(--bg-dark);
    color: var(--text-dark);
}

[data-theme="dark"] .card, 
[data-theme="dark"] .bottom-nav {
    background-color: var(--card-dark);
    box-shadow: 0 -2px 10px rgba(0,0,0,0.5);
}

/* 5. تنسيق الصفحات */
.page {
    display: none;
    animation: fadeIn 0.4s ease;
}

.page.active {
    display: block;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* 6. شريط التنقل السفلي الاحترافي */
.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--nav-height);
    background-color: var(--card-light);
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 -2px 15px rgba(0,0,0,0.1);
    z-index: 1000;
}

.nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    color: #888;
    transition: var(--transition);
}

.nav-item i {
    font-size: 24px;
    margin-bottom: 4px;
}

.nav-item.active {
    color: var(--primary-color);
}

/* 7. تصميم زر (+) المركزي */
.plus-wrapper {
    position: relative;
    top: -20px; /* يجعله بارزاً للأعلى */
}

.plus-btn {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--primary-color), #2980b9);
    color: white !important;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
    border: 4px solid var(--bg-light);
}

[data-theme="dark"] .plus-btn {
    border-color: var(--bg-dark);
}

/* 8. تنسيق البطاقات (Cards) والشبكة */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.card {
    background-color: var(--card-light);
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    transition: var(--transition);
}

.card:hover {
    transform: translateY(-5px);
}

/* 9. تنسيق النماذج (Forms) */
input, select, textarea {
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: inherit;
    color: inherit;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 15px;
    border-radius: 10px;
    width: 100%;
    font-weight: bold;
    cursor: pointer;
}

/* 10. إخفاء العناصر للمسؤول */
#admin-ads-btn {
    display: none; /* يتم تفعيله عبر JS */
}
