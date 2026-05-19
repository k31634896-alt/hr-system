const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- (لوحة التحكم: عدلي الموظفين، اليوزرات، الباسوردات من هنا) ---
let employees = [
    { id: "admin", pass: "admin", name: "مدير النظام", role: "CEO", balance: 30, used: 0 },
    { id: "101", pass: "123", name: "أحمد", role: "Manager", balance: 30, used: 5 },
    { id: "102", pass: "123", name: "سارة", role: "HR", balance: 30, used: 2 }
];

let leaveRequests = [];

const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نظام HR المتكامل</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f0f2f5; padding: 15px; }
        .card { background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 15px; }
        input, button { width: 100%; padding: 12px; margin: 8px 0; border-radius: 10px; border: 1px solid #ddd; }
        button { background: #007bff; color: white; border: none; font-weight: bold; cursor: pointer; }
        .btn-approve { background: #28a745; }
        .btn-reject { background: #dc3545; }
        .print-btn { background: #6c757d; }
    </style>
</head>
<body>
    <div id="loginPage" class="card">
        <h2>تسجيل الدخول</h2>
        <input type="text" id="user" placeholder="اسم المستخدم">
        <input type="password" id="pass" placeholder="كلمة المرور">
        <button onclick="login()">دخول</button>
    </div>

    <div id="appPage" style="display:none;">
        <div class="card"><h2 id="welcome"></h2><button onclick="location.reload()">خروج</button></div>
        <div id="content"></div>
    </div>

    <script>
        let user = null;
        function login() {
            const u = document.getElementById('user').value;
            const p = document.getElementById('pass').value;
            fetch('/api/login', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({u,p})})
            .then(r => r.json()).then(data => {
                if(data.user) { user = data.user; showApp(); } else { alert("بيانات خاطئة"); }
            });
        }
        function showApp() {
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('appPage').style.display = 'block';
            document.getElementById('welcome').innerText = "أهلاً " + user.name;
            loadDashboard();
        }
        function loadDashboard() {
            let html = '<div class="card"><h3>الرصيد المتاح: ' + (user.balance - user.used) + ' يوم</h3></div>';
            if(user.role !== 'CEO') {
                html += '<div class="card"><input type="number" id="d" placeholder="الأيام"><input type="text" id="r" placeholder="السبب"><button onclick="apply()">طلب إجازة</button></div>';
            }
            if(user.role !== 'Employee') {
                html += '<h3>طلبات بانتظار الاعتماد</h3><div id="reqs"></div><button class="print-btn" onclick="window.print()">طباعة التقرير</button>';
            }
            document.getElementById('content').innerHTML = html;
            if(user.role !== 'Employee') fetchReqs();
        }
        function fetchReqs() {
            fetch('/api/reqs').then(r => r.json()).then(data => {
                let rHtml = '';
                data.forEach(r => rHtml += '<div class="card">'+r.name+': '+r.days+' يوم<br><button class="btn-approve" onclick="act('+r.id+',\'مقبول\')">موافقة</button><button class="btn-reject" onclick="act('+r.id+',\'مرفوض\')">رفض</button></div>');
                document.getElementById('reqs').innerHTML = rHtml;
            });
        }
        function apply() { fetch('/api/apply', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id:user.id, name:user.name, days:document.getElementById('d').value, reason:document.getElementById('r').value})}).then(() => alert("تم")); }
        function act(id, s) { fetch('/api/act', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id, s})}).then(() => fetchReqs()); }
    </script>
</body>
</html>
`;

app.get('/', (req, res) => res.send(htmlContent));
app.post('/api/login', (req, res) => res.json({ user: employees.find(e => e.id === req.body.u && e.pass === req.body.p) }));
app.post('/api/apply', (req, res) => { leaveRequests.push({id: Date.now(), ...req.body}); res.json({success: true}); });
app.get('/api/reqs', (req, res) => res.json(leaveRequests));
app.post('/api/act', (req, res) => { leaveRequests = leaveRequests.filter(r => r.id !== req.body.id); res.json({success: true}); });

app.listen(3000);
