const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// إعدادات الجلسة والبيانات
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'hr-secret-key',
    resave: false,
    saveUninitialized: true
}));

// بيانات الموظفين الافتراضية والرواتب
let departments = [
    { id: 1, nameAr: "الموارد البشرية", nameEn: "Human Resources" },
    { id: 2, nameAr: "التسويق", nameEn: "Marketing" },
    { id: 3, nameAr: "تقنية المعلومات", nameEn: "Information Technology" }
];

let users = [
    {
        id: 1,
        nameAr: "المدير العام",
        nameEn: "Admin User",
        email: "admin@hr.com",
        password: "admin", // كلمة المرور أصبحت مباشرة وسهلة جداً
        role: "admin",
        departmentAr: "الإدارة",
        departmentEn: "Management",
        baseInitialBalance: 30,
        usedBalance: 0
    }
];

let leaves = [];
let payrolls = [];

// شاشات واجهة المستخدم (HTML المستقل بدون ملفات خارجية)
const loginHTML = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>نظام الموارد البشرية - تسجيل الدخول</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .login-card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
        h2 { color: #2c3e50; margin-bottom: 25px; }
        input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; font-size: 16px; }
        button { width: 100%; padding: 12px; background-color: #3498db; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; transition: 0.3s; }
        button:hover { background-color: #2980b9; }
        .error { color: #e74c3c; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="login-card">
        <h2>تسجيل الدخول للنظام</h2>
        <form action="/login" method="POST">
            <input type="email" name="email" placeholder="البريد الإلكتروني" required>
            <input type="password" name="password" placeholder="كلمة المرور" required>
            <button type="submit">دخول</button>
        </form>
    </div>
</body>
</html>`;

const dashboardHTML = (user, usersList, leavesList, payrollsList) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>لوحة التحكم - إدارة الموارد البشرية</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 0; background-color: #f8f9fa; color: #333; }
        .navbar { background-color: #2c3e50; color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; }
        .navbar h1 { margin: 0; font-size: 20px; }
        .logout-btn { background-color: #e74c3c; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; }
        .container { padding: 30px; max-width: 1200px; margin: 0 auto; }
        .card { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 30px; }
        h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 12px; text-align: right; border-bottom: 1px solid #ddd; }
        th { background-color: #f1f2f6; color: #2c3e50; }
        .form-group { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px; }
        input, select, button { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
        button.submit-btn { background-color: #2ecc71; color: white; border: none; cursor: pointer; font-weight: bold; }
        button.submit-btn:hover { background-color: #27ae60; }
        .badge { padding: 5px 10px; border-radius: 4px; font-size: 12px; color: white; }
        .badge-success { background-color: #2ecc71; }
        .badge-pending { background-color: #f1c40f; }
    </style>
</head>
<body>
    <div class="navbar">
        <h1>نظام الموارد البشرية المتكامل 💼</h1>
        <div>
            <span>مرحباً، ${user.nameAr} (${user.role === 'admin' ? 'مدير' : 'موظف'})</span> | 
            <a href="/logout" class="logout-btn">تسجيل الخروج</a>
        </div>
    </div>
    <div class="container">
        
        ${user.role === 'admin' ? `
        <div class="card">
            <h2>➕ إضافة موظف جديد</h2>
            <form action="/add-user" method="POST" class="form-group">
                <input type="text" name="newNameAr" placeholder="الاسم بالكامل (عربي)" required>
                <input type="text" name="newNameEn" placeholder="الاسم (إنجليزي)" required>
                <input type="email" name="newEmail" placeholder="البريد الإلكتروني" required>
                <input type="password" name="newPassword" placeholder="كلمة المرور" required>
                <select name="userRole">
                    <option value="employee">موظف عادي</option>
                    <option value="admin">مدير نظام</option>
                </select>
                <select name="deptId">
                    ${departments.map(d => `<option value="${d.id}">${d.nameAr}</option>`).join('')}
                </select>
                <button type="submit" class="submit-btn">حفظ الموظف</button>
            </form>
        </div>

        <div class="card">
            <h2>👥 قائمة الموظفين المسجلين</h2>
            <table>
                <tr>
                    <th>الاسم</th>
                    <th>البريد الإلكتروني</th>
                    <th>القسم</th>
                    <th>الدور</th>
                    <th>رصيد الإجازات المتبقي</th>
                    <th>الإجراءات</th>
                </tr>
                ${usersList.map(u => `
                <tr>
                    <td>${u.nameAr}</td>
                    <td>${u.email}</td>
                    <td>${u.departmentAr}</td>
                    <td>${u.role === 'admin' ? 'مدير' : 'موظف'}</td>
                    <td>${u.baseInitialBalance - u.usedBalance} يوم</td>
                    <td><a href="/delete-user/${u.id}" style="color:red; text-decoration:none;">حذف</a></td>
                </tr>
                `).join('')}
            </table>
        </div>
        ` : ''}

        <div class="card">
            <h2>🌴 رصيد إجازاتك الحالي: ${user.baseInitialBalance - user.usedBalance} يوم</h2>
            <h3>تقديم طلب إجازة جديد</h3>
            <form action="/request-leave" method="POST" class="form-group">
                <input type="date" name="startDate" required>
                <input type="number" name="days" placeholder="عدد الأيام المطلوبة" min="1" required>
                <select name="leaveType">
                    <option value="سنوية">إجازة سنوية</option>
                    <option value="مرضية">إجازة مرضية</option>
                    <option value="اضطرارية">إجازة اضطرارية</option>
                </select>
                <button type="submit" class="submit-btn" style="background-color: #3498db;">تقديم الطلب</button>
            </form>
        </div>

        <div class="card">
            <h2>📜 سجل طلبات الإجازات</h2>
            <table>
                <tr>
                    <th>الموظف</th>
                    <th>تاريخ البدء</th>
                    <th>المدة</th>
                    <th>النوع</th>
                    <th>الحالة</th>
                    ${user.role === 'admin' ? '<th>التحكم</th>' : ''}
                </tr>
                ${leavesList.map(l => `
                <tr>
                    <td>${l.userName}</td>
                    <td>${l.startDate}</td>
                    <td>${l.days} يوم</td>
                    <td>${l.type}</td>
                    <td><span class="badge ${l.status === 'مقبولة' ? 'badge-success' : 'badge-pending'}">${l.status}</span></td>
                    ${user.role === 'admin' && l.status === 'قيد الانتظار' ? `
                        <td>
                            <a href="/approve-leave/${l.id}" style="color:green; text-decoration:none; margin-left:10px;">قبول</a>
                            <a href="/reject-leave/${l.id}" style="color:red; text-decoration:none;">رفض</a>
                        </td>
                    ` : user.role === 'admin' ? '<td>-</td>' : ''}
                </tr>
                `).join('')}
            </table>
        </div>

        <div class="card">
            <h2>💰 نظام مسير الرواتب والأجور</h2>
            ${user.role === 'admin' ? `
            <h3>إصدار راتب جديد للشهر الحالي</h3>
            <form action="/create-payroll" method="POST" class="form-group">
                <select name="userId">
                    ${usersList.map(u => `<option value="${u.id}">${u.nameAr}</option>`).join('')}
                </select>
                <input type="number" name="basicSalary" placeholder="الراتب الأساسي" required>
                <input type="number" name="allowances" placeholder="البدلات" value="0">
                <input type="number" name="deductions" placeholder="الخصومات" value="0">
                <button type="submit" class="submit-btn" style="background-color: #9b59b6;">إصدار وإيداع</button>
            </form>
            ` : ''}

            <table>
                <tr>
                    <th>الموظف</th>
                    <th>الراتب الأساسي</th>
                    <th>البدلات (+)</th>
                    <th>الخصومات (-)</th>
                    <th>صافي الراتب المستلم</th>
                    <th>الحالة</th>
                </tr>
                ${payrollsList.map(p => `
                <tr>
                    <td>${p.userName}</td>
                    <td>${p.basic} ريال</td>
                    <td>${p.allowances} ريال</td>
                    <td>${p.deductions} ريال</td>
                    <td style="font-weight:bold; color:#2c3e50;">${p.net} ريال</td>
                    <td><span class="badge badge-success">تم الإيداع بنجاح ✓</span></td>
                </tr>
                `).join('')}
            </table>
        </div>

    </div>
</body>
</html>`;

// المسارات وإدارة الطلبات (Routes)
app.get('/', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    
    let userLeaves = user.role === 'admin' ? leaves : leaves.filter(l => l.userId === req.session.user.id);
    let userPayrolls = user.role === 'admin' ? payrolls : payrolls.filter(p => p.userId === req.session.user.id);
    
    res.send(dashboardHTML(req.session.user, users, userLeaves, userPayrolls));
});

app.get('/login', (req, res) => {
    res.send(loginHTML);
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const adminUser = users.find(u => u.email === email.trim() && u.password === password.trim());
    
    if (adminUser) {
        req.session.user = adminUser;
        res.redirect('/');
    } else {
        res.send(`<h2 style="text-align:center; margin-top:50px; font-family:sans-serif;">بيانات خاطئة / Invalid Data</h2><p style="text-align:center;"><a href="/login">عودة / Back</a></p>`);
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.post('/add-user', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/login');
    const { newNameAr, newNameEn, newEmail, newPassword, userRole, deptId } = req.body;
    const deptObj = departments.find(d => d.id == deptId);
    users.push({
        id: (users.length + 1),
        nameAr: newNameAr,
        nameEn: newNameEn,
        email: newEmail,
        password: newPassword,
        role: userRole,
        departmentAr: deptObj.nameAr,
        departmentEn: deptObj.nameEn,
        baseInitialBalance: 30,
        usedBalance: 0
    });
    res.redirect('/');
});

app.get('/delete-user/:id', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/login');
    users = users.filter(u => u.id !== parseInt(req.params.id));
    res.redirect('/');
});

app.post('/request-leave', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const { startDate, days, leaveType } = req.body;
    leaves.push({
        id: (leaves.length + 1),
        userId: req.session.user.id,
        userName: req.session.user.nameAr,
        startDate: startDate,
        days: parseInt(days),
        type: leaveType,
        status: "قيد الانتظار"
    });
    res.redirect('/');
});

app.get('/approve-leave/:id', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/login');
    const leave = leaves.find(l => l.id === parseInt(req.params.id));
    if (leave) {
        leave.status = 'مقبولة';
        const targetUser = users.find(u => u.id === leave.userId);
        if (targetUser) targetUser.usedBalance += leave.days;
    }
    res.redirect('/');
});

app.get('/reject-leave/:id', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/login');
    const leave = leaves.find(l => l.id === parseInt(req.params.id));
    if (leave) leave.status = 'مرفوضة';
    res.redirect('/');
});

app.post('/create-payroll', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/login');
    const { userId, basicSalary, allowances, deductions } = req.body;
    const targetUser = users.find(u => u.id == userId);
    const b = parseInt(basicSalary);
    const a = parseInt(allowances) || 0;
    const d = parseInt(deductions) || 0;
    payrolls.push({
        id: (payrolls.length + 1),
        userId: userId,
        userName: targetUser ? targetUser.nameAr : "موظف مجهول",
        basic: b,
        allowances: a,
        deductions: d,
        net: (b + a - d)
    });
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`/////////////////////////////////////////////////`);
    console.log(`السيرفر جاهز تماماً ويعمل على المنفذ ${PORT} 🚀`);
    console.log(`Available at your primary URL`);
    console.log(`/////////////////////////////////////////////////`);
});
