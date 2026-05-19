const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 1. قاعدة البيانات المؤقتة (تم الحفاظ عليها وإضافة الحقول الجديدة) ---
let employees = [
    { id: "101", name: "Ahmed", department: "Production", role: "Manager", salary: 10000, housing: 2000, transport: 1000, nationality: "Saudi", leaveBalance: 30 },
    { id: "102", name: "Sara", department: "HR", role: "Employee", salary: 7000, housing: 1500, transport: 500, nationality: "Saudi", leaveBalance: 30 },
    { id: "103", name: "John", department: "Quality", role: "Employee", salary: 8000, housing: 2000, transport: 800, nationality: "Non-Saudi", leaveBalance: 30 }
];

let leaveRequests = [
    { id: 1, employeeId: "103", employeeName: "John", startDate: "2026-05-01", duration: 16, type: "Annual", reason: "Annual Leave", status: "Approved", currentStep: "Completed" }
];

// --- 2. واجهة المستخدم الاحترافية والكاملة (HTML + CSS متجاوب 100% للجوال) ---
const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HR System | نظام الموارد البشرية</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: #2c3e50;
            --accent-color: #3498db;
            --success-color: #2ecc71;
            --danger-color: #e74c3c;
            --bg-color: #f4f6f9;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Cairo', sans-serif; }
        body { background-color: var(--bg-color); color: #333; }
        
        /* شاشة تسجيل الدخول الاحترافية والذكية كالتطبيقات الحديثة */
        .login-container {
            display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px;
            background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%);
        }
        .login-card {
            background: #ffffff; width: 100%; max-width: 420px; padding: 40px 30px; border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2); text-align: center;
        }
        .login-card h2 { color: var(--primary-color); margin-bottom: 25px; font-size: 24px; font-weight: 700; }
        .input-group { margin-bottom: 20px; text-align: right; }
        .input-group label { display: block; margin-bottom: 8px; font-size: 14px; color: #666; font-weight: 600; }
        .input-group input, .input-group select {
            width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 16px;
            transition: all 0.3s ease; outline: none; background: #fafafa;
        }
        .input-group input:focus, .input-group select:focus { border-color: var(--accent-color); background: #fff; }
        .login-btn {
            width: 100%; padding: 15px; background: var(--accent-color); border: none; border-radius: 12px;
            color: white; font-size: 18px; font-weight: 700; cursor: pointer; transition: background 0.3s;
        }
        .login-btn:hover { background: #2980b9; }

        /* الهيكل الرئيسي للنظام والتجاوب مع الجوال */
        .app-container { display: none; padding: 20px; max-width: 1200px; margin: 0 auto; }
        .app-header {
            display: flex; justify-content: space-between; align-items: center; background: white;
            padding: 15px 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 20px;
        }
        .logout-btn { padding: 8px 15px; background: var(--danger-color); color: white; border: none; border-radius: 8px; cursor: pointer; }
        
        .lang-switch {
            padding: 5px 10px; background: #eee; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;
        }

        /* تحويل الجداول إلى بطاقات مرنة للجوال (Responsive Cards) */
        .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
        .data-card {
            background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            border-right: 5px solid var(--accent-color); position: relative;
        }
        .data-card h3 { margin-bottom: 10px; color: var(--primary-color); }
        .data-card p { margin-bottom: 8px; font-size: 15px; color: #555; }
        .data-card .badge {
            display: inline-block; padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: bold;
        }
        .badge-pending { background: #f1c40f; color: #fff; }
        .badge-approved { background: var(--success-color); color: #fff; }
        
        .action-btns { display: flex; gap: 10px; margin-top: 15px; }
        .btn-approve { flex: 1; padding: 10px; background: var(--success-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
        .btn-reject { flex: 1; padding: 10px; background: var(--danger-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }

        /* إخفاء الجداول التقليدية في الشاشات الصغيرة وتنسيقها للكبيرة */
        .table-container { background: white; padding: 20px; border-radius: 15px; overflow-x: auto; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; text-align: right; }
        th, td { padding: 12px 15px; border-bottom: 1px solid #eee; }
        th { background-color: #f8f9fa; color: var(--primary-color); }

        @media (max-width: 768px) {
            .table-container { display: none; } /* إخفاء الجدول في الجوال لعدم الحاجة للمسح يميناً ويساراً */
            .app-header { flex-direction: column; gap: 10px; text-align: center; }
        }
        @media (min-width: 769px) {
            .card-grid-conditional { display: none; } /* عرض الجدول وإخفاء البطاقات في اللابتوب */
        }
    </style>
</head>
<body>

    <div id="loginScreen" class="login-container">
        <div class="login-card">
            <h2 id="loginTitle">تسجيل الدخول | Login</h2>
            <div class="input-group">
                <label id="lblUser">اسم المستخدم أو الرقم الوظيفي</label>
                <input type="text" id="username" placeholder="admin / Employee ID..." required>
            </div>
            <div class="input-group">
                <label id="lblPass">كلمة المرور</label>
                <input type="password" id="password" value="admin" placeholder="••••••••" required>
            </div>
            <button class="login-btn" onclick="handleLogin()" id="btnLogin">دخول</button>
            <button class="lang-switch" style="margin-top:15px;" onclick="toggleLanguage()">English / عربي</button>
        </div>
    </div>

    <div id="appScreen" class="app-container">
        <div class="app-header">
            <div>
                <h2 id="welcomeMsg">أهلاً بك في نظام الموارد البشرية</h2>
                <p id="userRoleDisplay"></p>
            </div>
            <div>
                <button class="lang-switch" onclick="toggleLanguage()">English / عربي</button>
                <button class="logout-btn" onclick="handleLogout()" id="btnLogout">خروج</button>
            </div>
        </div>

        <div id="mainContent"></div>
    </div>

    <script>
        let currentLang = 'ar';
        let currentUser = null;

        const localization = {
            ar: {
                loginTitle: "تسجيل الدخول | نظام HR", lblUser: "اسم المستخدم أو الرقم الوظيفي", lblPass: "كلمة المرور", btnLogin: "دخول",
                welcome: "أهلاً بك، ", logout: "خروج", requestLeave: "طلب إجازة جديدة", duration: "المدة (أيام)", reason: "السبب",
                submit: "إرسال الطلب", myRequests: "طلباتي السابقة", pendingApprovals: "طلبات تنتظر موافقتك", nationality: "الجنسية",
                saudi: "سعودي", nonSaudi: "غير سعودي", calcSalary: "حسبة راتب الإجازة المتوقع", gosiCut: "استقطاع التأمينات (GOSI): ",
                netLeaveSalary: "صافي راتب الإجازة: "
            },
            en: {
                loginTitle: "Login | HR System", lblUser: "Username or Employee ID", lblPass: "Password", btnLogin: "Login",
                welcome: "Welcome, ", logout: "Logout", requestLeave: "Request New Leave", duration: "Duration (Days)", reason: "Reason",
                submit: "Submit Request", myRequests: "My Previous Requests", pendingApprovals: "Pending Your Approval", nationality: "Nationality",
                saudi: "Saudi", nonSaudi: "Non-Saudi", calcSalary: "Expected Leave Salary Calc", gosiCut: "GOSI Deduction: ",
                netLeaveSalary: "Net Leave Salary: "
            }
        };

        function toggleLanguage() {
            currentLang = currentLang === 'ar' ? 'en' : 'ar';
            document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = currentLang;
            updateLanguageDOM();
        }

        function updateLanguageDOM() {
            const loc = localization[currentLang];
            document.getElementById('loginTitle').innerText = loc.loginTitle;
            document.getElementById('lblUser').innerText = loc.lblUser;
            document.getElementById('lblPass').innerText = loc.lblPass;
            document.getElementById('btnLogin').innerText = loc.btnLogin;
            document.getElementById('btnLogout').innerText = loc.logout;
        }

        function handleLogin() {
            const userVal = document.getElementById('username').value.trim();
            
            // محاكاة تسجيل الدخول والتعرف على الدور والبيانات
            if(userVal === 'admin') {
                currentUser = { id: "admin", name: "Admin Manager", department: "Management", role: "CEO", nationality: "Saudi" };
            } else {
                // البحث في الموظفين إذا أدخل رقم وظيفي
                fetch('/api/employees/' + userVal)
                .then(res => res.json())
                .then(data => {
                    if(data.success) {
                        currentUser = data.employee;
                        showDashboard();
                    } else {
                        alert(currentLang === 'ar' ? "المستخدم غير موجود" : "User not found");
                    }
                });
                return;
            }
            showDashboard();
        }

        function showDashboard() {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('appScreen').style.display = 'block';
            document.getElementById('welcomeMsg').innerText = localization[currentLang].welcome + currentUser.name;
            document.getElementById('userRoleDisplay').innerText = \`Role: \${currentUser.role} | Dept: \${currentUser.department}\`;
            
            loadDynamicContent();
        }

        function loadDynamicContent() {
            let contentHtml = '';
            const loc = localization[currentLang];

            // 1. إذا كان الداخل موظفاً (يرى واجهة تقديم الإجازة وبطاقات تاريخية متجاوبة للجوال)
            if(currentUser.role === 'Employee') {
                contentHtml += \`
                    <div class="data-card" style="margin-bottom:20px;">
                        <h3>\${loc.requestLeave}</h3>
                        <div class="input-group" style="margin-top:15px;">
                            <label>\${loc.duration}</label>
                            <input type="number" id="leaveDuration" min="1" max="30" value="25" oninput="calculateLiveSalary()">
                        </div>
                        <div class="input-group">
                            <label>\${loc.reason}</label>
                            <input type="text" id="leaveReason" value="سنوية">
                        </div>
                        <div id="salaryCalcBox" style="background:#f8f9fa; padding:15px; border-radius:8px; margin-bottom:15px; font-weight:bold; color:var(--primary-color);">
                            </div>
                        <button class="login-btn" onclick="submitLeaveRequest()">\${loc.submit}</button>
                    </div>
                    
                    <h3>\${loc.myRequests}</h3>
                    <div id="myRequestsMobile" class="card-grid"></div>
                \`;
                setTimeout(() => { calculateLiveSalary(); loadMyRequests(); }, 100);
            } 
            // 2. إذا كان المدراء أو الاتش ار (تظهر طلبات الموافقة المرنة للجوال كبطاقات واضحة)
            else {
                contentHtml += \`
                    <h3>\${loc.pendingApprovals}</h3>
                    <div id="approvalsMobile" class="card-grid"></div>
                \`;
                setTimeout(() => { loadPendingApprovals(); }, 100);
            }

            document.getElementById('mainContent').innerHTML = contentHtml;
        }

        // الحسبة المالية النسبية للتأمينات الاجتماعية (GOSI) للسعوديين فقط بشرط 25 يوماً فأكثر
        function calculateLiveSalary() {
            const days = parseInt(document.getElementById('leaveDuration').value) || 0;
            const loc = localization[currentLang];
            
            // جلب تفاصيل راتب الموظف الحالي (محاكاة أو من بياناته الثابتة)
            let basic = currentUser.salary || 7000;
            let housing = currentUser.housing || 1500;
            let transport = currentUser.transport || 500;
            
            // الحسبة اليومية الفعلية (النسبية Pro-rata)
            let dailyBasicAndHousing = (basic + housing) / 30;
            let totalLeaveBase = dailyBasicAndHousing * days;
            
            let gosiDeduction = 0;
            // الشرط: سعودي والإجازة مستمرة 25 يوماً وأكثر
            if (currentUser.nationality === 'Saudi' && days >= 25) {
                gosiDeduction = totalLeaveBase * 0.0975;
            }

            let netLeaveSalary = (totalLeaveBase + ((transport/30) * days)) - gosiDeduction;

            document.getElementById('salaryCalcBox').innerHTML = \`
                <div>\${loc.calcSalary} (\${days} يوم/Days):</div>
                <div style="font-size:14px; color:#555; margin-top:5px;">
                    \${loc.gosiCut} \${gosiDeduction.toFixed(2)} ريال <br>
                    \${loc.netLeaveSalary} \${netLeaveSalary.toFixed(2)} ريال
                </div>
            \`;
        }

        function submitLeaveRequest() {
            const days = document.getElementById('leaveDuration').value;
            const reason = document.getElementById('leaveReason').value;

            fetch('/api/leaves/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId: currentUser.id, duration: parseInt(days), reason: reason })
            })
            .then(res => res.json())
            .then(data => {
                alert(currentLang === 'ar' ? "تم إرسال الطلب بنجاح والمسار فعال تلقائياً" : "Request sent successfully");
                loadMyRequests();
            });
        }

        function loadMyRequests() {
            fetch('/api/leaves/my-requests/' + currentUser.id)
            .then(res => res.json())
            .then(data => {
                let html = '';
                data.requests.forEach(req => {
                    html += \`
                        <div class="data-card">
                            <h3>طلب إجازة #\${req.id}</h3>
                            <p><b>المدة:</b> \${req.duration} يوم</p>
                            <p><b>السبب:</b> \${req.reason}</p>
                            <p><b>الحالة الإدارية الحالية:</b> <span class="badge badge-pending">\${req.status} (\${req.currentStep})</span></p>
                        </div>
                    \`;
                });
                document.getElementById('myRequestsMobile').innerHTML = html || '<p>لا توجد طلبات حالية</p>';
            });
        }

        function loadPendingApprovals() {
            fetch('/api/leaves/pending/' + currentUser.role + '/' + currentUser.id)
            .then(res => res.json())
            .then(data => {
                let html = '';
                data.requests.forEach(req => {
                    html += \`
                        <div class="data-card" style="border-right-color: #f1c40f;">
                            <h3>طلب من الموظف: \${req.employeeName}</h3>
                            <p><b>رقم الموظف:</b> \${req.employeeId}</p>
                            <p><b>المدة المطلوبة:</b> \${req.duration} يوم</p>
                            <p><b>السبب:</b> \${req.reason}</p>
                            <p><b>مرحلة الاعتماد الحالية:</b> \${req.currentStep}</p>
                            <div class="action-btns">
                                <button class="btn-approve" onclick="actionRequest(\${req.id}, 'Approve')">موافقة / Approve</button>
                                <button class="btn-reject" onclick="actionRequest(\${req.id}, 'Reject')">رفض / Reject</button>
                            </div>
                        </div>
                    \`;
                });
                document.getElementById('approvalsMobile').innerHTML = html || '<p>لا توجد طلبات معلقة بانتظار موافقتك حالياً</p>';
            });
        }

        function actionRequest(id, action) {
            fetch('/api/leaves/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId: id, userRole: currentUser.role, action: action, userId: currentUser.id })
            })
            .then(res => res.json())
            .then(data => {
                alert(action === 'Approve' ? "تمت الموافقة وتمرير الطلب للمرحلة التالية" : "تم رفض الطلب");
                loadPendingApprovals();
            });
        }

        function handleLogout() {
            currentUser = null;
            document.getElementById('appScreen').style.display = 'none';
            document.getElementById('loginScreen').style.display = 'flex';
        }
    </script>
</body>
</html>
`;

// --- 3. المسارات البرمجية الذكية (API Routes) لمعالجة الطلبات بدون تداخل ---

app.get('/', (req, res) => {
    res.send(htmlContent);
});

app.get('/api/employees/:id', (req, res) => {
    const emp = employees.find(e => e.id === req.id || e.id === req.params.id);
    if(emp) res.json({ success: true, employee: emp });
    else res.json({ success: false });
});

// استقبال طلب إجازة جديد وتحديد مساره الأولي
app.post('/api/leaves/request', (req, res) => {
    const { employeeId, duration, reason } = req.body;
    const emp = employees.find(e => e.id === employeeId);
    
    // بناء المسار التلقائي: إذا كان مقدم الطلب مديراً يختلف مساره عن الموظف العادي
    let nextStep = "Direct Manager"; 
    if(emp && emp.role === 'Manager') {
        nextStep = "HR Employee Review"; // مدير القسم يذهب مباشرة للـ HR لتنتهي عند الـ CEO
    }

    const newRequest = {
        id: leaveRequests.length + 1,
        employeeId: employeeId,
        employeeName: emp ? emp.name : "Unknown",
        duration: duration,
        reason: reason,
        status: "Pending",
        currentStep: nextStep
    };
    leaveRequests.push(newRequest);
    res.json({ success: true });
});

// جلب طلبات الموظف الخاصة به
app.get('/api/leaves/my-requests/:empId', (req, res) => {
    const filtered = leaveRequests.filter(r => r.employeeId === req.params.empId);
    res.json({ requests: filtered });
});

// فلترة وعرض الطلبات بناءً على الصلاحية والمستوى الإداري بدقة
app.get('/api/leaves/pending/:role/:userId', (req, res) => {
    const { role, userId } = req.params;
    let pending = [];

    if(role === 'Manager') {
        // المدير المباشر يرى طلبات الموظفين العاديين في مرحلته الأولى
        pending = leaveRequests.filter(r => r.currentStep === 'Direct Manager');
    } else if(role === 'Employee' && userId === '102') { 
        // محاكاة موظف الاتش ار (سارة مثلاً) ترى التدقيق المالي للموظفين والمدراء
        pending = leaveRequests.filter(r => r.currentStep === 'HR Employee Review');
    } else if(role === 'CEO') {
        // الرئيس التنفيذي يرى فقط طلبات مدراء الأقسام المرفوعة له بعد اعتماد الـ HR
        pending = leaveRequests.filter(r => r.currentStep === 'CEO Approval');
    }

    res.json({ requests: pending });
});

// مصفوفة الصلاحيات والانتقال الذكي (Approval Workflow Logic)
app.post('/api/leaves/action', (req, res) => {
    const { requestId, userRole, action } = req.body;
    let reqObj = leaveRequests.find(r => r.id === requestId);

    if(!reqObj) return res.json({ success: false });

    if(action === 'Reject') {
        reqObj.status = "Rejected";
        reqObj.currentStep = "Closed";
    } else {
        // معالجة الانتقال عند الموافقة (Approve)
        if(reqObj.currentStep === 'Direct Manager') {
            reqObj.currentStep = "HR Employee Review";
        } else if(reqObj.currentStep === 'HR Employee Review') {
            // فحص نوع مقدم الطلب لمعرفة المحطة القادمة
            const emp = employees.find(e => e.id === reqObj.employeeId);
            if(emp && emp.role === 'Manager') {
                reqObj.currentStep = "CEO Approval"; // يرفع للـ CEO لأنه مدير قسم
            } else {
                reqObj.status = "Approved";
                reqObj.currentStep = "Completed"; // ينتهي عند الـ HR للموظف العادي
            }
        } else if(reqObj.currentStep === 'CEO Approval') {
            reqObj.status = "Approved";
            reqObj.currentStep = "Completed";
        }
    }
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`System running smoothly on port ${port}`);
});
