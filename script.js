/**
 * HIDERKING CREATIVE ENGINE v3.5
 * Core Logic for Multi-page Drawing, Text Manipulation, and User Management
 * Designed for High-Performance on Dell Precision Series
 */

(function() {
    // --- 1. الحالة العامة للتطبيق (Global State) ---
    const State = {
        currentUser: JSON.parse(localStorage.getItem('hider_user')) || null,
        pages: [null], // مصفوفة لتخزين الـ DataURL لكل صفحة
        currentPage: 0,
        activeTool: 'pen',
        isDrawing: false,
        startX: 0,
        startY: 0,
        selectedElement: null, // للعناصر المتحركة (النص)
        canvas: null,
        ctx: null,
        history: [], // لنظام التراجع (Undo)
        theme: localStorage.getItem('hider_theme') || 'light'
    };

    // --- 2. إعدادات المحرر (Initialization) ---
    function init() {
        State.canvas = document.getElementById('main-canvas');
        if (!State.canvas) return;
        
        State.ctx = State.canvas.getContext('2d', { willReadFrequently: true });
        
        setupCanvasSize();
        attachEventListeners();
        checkUserSession();
        loadPage(0);
        
        // تطبيق الثيم المحفوظ
        document.body.setAttribute('data-theme', State.theme);
    }

    function setupCanvasSize() {
        const wrapper = document.getElementById('editor-wrapper');
        const containerWidth = wrapper.clientWidth;
        // نسبة ذهبية للرسم 4:3 أو 16:9
        State.canvas.width = containerWidth;
        State.canvas.height = window.innerHeight * 0.65; 
    }

    // --- 3. نظام التعامل مع الأحداث (Event Listeners) ---
    function attachEventListeners() {
        // الماوس (PC)
        State.canvas.addEventListener('mousedown', startDrawing);
        State.canvas.addEventListener('mousemove', draw);
        State.canvas.addEventListener('mouseup', endDrawing);
        State.canvas.addEventListener('mouseleave', endDrawing);

        // اللمس (Mobile)
        State.canvas.addEventListener('touchstart', (e) => handleTouch(e, startDrawing), { passive: false });
        State.canvas.addEventListener('touchmove', (e) => handleTouch(e, draw), { passive: false });
        State.canvas.addEventListener('touchend', endDrawing, { passive: false });

        // لوحة المفاتيح
        document.addEventListener('keydown', handleShortcuts);
        
        // تغيير حجم النافذة
        window.addEventListener('resize', debounce(() => {
            saveCurrentPage();
            setupCanvasSize();
            loadPage(State.currentPage);
        }, 250));
    }

    function handleTouch(e, callback) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        callback(mouseEvent);
        e.preventDefault();
    }

    // --- 4. وظائف الرسم الأساسية (Drawing Core) ---
    function startDrawing(e) {
        State.isDrawing = true;
        const pos = getCoordinates(e);
        State.startX = pos.x;
        State.startY = pos.y;

        State.ctx.beginPath();
        State.ctx.moveTo(pos.x, pos.y);
        
        // حفظ الحالة للتراجع
        saveHistory();

        if (State.activeTool === 'text') {
            showTextLayer(pos.x, pos.y);
        }
    }

    function draw(e) {
        if (!State.isDrawing) return;
        if (State.activeTool === 'text') return; // النص لا يرسم بالجر

        const pos = getCoordinates(e);
        const color = document.getElementById('tool-color').value;
        
        State.ctx.strokeStyle = color;
        State.ctx.fillStyle = color;
        State.ctx.lineWidth = 3;
        State.ctx.lineCap = 'round';
        State.ctx.lineJoin = 'round';

        switch (State.activeTool) {
            case 'pen':
                State.ctx.lineTo(pos.x, pos.y);
                State.ctx.stroke();
                break;
            case 'rect':
                refreshCanvas();
                State.ctx.strokeRect(State.startX, State.startY, pos.x - State.startX, pos.y - State.startY);
                break;
            case 'circle':
                refreshCanvas();
                const radius = Math.sqrt(Math.pow(pos.x - State.startX, 2) + Math.pow(pos.y - State.startY, 2));
                State.ctx.beginPath();
                State.ctx.arc(State.startX, State.startY, radius, 0, Math.PI * 2);
                State.ctx.stroke();
                break;
        }
    }

    function endDrawing() {
        if (State.isDrawing) {
            State.isDrawing = false;
            saveCurrentPage();
        }
    }

    function getCoordinates(e) {
        const rect = State.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    // --- 5. نظام الطبقة النصية المتحركة (Advanced Text Layer) ---
    function showTextLayer(x, y) {
        const layer = document.getElementById('text-overlay');
        const input = document.getElementById('active-text-input');
        
        layer.style.display = 'block';
        layer.style.left = x + 'px';
        layer.style.top = y + 'px';
        
        input.value = "";
        setTimeout(() => input.focus(), 50);

        // جعل العنصر قابل للسحب
        makeElementDraggable(layer);
    }

    function makeElementDraggable(el) {
        let p1 = 0, p2 = 0, p3 = 0, p4 = 0;
        el.onmousedown = (e) => {
            e.preventDefault();
            p3 = e.clientX;
            p4 = e.clientY;
            document.onmouseup = () => {
                document.onmouseup = null;
                document.onmousemove = null;
            };
            document.onmousemove = (e) => {
                p1 = p3 - e.clientX;
                p2 = p4 - e.clientY;
                p3 = e.clientX;
                p4 = e.clientY;
                el.style.top = (el.offsetTop - p2) + "px";
                el.style.left = (el.offsetLeft - p1) + "px";
            };
        };
    }

    window.applyText = function() {
        const layer = document.getElementById('text-overlay');
        const input = document.getElementById('active-text-input');
        if (input.value.trim() === "") {
            layer.style.display = 'none';
            return;
        }

        const rect = State.canvas.getBoundingClientRect();
        const layerRect = layer.getBoundingClientRect();
        
        const canvasX = layerRect.left - rect.left;
        const canvasY = layerRect.top - rect.top + 25; // تعديل بسيط لخط القاعدة

        State.ctx.font = "bold 24px Arial";
        State.ctx.fillStyle = document.getElementById('tool-color').value;
        State.ctx.fillText(input.value, canvasX, canvasY);
        
        input.value = "";
        layer.style.display = 'none';
        saveCurrentPage();
    };

    // --- 6. إدارة الصفحات (Multi-Page Management) ---
    window.changePage = function(direction) {
        saveCurrentPage();
        const nextIdx = State.currentPage + direction;
        
        if (nextIdx >= 0 && nextIdx < State.pages.length) {
            State.currentPage = nextIdx;
            loadPage(nextIdx);
        }
    };

    window.addBlankPage = function() {
        saveCurrentPage();
        State.pages.push(null);
        State.currentPage = State.pages.length - 1;
        loadPage(State.currentPage);
    };

    function saveCurrentPage() {
        State.pages[State.currentPage] = State.canvas.toDataURL();
    }

    function loadPage(idx) {
        State.ctx.clearRect(0, 0, State.canvas.width, State.canvas.height);
        const data = State.pages[idx];
        if (data) {
            const img = new Image();
            img.src = data;
            img.onload = () => State.ctx.drawImage(img, 0, 0);
        }
        updatePaginationUI();
    }

    function updatePaginationUI() {
        document.getElementById('cur-p').innerText = State.currentPage + 1;
        document.getElementById('total-p').innerText = State.pages.length;
    }

    // --- 7. نظام الحساب والخصوصية (Security & Account) ---
    window.handleLogin = function() {
        const email = prompt("أدخل بريدك الإلكتروني (Google Simulation):");
        if (!email || !email.includes('@')) return alert("بريد غير صالح");

        const newUser = {
            id: 'ID_' + Math.random().toString(36).substr(2, 9),
            email: email,
            name: email.split('@')[0],
            avatar: 'https://via.placeholder.com/100',
            lastUpdate: 0,
            role: (email === "hiderking364@gmail.com") ? "Admin" : "User"
        };

        localStorage.setItem('hider_user', JSON.stringify(newUser));
        location.reload();
    };

    window.saveNewName = function() {
        const nameInput = document.getElementById('input-new-name').value;
        if (!nameInput) return;

        const now = Date.now();
        const diff = now - State.currentUser.lastUpdate;
        const cooldown = 48 * 60 * 60 * 1000; // 48 ساعة

        if (diff < cooldown) {
            const hoursLeft = Math.ceil((cooldown - diff) / (1000 * 60 * 60));
            document.getElementById('name-timer').innerText = `بقي ${hoursLeft} ساعة لتتمكن من التغيير.`;
            return;
        }

        State.currentUser.name = nameInput;
        State.currentUser.lastUpdate = now;
        localStorage.setItem('hider_user', JSON.stringify(State.currentUser));
        alert("تم تحديث الاسم!");
        location.reload();
    };

    // --- 8. ميزات الاستيراد والتصدير (Import/Export) ---
    window.handleImport = function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const ratio = Math.min(State.canvas.width / img.width, State.canvas.height / img.height);
                const centerX = (State.canvas.width - img.width * ratio) / 2;
                const centerY = (State.canvas.height - img.height * ratio) / 2;
                
                State.ctx.drawImage(img, centerX, centerY, img.width * ratio, img.height * ratio);
                saveCurrentPage();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    // --- 9. أدوات مساعدة (Utility Functions) ---
    function refreshCanvas() {
        // لمسح الرسومات المؤقتة أثناء جر المربع/الدائرة
        loadPage(State.currentPage);
    }

    function saveHistory() {
        State.history.push(State.canvas.toDataURL());
        if (State.history.length > 20) State.history.shift(); // الاحتفاظ بآخر 20 خطوة
    }

    window.undo = function() {
        if (State.history.length > 0) {
            const lastState = State.history.pop();
            const img = new Image();
            img.src = lastState;
            img.onload = () => {
                State.ctx.clearRect(0, 0, State.canvas.width, State.canvas.height);
                State.ctx.drawImage(img, 0, 0);
                saveCurrentPage();
            };
        }
    };

    function debounce(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, arguments), wait);
        };
    }

    function handleShortcuts(e) {
        if (e.ctrlKey && e.key === 'z') undo();
        if (e.key === 'Escape') {
            document.getElementById('text-overlay').style.display = 'none';
        }
    }

    // --- 10. تشغيل النظام ---
    window.setTool = function(tool, el) {
        State.activeTool = tool;
        document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
        el.classList.add('active');
        
        // إذا انتقل من النص لأداة أخرى، نثبت النص المكتوب
        if (tool !== 'text') applyText();
    };

    window.switchTab = function(pageId, el) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        el.classList.add('active');
        
        if (pageId === 'page-add') init();
    };

    window.toggleTheme = function() {
        State.theme = State.theme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', State.theme);
        localStorage.setItem('hider_theme', State.theme);
    };

    window.onload = () => {
        if (State.currentUser) checkUserSession();
    };

    function checkUserSession() {
        const loginSec = document.getElementById('login-section');
        const profileSec = document.getElementById('profile-section');
        if (State.currentUser && loginSec) {
            loginSec.classList.add('hidden');
            profileSec.classList.remove('hidden');
            document.getElementById('display-name').innerText = State.currentUser.name;
            document.getElementById('user-img').src = State.currentUser.avatar;
        }
    }

})();
