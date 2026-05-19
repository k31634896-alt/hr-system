const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'erp-hr-ultimate-workflow-2026', resave: false, saveUninitialized: true }));

const SYSTEM_START_DATE = new Date('2026-05-01');

let departments = [
    { ar: 'الموارد البشرية', en: 'Human Resources' },
    { ar: 'المبيعات والتسويق', en: 'Sales & Marketing' },
    { ar: 'الهندسة والتطوير', en: 'Engineering & Development' }
];

let users = [
    { id: '1', nameAr: 'مدير النظام (الأدمن)', nameEn: 'System Administrator', email: 'admin', password: 'admin', role: 'admin', departmentAr: 'إدارة النظام', departmentEn: 'System Admin', baseInitialBalance: 0, usedBalance: 0 },
    { id: '2', nameAr: 'مدير الموارد البشرية: العازمي', nameEn: 'HR Manager: Al-Azmi', email: 'hr_mgr', password: '123', role: 'hr_manager', departmentAr: 'الموارد البشرية', departmentEn: 'Human Resources', baseInitialBalance: 30, usedBalance: 0 },
    { id: '3', nameAr: 'سارة الأحمد (موظف HR)', nameEn: 'Sara Al-Ahmad (HR Staff)', email: 'sara', password: '123', role: 'hr_employee', departmentAr: 'الموارد البشرية', departmentEn: 'Human Resources', baseInitialBalance: 30, usedBalance: 0 },
    { id: '4', nameAr: 'فهد صالح', nameEn: 'Fahad Saleh', email: 'fahad', password: '123', role: 'dept_manager', departmentAr: 'الهندسة والتطوير', departmentEn: 'Engineering & Development', baseInitialBalance: 30, usedBalance: 0 },
    { id: '5', nameAr: 'فاطمة العتيبي', nameEn: 'Fatima Al-Otaibi', email: 'fatima', password: '123', role: 'employee', departmentAr: 'الهندسة والتطوير', departmentEn: 'Engineering & Development', baseInitialBalance: 30, usedBalance: 5 }
];

let leaves = [
    { id: 1, employeeId: '5', nameAr: 'فاطمة العتيبي', nameEn: 'Fatima Al-Otaibi', departmentAr: 'الهندسة والتطوير', departmentEn: 'Engineering & Development', typeAr: 'إجازة سنوية', typeEn: 'Annual Leave', days: 16, reasonAr: 'إجازة سنوية مطولة', reasonEn: 'Extended Annual Leave', finalStatusAr: 'تمت الموافقة النهائية والاعتماد', finalStatusEn: 'Approved & Documented', isManagerOwnRequest: false, rejectReasonAr: '', rejectReasonEn: '', date: '2026-05-19' }
];

const translations = {
    ar: {
        title: 'نظام إدارة الموارد البشرية المتكامل',
        dashboard: 'لوحة الأرصدة والتحكم',
        leaves: 'طلبات الإجازات',
        manage_depts: 'إضافة وإدارة الأقسام',
        add_employee: 'إضافة موظف جديد',
        reports: 'طباعة التقارير وحاسبة الرواتب',
        welcome: 'المستخدم الحالي',
        logout: 'خروج',
        total_bal: 'الرصيد الكلي المتراكم',
        used_bal: 'الأيام المستهلكة',
        avail_bal: 'الرصيد المتاح حالياً',
        admin_settings: 'إعدادات لوحة التحكم لمدير النظام (الأدمن)',
        admin_name_ar: 'اسم الحساب (بالعربي):',
        admin_name_en: 'اسم الحساب (بالإنجليزي):',
        username: 'اليوزر (اسم المستخدم):',
        password: 'كلمة المرور (الباسورد):',
        save: '✓ حفظ وإعتماد البيانات',
        emp_management: 'الإدارة المباشرة للموظفين وتعيين الصلاحيات بالفصل الجديد',
        th_name: 'اسم الموظف',
        th_dept: 'القسم',
        th_role: 'نوع الصلاحية',
        th_user: 'اسم المستخدم',
        th_pass: 'كلمة المرور',
        th_bal: 'الرصيد المتاح',
        th_actions: 'الإجراءات',
        th_type: 'نوع الإجازة',
        th_duration: 'المدة',
        th_reason: 'السبب',
        th_status: 'الحالة',
        th_reject_reason: 'سبب الرفض',
        th_date: 'تاريخ الإجازة',
        delete: 'حذف',
        placeholder_name_ar: 'الاسم بالعربية',
        placeholder_name_en: 'الاسم بالإنجليزية',
        role_employee: 'موظف عادي',
        role_manager: 'المدير المباشر (رئيس القسم)',
        role_hr: 'موظف في قسم (HR)',
        role_hr_manager: 'مدير الموارد البشرية (صاحب الاعتماد النهائي)',
        add_btn: '+ اعتماد الموظف الجديد فوراً',
        dept_title: 'إدارة الأقسام والجهات داخل المنظومة',
        add_dept_title: '+ إضافة قسم / منشأة جديدة',
        dept_name_ar: 'اسم القسم بالعربي:',
        dept_name_en: 'اسم القسم بالإنجليزي:',
        add_dept_btn: 'إضافة القسم فوراً',
        reason_label: 'السبب بالتفصيل:',
        days_label: 'عدد الأيام المطلوبة:',
        leave_type_label: 'اختر نوع الإجازة بدقة:',
        send_leave: 'إرسال الطلب لبدء مسار التمرير',
        reject_prompt: 'فضلاً اكتب سبب رفض هذا الطلب بالتفصيل للشفافية:',
        reject_btn: '✕ رفض',
        approve_step_1: '✓ تمرير للـ HR',
        approve_step_2: '✓ تمرير لمدير الموارد البشرية',
        approve_step_3: '✓ اعتماد نهائي وخصم للأرصدة',
        no_actions: 'لا توجد إجراءات معلقة لك',
        report_head: 'كشف تفصيلي بالإجازات المعتمدة والمستهلكة وحساب البدلات والرواتب',
        select_emp_placeholder: '-- اختر اسم الموظف لإصدار التقرير والرواتب --',
        generate_report_btn: 'إصدار التقرير',
        report_title_print: 'تقرير رصيد الإجازات ومستحقات الرواتب لعام 2026',
        th_days_deducted: 'الأيام المخصومة',
        calc_box_title: 'تعديل الرواتب والبدلات الشهرية (الأساسية):',
        calc_detail_title: 'تفصيل مستحقات الإجازة لـ',
        lbl_calc_base: '• مستحق الراتب الأساسي:',
        lbl_calc_housing: '• مستحق بدل السكن:',
        lbl_calc_trans: '• مستحق بدل المواصلات:',
        lbl_calc_food: '• مستحق بدل الطعام:',
        lbl_calc_total: 'إجمالي راتب الإجازة:',
        print_btn_text: 'ابدأ طباعة التقرير فوراً',
        no_leaves_msg: 'لا توجد إجازات معتمدة ومخصومة مسجلة لهذا الموظف',
        salary_less_15_msg: 'أيام فردية أقل من 15 يوماً (لا يحسب لها راتب مقدم)',
        ph_base: 'الراتب الأساسي',
        ph_housing: 'بدل السكن',
        ph_trans: 'بدل مواصلات',
        ph_food: 'بدل طعام',
        history_title: 'سجل تواريخ الإجازات المعتمدة وتفاصيل الرواتب'
    },
    en: {
        title: 'Integrated HR Management System',
        dashboard: 'Balances & Dashboard',
        leaves: 'Leave Requests',
        manage_depts: 'Manage Departments',
        add_employee: 'Add New Employee',
        reports: 'Print Reports & Salary Calc',
        welcome: 'Current User',
        logout: 'Logout',
        total_bal: 'Total Accumulated Balance',
        used_bal: 'Used Days',
        avail_bal: 'Current Available Balance',
        admin_settings: 'System Administrator Account Settings',
        admin_name_ar: 'Account Name (Arabic):',
        admin_name_en: 'Account Name (English):',
        username: 'Username (Login):',
        password: 'Password:',
        save: '✓ Save and Approve Data',
        emp_management: 'Employee Management & Role Assignment',
        th_name: 'Employee Name',
        th_dept: 'Department',
        th_role: 'Role Type',
        th_user: 'Username',
        th_pass: 'Password',
        th_bal: 'Available Balance',
        th_actions: 'Actions',
        th_type: 'Leave Type',
        th_duration: 'Duration',
        th_reason: 'Reason',
        th_status: 'Status',
        th_reject_reason: 'Rejection Reason',
        th_date: 'Leave Date',
        delete: 'Delete',
        placeholder_name_ar: 'Name in Arabic',
        placeholder_name_en: 'Name in English',
        role_employee: 'Regular Employee',
        role_manager: 'Direct Manager (Head of Dept)',
        role_hr: 'HR Department Staff',
        role_hr_manager: 'HR Manager (Final Approver)',
        add_btn: '+ Approve New Employee Immediately',
        dept_title: 'Manage Departments & Entities',
        add_dept_title: '+ Add New Department',
        dept_name_ar: 'Dept Name (Arabic):',
        dept_name_en: 'Dept Name (English):',
        add_dept_btn: 'Add Department Now',
        reason_label: 'Reason in detail:',
        days_label: 'Number of Days Requested:',
        leave_type_label: 'Select Leave Type Accurately:',
        send_leave: 'Send Request to Start Workflow',
        reject_prompt: 'Please enter the reason for rejecting this request:',
        reject_btn: '✕ Reject',
        approve_step_1: '✓ Forward to HR',
        approve_step_2: '✓ Forward to HR Manager',
        approve_step_3: '✓ Final Approve & Deduct',
        no_actions: 'No pending actions for you',
        report_head: 'Detailed statement of approved & used leaves during the current year',
        select_emp_placeholder: '-- Select Employee to Generate Report & Salary --',
        generate_report_btn: 'Generate Report',
        report_title_print: 'Leave Balance & Salary Allowance Report 2026',
        th_days_deducted: 'Deducted Days',
        calc_box_title: 'Modify Monthly Base Salary & Allowances:',
        calc_detail_title: 'Leave Allowance Breakdowns for',
        lbl_calc_base: '• Base Salary Allowance:',
        lbl_calc_housing: '• Housing Allowance:',
        lbl_calc_trans: '• Transport Allowance:',
        lbl_calc_food: '• Food Allowance:',
        lbl_calc_total: 'Total Leave Salary:',
        print_btn_text: 'Start Printing Report Now',
        no_leaves_msg: 'No approved and deducted leaves recorded for this employee',
        salary_less_15_msg: 'Individual days less than 15 days (No advance salary calculated)',
        ph_base: 'Base Salary',
        ph_housing: 'Housing Allowance',
        ph_trans: 'Transport Allowance',
        ph_food: 'Food Allowance',
        history_title: 'Approved Leaves History & Salary Breakdown'
    }
};

const leaveTypesMap = {
    'إجازة سنوية': { ar: 'إجازة سنوية (تخصم من الرصيد)', en: 'Annual Leave (Deducted)' },
    'إجازة اضطرارية': { ar: 'إجازة اضطرارية', en: 'Emergency Leave' },
    'إجازة مرضية': { ar: 'إجازة مرضية', en: 'Sick Leave' },
    'إجازة حج': { ar: 'إجازة حج', en: 'Hajj Leave' },
    'إجازة أمومة': { ar: 'إجازة أمومة', en: 'Maternity Leave' },
    'إجازة أبوة': { ar: 'إجازة أبوة', en: 'Paternity Leave' }
};

function calculateUserBalances(user) {
    if (user.role === 'admin') return { initial: '0.0', used: 0, balance: '0.0' };
    const currentDate = new Date();
    let monthsPassed = (currentDate.getFullYear() - SYSTEM_START_DATE.getFullYear()) * 12 + (currentDate.getMonth() - SYSTEM_START_DATE.getMonth());
    if (monthsPassed < 0) monthsPassed = 0;
    let monthlyAccrual = monthsPassed * 2.5;
    let totalInitial = user.baseInitialBalance + monthlyAccrual;
    let currentBalance = totalInitial - user.usedBalance;
    return { initial: totalInitial.toFixed(1), used: user.usedBalance, balance: currentBalance.toFixed(1) };
}

function generateLayout(user, currentTab, contentHtml, lang = 'ar') {
    let pendingCount = leaves.filter(l => l.finalStatusAr.includes('قيد الانتظار')).length;
    let t = translations[lang];
    let isRtl = lang === 'ar';
    
    return `
    <!DOCTYPE html>
    <html lang="${lang}" dir="${isRtl ? 'rtl' : 'ltr'}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.title}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, sans-serif; }
            .sidebar { background-color: #2c3e50; min-height: 100vh; color: white; position: fixed; width: 280px; z-index: 100; ${isRtl ? 'right: 0;' : 'left: 0;'} }
            .sidebar .nav-link { color: #ecf0f1; padding: 12px; display: flex; align-items: center; text-decoration: none; border-radius: 5px; margin-bottom: 5px; }
            .sidebar .nav-link:hover, .sidebar .nav-link.active { background-color: #1abc9c; color: white; }
            .main-content { margin-${isRtl ? 'right' : 'left'}: 280px; padding: 25px; width: calc(100% - 280px); }
            .card-custom { border-radius: 8px; border: none; box-shadow: 0 2px 10px rgba(0,0,0,0.05); background: white; margin-bottom: 20px; }
            @media (max-width: 768px) { .sidebar { width: 100%; min-height: auto; position: relative; } .main-content { margin: 0; width: 100%; } .d-flex { flex-direction: column; } }
            @media print { .sidebar, .btn, .no-print, form, .alert, .card-custom-header, select, input, .input-group { display: none !important; } .main-content { margin: 0 !important; width: 100% !important; padding: 0; } .print-section { display: block !important; border: none !important; } }
        </style>
    </head>
    <body>
        <div class="d-flex">
            <div class="sidebar p-3 d-flex flex-column no-print">
                <div class="text-center py-3 border-bottom border-secondary mb-3">
                    <h4 class="fw-bold text-warning m-0"><i class="bi bi-shield-lock-fill"></i> نظام المراقبة والأدمن</h4>
                </div>
                <ul class="nav flex-column flex-grow-1">
                    <li class="nav-item"><a href="/" class="nav-link ${currentTab==='dashboard'?'active':''}"><span><i class="bi bi-grid-1x2-fill me-2"></i> ${t.dashboard}</span></a></li>
                    <li class="nav-item"><a href="/leaves" class="nav-link ${currentTab==='leaves'?'active':''}"><span><i class="bi bi-calendar-check-fill me-2"></i> ${t.leaves}</span> <span class="badge bg-danger">${pendingCount}</span></a></li>
                    ${user.role === 'admin' ? `
                        <li class="nav-item"><a href="/departments" class="nav-link ${currentTab==='departments'?'active':''}"><span><i class="bi bi-building me-2"></i> ${t.manage_depts}</span></a></li>
                        <li class="nav-item"><a href="/add-employee" class="nav-link ${currentTab==='add-employee'?'active':''}"><span><i class="bi bi-person-plus-fill me-2"></i> ${t.add_employee}</span></a></li>
                        <li class="nav-item"><a href="/reports" class="nav-link ${currentTab==='reports'?'active':''}"><span><i class="bi bi-printer-fill me-2"></i> ${t.reports}</span></a></li>
                    ` : ''}
                </ul>
            </div>

            <div class="main-content">
                <div class="d-flex justify-content-between align-items-center mb-4 p-3 card-custom bg-white card-custom-header no-print">
                    <h5 class="m-0 fw-bold text-dark"><i class="bi bi-cpu-fill text-primary"></i> ${t.title}</h5>
                    <div class="d-flex align-items-center">
                        <a href="/toggle-lang?redirect=${currentTab}" class="btn btn-outline-secondary btn-sm me-3 fw-bold"><i class="bi bi-translate"></i> ${lang === 'ar' ? 'English' : 'العربية'}</a>
                        <span class="badge bg-light text-dark p-2 fs-6 border border-primary-subtle me-2">
                            <i class="bi bi-person-circle text-primary"></i> ${t.welcome}: ${lang==='ar'? user.nameAr : user.nameEn}
                        </span>
                        <a href="/logout" class="btn btn-danger btn-sm"><i class="bi bi-box-arrow-right"></i> ${t.logout}</a>
                    </div>
                </div>
                ${contentHtml}
            </div>
        </div>
    </body>
    </html>`;
}

app.get('/toggle-lang', (req, res) => {
    req.session.lang = (req.session.lang === 'en') ? 'ar' : 'en';
    const dest = req.query.redirect;
    if (dest === 'departments') return res.redirect('/departments');
    if (dest === 'add-employee') return res.redirect('/add-employee');
    if (dest === 'leaves') return res.redirect('/leaves');
    if (dest === 'reports') return res.redirect('/reports');
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head><meta charset="UTF-8"><title>Login</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"></head>
    <body class="bg-light d-flex align-items-center" style="height: 100vh; background: linear-gradient(135deg, #2c3e50, #1abc9c);">
        <div class="card shadow mx-auto p-4" style="width: 90%; max-width: 400px; border-radius:10px;">
            <h4 class="text-center fw-bold mb-3">بوابة الموارد البشرية الذكية / HR ERP</h4>
            <form method="POST" action="/login">
                <div class="mb-3"><label class="form-label">اسم المستخدم / Username</label><input type="text" name="email" class="form-control" required></div>
                <div class="mb-3"><label class="form-label">كلمة المرور / Password</label><input type="password" name="password" class="form-control" required></div>
                <button type="submit" class="btn btn-primary w-100 fw-bold">Login / دخول</button>
            </form>
        </div>
    </body>
    </html>`);
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const u = users.find(user => user.email === email && user.password === password);
    if (u) { req.session.user = u; req.session.lang = 'ar'; res.redirect('/'); } 
    else { res.send('<div style="text-align:center; margin-top:50px;"><h2>Invalid Data / بيانات خاطئة</h2><a href="/login">Back / عودة</a></div>'); }
});
app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });

// المسار الإصلاحي لمنع ظهور شاشة بيضاء عند العودة غير المعرفة
app.get('/back', (req, res) => { res.redirect('/'); });

app.get('/', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const lang = req.session.lang || 'ar';
    const t = translations[lang];
    const u = users.find(usr => usr.id === req.session.user.id) || req.session.user;
    const balances = calculateUserBalances(u);
    
    let html = '';
    if (u.role !== 'admin') {
        html += `
        <div class="card card-custom p-4">
            <h5 class="fw-bold text-dark mb-4"><i class="bi bi-pie-chart-fill text-primary"></i> ${t.avail_bal}</h5>
            <div class="row g-3 text-center">
                <div class="col-md-4"><div class="p-3 border rounded bg-primary text-white"><h6>${t.total_bal}</h6><h3 class="fw-bold m-0">${balances.initial}</h3></div></div>
                <div class="col-md-4"><div class="p-3 border rounded bg-danger text-white"><h6>${t.used_bal}</h6><h3 class="fw-bold m-0">${balances.used}</h3></div></div>
                <div class="col-md-4"><div class="p-3 border rounded bg-success text-white"><h6>${t.avail_bal}</h6><h3 class="fw-bold m-0">${balances.balance}</h3></div></div>
            </div>
        </div>`;
    } else {
        html += `<div class="alert alert-info fw-bold text-center"><i class="bi bi-info-circle-fill"></i> أنت داخل الآن بحساب "مدير النظام (الأدمن)"؛ يمكنك التحكم الكامل وإصدار التقارير للموظفين والمسؤولين أدناه.</div>`;
    }

    if (u.role === 'admin') {
        html += `
        <div class="card card-custom p-4 border border-warning">
            <h5 class="fw-bold text-warning mb-3"><i class="bi bi-person-gear"></i> ${t.admin_settings}</h5>
            <form method="POST" action="/update-admin-profile" class="row g-3">
                <div class="col-md-3"><label class="form-label small text-muted">${t.admin_name_ar}</label><input type="text" name="adminNameAr" class="form-control form-control-sm" value="${u.nameAr}" required></div>
                <div class="col-md-3"><label class="form-label small text-muted">${t.admin_name_en}</label><input type="text" name="adminNameEn" class="form-control form-control-sm" value="${u.nameEn}" required></div>
                <div class="col-md-3"><label class="form-label small text-muted">${t.username}</label><input type="text" name="adminEmail" class="form-control form-control-sm" value="${u.email}" required></div>
                <div class="col-md-3"><label class="form-label small text-muted">${t.password}</label><input type="text" name="adminPassword" class="form-control form-control-sm" value="${u.password}" required></div>
                <div class="col-12 text-end"><button type="submit" class="btn btn-warning btn-sm fw-bold">${t.save}</button></div>
            </form>
        </div>

        <div class="card card-custom p-4 mt-4">
            <h5 class="fw-bold mb-3 text-danger"><i class="bi bi-people-fill"></i> ${t.emp_management}</h5>
            <div class="table-responsive">
                <table class="table table-bordered text-center align-middle">
                    <thead class="table-light">
                        <tr><th>${t.th_name}</th><th>${t.th_dept}</th><th>${t.th_role}</th><th>${t.th_user}</th><th>${t.th_pass}</th><th>${t.th_bal}</th><th>${t.th_actions}</th></tr>
                    </thead>
                    <tbody>
                        ${users.map(userItem => {
                            const b = calculateUserBalances(userItem);
                            let roleText = t.role_employee;
                            if(userItem.role==='admin') roleText = 'مدير النظام (الأدمن)';
                            if(userItem.role==='hr_manager') roleText = t.role_hr_manager;
                            if(userItem.role==='hr_employee') roleText = t.role_hr;
                            if(userItem.role==='dept_manager') roleText = t.role_manager;
                            return `
                            <tr>
                                <td><b>${lang==='ar'? userItem.nameAr : userItem.nameEn}</b></td>
                                <td><span class="badge bg-light text-dark border">${lang==='ar'? userItem.departmentAr : userItem.departmentEn}</span></td>
                                <td><span class="badge bg-info-subtle text-info border border-info-subtle">${roleText}</span></td>
                                <td><span class="text-primary">${userItem.email}</span></td>
                                <td><code>${userItem.password}</code></td>
                                <td><b class="text-success">${userItem.role==='admin' ? '-' : b.balance}</b></td>
                                <td>
                                    ${userItem.role==='admin' ? '-' : `<a href="/delete-user/${userItem.id}" class="btn btn-sm btn-outline-danger" onclick="return confirm('هل أنت متأكد من الحذف؟')"><i class="bi bi-trash"></i> ${t.delete}</a>`}
                                </td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    }
    res.send(generateLayout(u, 'dashboard', html, lang));
});

app.get('/departments', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/login');
    const lang = req.session.lang || 'ar';
    const t = translations[lang];
    let html = `
    <div class="card card-custom p-4">
        <h5 class="fw-bold mb-3 text-dark"><i class="bi bi-building text-primary"></i> ${t.dept_title}</h5>
        <div class="row">
            <div class="col-md-6">
                <ul class="list-group mb-3">
                    ${departments.map((dept, index) => `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <b>${index + 1}. ${lang==='ar'? dept.ar : dept.en}</b>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="col-md-6">
                <div class="p-3 border rounded bg-light">
                    <h6 class="fw-bold mb-3 text-success">${t.add_dept_title}</h6>
                    <form method="POST" action="/departments/add">
                        <div class="mb-2"><label class="form-label small">${t.dept_name_ar}</label><input type="text" name="deptAr" class="form-control form-control-sm" required></div>
                        <div class="mb-2"><label class="form-label small">${t.dept_name_en}</label><input type="text" name="deptEn" class="form-control form-control-sm" required></div>
                        <button type="submit" class="btn btn-success btn-sm fw-bold w-100">${t.add_dept_btn}</button>
                    </form>
                </div>
            </div>
        </div>
    </div>`;
    res.send(generateLayout(req.session.user, 'departments', html, lang));
});

app.post('/departments/add', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/login');
    if (req.body.deptAr && req.body.deptEn) {
        departments.push({ ar: req.body.deptAr, en: req.body.deptEn });
    }
    res.redirect('/departments');
});

app.get('/add-employee', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/login');
    const lang = req.session.lang || 'ar';
    const t = translations[lang];
    let html = `
    <div class="card card-custom p-4">
        <h5 class="fw-bold text-success mb-4"><i class="bi bi-person-plus-fill"></i> ${t.add_employee}</h5>
        <form method="POST" action="/add-user" class="row g-3">
            <div class="col-md-6"><label class="form-label small fw-bold">${t.placeholder_name_ar}</label><input type="text" name="newNameAr" class="form-control" required></div>
            <div class="col-md-6"><label class="form-label small fw-bold">${t.placeholder_name_en}</label><input type="text" name="newNameEn" class="form-control" required></div>
            <div class="col-md-6">
                <label class="form-label small fw-bold">${t.th_dept}</label>
                <select name="userDeptIndex" class="form-select" required>
                    ${departments.map((d, idx) => `<option value="${idx}">${lang==='ar'? d.ar : d.en}</option>`).join('')}
                </select>
            </div>
            <div class="col-md-6">
                <label class="form-label small fw-bold">${t.th_role}</label>
                <select name="userRole" class="form-select" required>
                    <option value="employee">${t.role_employee}</option>
                    <option value="dept_manager">${t.role_manager}</option>
                    <option value="hr_employee">${t.role_hr}</option>
                    <option value="hr_manager">${t.role_hr_manager}</option>
                </select>
            </div>
            <div class="col-md-6"><label class="form-label small fw-bold">${t.th_user}</label><input type="text" name="newEmail" class="form-control" required></div>
            <div class="col-md-6"><label class="form-label small fw-bold">${t.th_pass}</label><input type="text" name="newPassword" class="form-control" required></div>
            <div class="col-12 mt-4"><button type="submit" class="btn btn-success fw-bold w-100">${t.add_btn}</button></div>
        </form>
    </div>`;
    res.send(generateLayout(req.session.user, 'add-employee', html, lang));
});

app.get('/leaves', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const lang = req.session.lang || 'ar';
    const t = translations[lang];
    const user = users.find(u => u.id === req.session.user.id) || req.session.user;
    
    let visibleLeaves = leaves;
    if (user.role === 'employee') {
        visibleLeaves = leaves.filter(l => l.employeeId === user.id);
    } else if (user.role === 'dept_manager') {
        visibleLeaves = leaves.filter(l => l.departmentAr === user.departmentAr || l.employeeId === user.id);
    } else if (user.role === 'hr_employee' || user.role === 'hr_manager') {
        visibleLeaves = leaves;
    }

    let html = `
    <div class="card card-custom p-4">
        <h5 class="fw-bold mb-3"><i class="bi bi-journal-text text-primary"></i> ${t.leaves}</h5>
        <div class="table-responsive">
            <table class="table table-bordered align-middle text-center">
                <thead class="table-light">
                    <tr>
                        <th>${t.th_name}</th>
                        <th>${t.th_dept}</th>
                        <th>${t.th_type}</th>
                        <th>${t.th_duration}</th>
                        <th>${t.th_reason}</th>
                        <th>${t.th_status}</th>
                        <th>${t.th_reject_reason}</th>
                        <th>${t.th_actions}</th>
                    </tr>
                </thead>
                <tbody>
                    ${visibleLeaves.map(l => {
                        let actionsHtml = `<span class="text-muted small">${t.no_actions}</span>`;
                        
                        if (user.role === 'dept_manager' && l.finalStatusAr === 'قيد الانتظار - موافقة المدير المباشر' && l.departmentAr === user.departmentAr && !l.isManagerOwnRequest) {
                            actionsHtml = `<a href="/action/approve-step/${l.id}" class="btn btn-sm btn-success fw-bold p-1">${t.approve_step_1}</a> <button onclick="triggerReject(${l.id})" class="btn btn-sm btn-danger fw-bold p-1">${t.reject_btn}</button>`;
                        }
                        if (user.role === 'hr_employee' && l.finalStatusAr === 'قيد الانتظار - مراجعة موظف HR') {
                            actionsHtml = `<a href="/action/approve-step/${l.id}" class="btn btn-sm btn-info text-white fw-bold p-1">${t.approve_step_2}</a> <button onclick="triggerReject(${l.id})" class="btn btn-sm btn-danger fw-bold p-1">${t.reject_btn}</button>`;
                        }
                        if (user.role === 'hr_manager' && l.finalStatusAr === 'قيد الانتظار - الاعتماد النهائي من مدير الموارد البشرية') {
                            actionsHtml = `<a href="/action/approve-step/${l.id}" class="btn btn-sm btn-success fw-bold p-1">${t.approve_step_3}</a> <button onclick="triggerReject(${l.id})" class="btn btn-sm btn-danger fw-bold p-1">${t.reject_btn}</button>`;
                        }

                        return `
                        <tr>
                            <td><b>${lang==='ar'? l.nameAr : l.nameEn}</b></td>
                            <td>${lang==='ar'? l.departmentAr : l.departmentEn}</td>
                            <td>${lang==='ar'? l.typeAr : l.typeEn}</td>
                            <td>${l.days} يوم</td>
                            <td>${lang==='ar'? l.reasonAr : l.reasonEn}</td>
                            <td><span class="badge bg-warning text-dark">${lang==='ar'? l.finalStatusAr : l.finalStatusEn}</span></td>
                            <td><span class="text-danger small">${(lang==='ar'? l.rejectReasonAr : l.rejectReasonEn) || '-'}</span></td>
                            <td>${actionsHtml}</td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <script>
            function triggerReject(id) {
                let reason = prompt("${t.reject_prompt}");
                if (reason) window.location.href = "/action/reject-step/" + id + "?reason=" + encodeURIComponent(reason);
            }
        </script>

        ${user.role !== 'admin' ? `
        <div class="mt-4 border-top pt-3 no-print" style="max-width: 500px;">
            <h6 class="fw-bold text-primary mb-3"><i class="bi bi-plus-circle"></i> تقديم طلب إجازة جديد لحسابك:</h6>
            <form method="POST" action="/request-leave">
                <div class="mb-2">
                    <label class="form-label small text-muted">${t.leave_type_label}</label>
                    <select name="typeKey" class="form-select" required>
                        ${Object.keys(leaveTypesMap).map(k => `<option value="${k}">${lang==='ar'? leaveTypesMap[k].ar : leaveTypesMap[k].en}</option>`).join('')}
                    </select>
                </div>
                <div class="mb-2"><label class="form-label small text-muted">${t.days_label}</label><input type="number" name="days" class="form-control" required></div>
                <div class="mb-2"><label class="form-label small text-muted">${t.reason_label}</label><input type="text" name="reason" class="form-control" required></div>
                <button type="submit" class="btn btn-primary w-100 fw-bold">${t.send_leave}</button>
            </form>
        </div>` : ''}
    </div>`;
    res.send(generateLayout(user, 'leaves', html, lang));
});

app.post('/request-leave', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const user = users.find(u => u.id === req.session.user.id) || req.session.user;
    const typeKey = req.body.typeKey;
    
    let initialStatusAr = 'قيد الانتظار - موافقة المدير المباشر';
    let initialStatusEn = 'Pending - Direct Manager Approval';
    let isManagerOwn = false;

    if (user.role === 'dept_manager' || user.role === 'hr_manager') {
        initialStatusAr = 'قيد الانتظار - مراجعة موظف HR';
        initialStatusEn = 'Pending - HR Review';
        isManagerOwn = true;
    }

    leaves.push({
        id: leaves.length + 1,
        employeeId: user.id,
        nameAr: user.nameAr,
        nameEn: user.nameEn,
        departmentAr: user.departmentAr,
        departmentEn: user.departmentEn,
        typeAr: typeKey,
        typeEn: leaveTypesMap[typeKey].en,
        days: parseInt(req.body.days),
        reasonAr: req.body.reason,
        reasonEn: req.body.reason,
        finalStatusAr: initialStatusAr,
        finalStatusEn: initialStatusEn,
        isManagerOwnRequest: isManagerOwn,
        rejectReasonAr: '',
        rejectReasonEn: '',
        date: new Date().toISOString().split('T')[0]
    });
    res.redirect('/leaves');
});

app.get('/action/approve-step/:id', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const leave = leaves.find(l => l.id == req.params.id);
    if (leave) {
        if (leave.finalStatusAr === 'قيد الانتظار - موافقة المدير المباشر') {
            leave.finalStatusAr = 'قيد الانتظار - مراجعة موظف HR';
            leave.finalStatusEn = 'Pending - HR Review';
        } else if (leave.finalStatusAr === 'قيد الانتظار - مراجعة موظف HR') {
            leave.finalStatusAr = 'قيد الانتظار - الاعتماد النهائي من مدير الموارد البشرية';
            leave.finalStatusEn = 'Pending - HR Manager Final Approval';
        } else if (leave.finalStatusAr === 'قيد الانتظار - الاعتماد النهائي من مدير الموارد البشرية') {
            leave.finalStatusAr = 'تمت الموافقة النهائية والاعتماد';
            leave.finalStatusEn = 'Approved & Documented';
            const u = users.find(usr => usr.id === leave.employeeId);
            if (u && leave.typeAr === 'إجازة سنوية') u.usedBalance += leave.days;
        }
    }
    res.redirect('/leaves');
});

app.get('/action/reject-step/:id', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const leave = leaves.find(l => l.id == req.params.id);
    const reason = req.query.reason || 'Rejected';
    if (leave) {
        leave.finalStatusAr = 'مرفوض كلياً';
        leave.finalStatusEn = 'Rejected Completely';
        leave.rejectReasonAr = reason;
        leave.rejectReasonEn = reason;
    }
    res.redirect('/leaves');
});

app.get('/reports', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/login');
    const lang = req.session.lang || 'ar';
    const t = translations[lang];
    const selectedUserId = req.query.userId;
    let reportHtml = '';

    if (selectedUserId) {
        const selectedUser = users.find(u => u.id === selectedUserId);
        if (selectedUser) {
            const b = calculateUserBalances(selectedUser);
            const approvedLeaves = leaves.filter(l => l.employeeId === selectedUser.id && l.finalStatusAr === 'تمت الموافقة النهائية والاعتماد');
            
            reportHtml = `
            <div class="mt-4 p-4 border border-dark rounded bg-white print-section">
                <div class="text-center mb-4">
                    <h3 class="fw-bold">${t.report_title_print}</h3>
                    <p class="text-muted small">${t.report_head}</p>
                </div>
                
                <div class="row g-3 mb-4 p-3 bg-light rounded border text-start">
                    <div class="col-md-6"><b>${t.th_name}:</b> ${lang==='ar'? selectedUser.nameAr : selectedUser.nameEn}</div>
                    <div class="col-md-6"><b>${t.th_dept}:</b> ${lang==='ar'? selectedUser.departmentAr : selectedUser.departmentEn}</div>
                    <div class="col-4 mt-3 text-primary"><b>${t.total_bal}:</b> <span class="fs-5 fw-bold">${b.initial}</span></div>
                    <div class="col-4 mt-3 text-danger"><b>${t.used_bal}:</b> <span class="fs-5 fw-bold">${b.used}</span></div>
                    <div class="col-4 mt-3 text-success"><b>${t.avail_bal}:</b> <span class="fs-5 fw-bold">${b.balance}</span></div>
                </div>

                <h6 class="fw-bold text-secondary mb-3"><i class="bi bi-clock-history"></i> ${t.history_title}</h6>
                <div class="table-responsive mb-4">
                    <table class="table table-striped table-bordered text-center align-middle">
                        <thead class="table-dark">
                            <tr>
                                <th>${t.th_date}</th>
                                <th>${t.th_type}</th>
                                <th>${t.th_days_deducted}</th>
                                <th>${t.th_reason}</th>
                                <th style="width: 45%;">${lang==='ar' ? 'حسبة راتب الإجازة التفصيلية (15 يوم وفوق)' : 'Detailed Leave Salary Allowance Breakdown'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${approvedLeaves.length === 0 ? `<tr><td colspan="5" class="text-muted p-3">${t.no_leaves_msg}</td></tr>` : 
                            approvedLeaves.map(l => {
                                const dateObj = new Date(l.date);
                                const formattedDate = lang==='ar' ? dateObj.toLocaleDateString('ar-EG', { year: 'numeric', month: 'numeric', day: 'numeric' }) : dateObj.toLocaleDateString('en-US');
                                
                                let salaryCalculatorHtml = '';
                                if (l.days >= 15) {
                                    salaryCalculatorHtml = `
                                    <div class="p-2 border rounded bg-white text-start no-print mb-2">
                                        <small class="fw-bold text-success d-block mb-1">${t.card_box_title}</small>
                                        <div class="row g-1">
                                            <div class="col-6"><input type="number" id="base-${l.id}" placeholder="${t.ph_base}" class="form-control form-control-sm" oninput="calculateDetailedLeaveSalary(${l.id}, ${l.days})"></div>
                                            <div class="col-6"><input type="number" id="housing-${l.id}" placeholder="${t.ph_housing}" class="form-control form-control-sm" oninput="calculateDetailedLeaveSalary(${l.id}, ${l.days})"></div>
                                            <div class="col-6"><input type="number" id="trans-${l.id}" placeholder="${t.ph_trans}" class="form-control form-control-sm" oninput="calculateDetailedLeaveSalary(${l.id}, ${l.days})"></div>
                                            <div class="col-6"><input type="number" id="food-${l.id}" placeholder="${t.ph_food}" class="form-control form-control-sm" oninput="calculateDetailedLeaveSalary(${l.id}, ${l.days})"></div>
                                        </div>
                                    </div>
                                    
                                    <div class="p-2 border rounded bg-light text-start text-dark shadow-sm">
                                        <div class="small border-bottom pb-1 mb-1 fw-bold text-secondary">${t.calc_detail_title} (${l.days} ${lang==='ar'?'يوم':'Days'}):</div>
                                        <div class="d-flex justify-content-between small"><span>${t.lbl_calc_base}</span> <span><b id="lbl-base-${l.id}">0.00</b> ${lang==='ar'?'ريال':'SAR'}</span></div>
                                        <div class="d-flex justify-content-between small"><span>${t.lbl_calc_housing}</span> <span><b id="lbl-housing-${l.id}">0.00</b> ${lang==='ar'?'ريال':'SAR'}</span></div>
                                        <div class="d-flex justify-content-between small"><span>${t.lbl_calc_trans}</span> <span><b id="lbl-trans-${l.id}">0.00</b> ${lang==='ar'?'ريال':'SAR'}</span></div>
                                        <div class="d-flex justify-content-between small mb-1"><span>${t.lbl_calc_food}</span> <span><b id="lbl-food-${l.id}">0.00</b> ${lang==='ar'?'ريال':'SAR'}</span></div>
                                        <div class="d-flex justify-content-between border-top pt-1 fw-bold text-primary fs-6">
                                            <span>${t.lbl_calc_total}</span>
                                            <span><span id="val-${l.id}">0.00</span> ${lang==='ar'?'ريال':'SAR'}</span>
                                        </div>
                                    </div>`;
                                } else {
                                    salaryCalculatorHtml = `<span class="text-muted small"><i class="bi bi-exclamation-circle"></i> ${t.salary_less_15_msg}</span>`;
                                }

                                return `
                                <tr>
                                    <td><span class="badge bg-secondary p-2">${formattedDate}</span></td>
                                    <td><b>${lang==='ar' ? l.typeAr : l.typeEn}</b></td>
                                    <td><b class="text-danger">${l.days} ${lang==='ar'?'يوم':'Days'}</b></td>
                                    <td>${lang==='ar' ? l.reasonAr : l.reasonEn}</td>
                                    <td>${salaryCalculatorHtml}</td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>

                <script>
                    function calculateDetailedLeaveSalary(id, days) {
                        let base = parseFloat(document.getElementById('base-' + id).value) || 0;
                        let housing = parseFloat(document.getElementById('housing-' + id).value) || 0;
                        let trans = parseFloat(document.getElementById('trans-' + id).value) || 0;
                        let food = parseFloat(document.getElementById('food-' + id).value) || 0;
                        
                        let leafBase = (base / 30) * days;
                        let leafHousing = (housing / 30) * days;
                        let leafTrans = (trans / 30) * days;
                        let leafFood = (food / 30) * days;
                        let totalLeaveSalary = leafBase + leafHousing + leafTrans + leafFood;
                        
                        document.getElementById('lbl-base-' + id).innerText = leafBase.toFixed(2);
                        document.getElementById('lbl-housing-' + id).innerText = leafHousing.toFixed(2);
                        document.getElementById('lbl-trans-' + id).innerText = leafTrans.toFixed(2);
                        document.getElementById('lbl-food-' + id).innerText = leafFood.toFixed(2);
                        document.getElementById('val-' + id).innerText = totalLeaveSalary.toFixed(2);
                    }
                </script>
                <button onclick="window.print()" class="btn btn-warning fw-bold px-4 no-print"><i class="bi bi-printer"></i> ${t.print_btn_text}</button>
            </div>`;
        }
    }

    let html = `
    <div class="card card-custom p-4 no-print">
        <h5 class="fw-bold mb-3 text-dark"><i class="bi bi-printer-fill text-primary"></i> ${t.reports}</h5>
        <form method="GET" action="/reports" class="row g-2 align-items-end">
            <div class="col-md-8">
                <select name="userId" class="form-select" required>
                    <option value="">${t.select_emp_placeholder}</option>
                    ${users.filter(u => u.role !== 'admin').map(u => `<option value="${u.id}" ${selectedUserId===u.id?'selected':''}>${lang==='ar'? u.nameAr : u.nameEn}</option>`).join('')}
                </select>
            </div>
            <div class="col-md-4"><button type="submit" class="btn btn-primary w-100 fw-bold">${t.generate_report_btn}</button></div>
        </form>
    </div>
    ${reportHtml}`;
    res.send(generateLayout(req.session.user, 'reports', html, lang));
});

app.post('/update-admin-profile', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/login');
    const adminUser = users.find(u => u.role === 'admin');
    if (adminUser) {
        adminUser.nameAr = req.body.adminNameAr;
        adminUser.nameEn = req.body.adminNameEn;
        adminUser.email = req.body.adminEmail;
        adminUser.password = req.body.adminPassword;
        req.session.user = adminUser;
    }
    res.redirect('/');
});

app.post('/add-user', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/login');
    const { newNameAr, newNameEn, newEmail, newPassword, userDeptIndex, userRole } = req.body;
    const deptObj = departments[parseInt(userDeptIndex)];
    users.push({
        id: (users.length + 1).toString(),
        nameAr: newNameAr,
        nameEn: newNameEn,
        email: newEmail,
        password: newPassword,
        role: userRole,
        departmentAr: deptObj.ar,
        departmentEn: deptObj.en,
        baseInitialBalance: 30,
        usedBalance: 0
    });
    res.redirect('/');
});

app.get('/delete-user/:id', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/login');
    users = users.filter(u => u.id !== req.params.id);
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 السيرفر جاهز تماماً ويعمل على المنفذ ${PORT}`));
