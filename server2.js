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
    { id: '1', nameAr: 'مدير النظام (الأدمن)', nameEn: 'System Administrator', email: 'admin', password: 'admin', role: 'admin', departmentAr: 'إدارة النظام', departmentEn: 'System Admin', baseInitialBalance: 0, usedBalance: 0, salaryDetails: { base: 0, housing: 0, trans: 0, food: 0 } },
    { id: '2', nameAr: 'مدير الموارد البشرية: العازمي', nameEn: 'HR Manager: Al-Azmi', email: 'hr_mgr', password: '123', role: 'hr_manager', departmentAr: 'الموارد البشرية', departmentEn: 'Human Resources', baseInitialBalance: 30, usedBalance: 0, salaryDetails: { base: 10000, housing: 2500, trans: 500, food: 500 } },
    { id: '5', nameAr: 'فاطمة العتيبي', nameEn: 'Fatima Al-Otaibi', email: 'fatima', password: '123', role: 'employee', departmentAr: 'الهندسة والتطوير', departmentEn: 'Engineering & Development', baseInitialBalance: 30, usedBalance: 16, salaryDetails: { base: 8000, housing: 2000, trans: 400, food: 300 } }
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
        <meta charset="UTF-8"><title>${t.title}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #f4f6f9; }
            .sidebar { background-color: #2c3e50; min-height: 100vh; color: white; width: 280px; }
            .nav-link { color: #ecf0f1; padding: 12px; }
            .nav-link:hover, .nav-link.active { background-color: #1abc9c; }
            .main-content { padding: 25px; width: 100%; }
            .card-custom { border-radius: 8px; border: none; box-shadow: 0 2px 10px rgba(0,0,0,0.05); background: white; margin-bottom: 20px; }
            @media print { .no-print { display: none !important; } }
        </style>
    </head>
    <body>
        <div class="d-flex">
            <div class="sidebar p-3 no-print">
                <h5 class="text-center text-warning fw-bold">نظام HR ERP 2026</h5><hr>
                <ul class="nav flex-column">
                    <li class="nav-item"><a href="/" class="nav-link ${currentTab==='dashboard'?'active':''}"><i class="bi bi-grid-1x2-fill"></i> ${t.dashboard}</a></li>
                    <li class="nav-item"><a href="/leaves" class="nav-link ${currentTab==='leaves'?'active':''}"><i class="bi bi-calendar-check-fill"></i> ${t.leaves} <span class="badge bg-danger">${pendingCount}</span></a></li>
                    ${user.role === 'admin' ? `
                        <li class="nav-item"><a href="/departments" class="nav-link ${currentTab==='departments'?'active':''}"><i class="bi bi-building"></i> ${t.manage_depts}</a></li>
                        <li class="nav-item"><a href="/add-employee" class="nav-link ${currentTab==='add-employee'?'active':''}"><i class="bi bi-person-plus-fill"></i> ${t.add_employee}</a></li>
                        <li class="nav-item"><a href="/reports" class="nav-link ${currentTab==='reports'?'active':''}"><i class="bi bi-printer-fill"></i> ${t.reports}</a></li>
                    ` : ''}
                </ul>
            </div>
            <div class="main-content">
                <div class="d-flex justify-content-between align-items-center mb-4 p-3 card-custom no-print">
                    <h5 class="m-0">${t.title}</h5>
                    <div>
                        <a href="/toggle-lang?redirect=${currentTab}" class="btn btn-outline-secondary btn-sm"><i class="bi bi-translate"></i></a>
                        <a href="/logout" class="btn btn-danger btn-sm"><i class="bi bi-box-arrow-right"></i> ${t.logout}</a>
                    </div>
                </div>
                ${contentHtml}
            </div>
        </div>
    </body>
    </html>`;
}

app.get('/reports', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/login');
    const lang = req.session.lang || 'ar';
    const t = translations[lang];
    const selectedId = req.query.empId;
    const selectedEmp = users.find(u => u.id === selectedId);
    
    let reportContent = `
    <div class="card card-custom p-4 no-print">
        <h5 class="fw-bold">${t.report_head}</h5>
        <form method="GET" action="/reports" class="row g-3">
            <div class="col-md-8">
                <select name="empId" class="form-select" onchange="this.form.submit()">
                    <option value="">${t.select_emp_placeholder}</option>
                    ${users.filter(u => u.role !== 'admin').map(u => `<option value="${u.id}" ${selectedId==u.id?'selected':''}>${lang=='ar'?u.nameAr:u.nameEn}</option>`).join('')}
                </select>
            </div>
        </form>
    </div>`;

    if (selectedEmp) {
        const empLeaves = leaves.filter(l => l.employeeId === selectedEmp.id && l.finalStatusAr.includes('تمت الموافقة'));
        const totalUsed = empLeaves.reduce((sum, l) => sum + l.days, 0);
        const salary = selectedEmp.salaryDetails;
        const totalSalary = (salary.base + salary.housing + salary.trans + salary.food);
        
        reportContent += `
        <div class="card card-custom p-4">
            <div class="print-section">
                <h3 class="text-center fw-bold text-primary">${t.report_title_print}</h3>
                <div class="row mt-4">
                    <div class="col-6"><h6>${t.th_name}: <b>${lang=='ar'?selectedEmp.nameAr:selectedEmp.nameEn}</b></h6></div>
                    <div class="col-6"><h6>${t.th_dept}: <b>${lang=='ar'?selectedEmp.departmentAr:selectedEmp.departmentEn}</b></h6></div>
                </div>
                <hr>
                <h5>${t.history_title}</h5>
                <table class="table table-bordered">
                    <thead><tr><th>${t.th_type}</th><th>${t.th_date}</th><th>${t.th_days_deducted}</th></tr></thead>
                    <tbody>${empLeaves.length > 0 ? empLeaves.map(l => `<tr><td>${lang=='ar'?l.typeAr:l.typeEn}</td><td>${l.date}</td><td>${l.days}</td></tr>`).join('') : `<tr><td colspan="3" class="text-center">${t.no_leaves_msg}</td></tr>`}</tbody>
                </table>
                <div class="mt-4 p-3 bg-light border">
                    <h5>${t.calc_detail_title} ${lang=='ar'?selectedEmp.nameAr:selectedEmp.nameEn}</h5>
                    <p>${t.lbl_calc_base} ${salary.base}</p>
                    <p>${t.lbl_calc_housing} ${salary.housing}</p>
                    <p>${t.lbl_calc_trans} ${salary.trans}</p>
                    <p>${t.lbl_calc_food} ${salary.food}</p>
                    <hr>
                    <h4 class="text-success">${t.lbl_calc_total}: ${totalUsed >= 15 ? totalSalary : t.salary_less_15_msg}</h4>
                </div>
            </div>
            <button class="btn btn-primary no-print mt-3" onclick="window.print()">${t.print_btn_text}</button>
        </div>`;
    }
    res.send(generateLayout(req.session.user, 'reports', reportContent, lang));
});

// باقي المسارات (Login, Logout, Dashboard, Leaves, AddUser, etc...) كما هي
app.get('/login', (req, res) => { res.send(`... [شاشة الدخول] ...`); });
app.post('/login', (req, res) => { /* منطق الدخول */ });
app.get('/', (req, res) => { /* منطق اللوحة الرئيسية */ });
app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });

app.listen(3000, () => console.log('System Running on http://localhost:3000'));
