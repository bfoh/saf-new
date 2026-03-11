import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AnalyticsService {
    private readonly logger = new Logger(AnalyticsService.name);

    constructor(private dataSource: DataSource) { }

    private safeQuery = async (sql: string, fallback: any = []) => {
        try {
            return await this.dataSource.query(sql);
        } catch (err) {
            this.logger.warn(`Query failed (graceful): ${err.message?.slice(0, 80)}`);
            return fallback;
        }
    };

    async getAdminDashboardMetrics(branchId?: string) {
        this.logger.log('Fetching admin dashboard metrics');
        try {
            return await this._getAdminDashboardMetrics(branchId);
        } catch (err: any) {
            this.logger.error(`Dashboard metrics failed: ${err?.message}`);
            return this._emptyMetrics();
        }
    }

    private _emptyMetrics() {
        return {
            totalStudents: 0, activeStudentsThisMonth: 0,
            revenueThisMonth: 0, revenueLastMonth: 0, outstandingRevenue: 0,
            passRate90d: 0, passRatePrev90d: 0, gradedExamCount: 0,
            enrollingClasses: 0, activeClasses: 0, completingThisMonth: 0,
            pendingInvoiceCount: 0, ungradedSubmissions: 0,
            classesEndingThisWeek: 0, studentsWithVisaIssues: 0,
            monthlyTrends: [], cefrDistribution: [],
            needsAttention: [], recentActivity: [],
            generatedAt: new Date().toISOString(),
        };
    }

    private async _getAdminDashboardMetrics(branchId?: string) {

        const branchFilter = branchId ? `AND c.branch_id = '${branchId}'` : '';

        // ─── KPI: Students ───────────────────────────────────────────
        const [totalStudentsRow] = await this.safeQuery(
            `SELECT COUNT(*) as total FROM profiles WHERE role = 'student'`, [{ total: 0 }]
        );
        const totalStudents = parseInt(totalStudentsRow.total, 10);

        // Students actively enrolled in an active class
        const [activeStudentsRow] = await this.safeQuery(
            `SELECT COUNT(DISTINCT ce.student_id) as total
             FROM class_enrollments ce
             JOIN classes c ON c.id = ce.class_id
             WHERE UPPER(c.status) = 'ACTIVE' ${branchFilter}`,
            [{ total: 0 }]
        );
        const activeStudentsThisMonth = parseInt(activeStudentsRow.total, 10);

        // ─── KPI: Revenue ─────────────────────────────────────────────
        const currentMonth = `DATE_TRUNC('month', CURRENT_DATE)`;
        const lastMonth = `DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')`;

        const [revThisRow] = await this.safeQuery(
            `SELECT COALESCE(SUM(amount), 0) as total FROM invoices
             WHERE UPPER(status) = 'PAID'
             AND date_issued >= ${currentMonth}`,
            [{ total: 0 }]
        );
        const revenueThisMonth = parseFloat(revThisRow.total) || 0;

        const [revLastRow] = await this.safeQuery(
            `SELECT COALESCE(SUM(amount), 0) as total FROM invoices
             WHERE UPPER(status) = 'PAID'
             AND date_issued >= ${lastMonth}
             AND date_issued < ${currentMonth}`,
            [{ total: 0 }]
        );
        const revenueLastMonth = parseFloat(revLastRow.total) || 0;

        const [outstandingRow] = await this.safeQuery(
            `SELECT COALESCE(SUM(amount), 0) as total FROM invoices
             WHERE UPPER(status) = 'PENDING'`,
            [{ total: 0 }]
        );
        const outstandingRevenue = parseFloat(outstandingRow.total) || 0;

        // ─── KPI: Pass Rate (90-day rolling) ─────────────────────────
        const [passRow] = await this.safeQuery(
            `SELECT
               COUNT(*) as total,
               SUM(CASE WHEN (COALESCE(score_lesen,0)+COALESCE(score_horen,0)+COALESCE(score_schreibung,0)+COALESCE(score_sprechen,0)) >= 60 THEN 1 ELSE 0 END) as passed
             FROM exam_submissions
             WHERE status = 'graded'
             AND updated_at >= NOW() - INTERVAL '90 days'`,
            [{ total: 1, passed: 0 }]
        );
        const gradedExamCount = parseInt(passRow.total, 10);
        const passRate90d = gradedExamCount > 0
            ? Math.round((parseInt(passRow.passed, 10) / gradedExamCount) * 100)
            : 0;

        const [prevPassRow] = await this.safeQuery(
            `SELECT
               COUNT(*) as total,
               SUM(CASE WHEN (COALESCE(score_lesen,0)+COALESCE(score_horen,0)+COALESCE(score_schreibung,0)+COALESCE(score_sprechen,0)) >= 60 THEN 1 ELSE 0 END) as passed
             FROM exam_submissions
             WHERE status = 'graded'
             AND updated_at >= NOW() - INTERVAL '180 days'
             AND updated_at < NOW() - INTERVAL '90 days'`,
            [{ total: 1, passed: 0 }]
        );
        const prevGraded = parseInt(prevPassRow.total, 10);
        const passRatePrev90d = prevGraded > 0
            ? Math.round((parseInt(prevPassRow.passed, 10) / prevGraded) * 100)
            : 0;

        // ─── KPI: Classes ─────────────────────────────────────────────
        const [enrollingRow] = await this.safeQuery(
            `SELECT COUNT(*) as total FROM classes WHERE UPPER(status) = 'ENROLLING' ${branchFilter}`,
            [{ total: 0 }]
        );
        const enrollingClasses = parseInt(enrollingRow.total, 10);

        const [activeClassRow] = await this.safeQuery(
            `SELECT COUNT(*) as total FROM classes WHERE UPPER(status) = 'ACTIVE' ${branchFilter}`,
            [{ total: 0 }]
        );
        const activeClasses = parseInt(activeClassRow.total, 10);

        const [completingRow] = await this.safeQuery(
            `SELECT COUNT(*) as total FROM classes
             WHERE UPPER(status) = 'ACTIVE'
             AND end_date IS NOT NULL
             AND end_date >= CURRENT_DATE
             AND end_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
             ${branchFilter}`,
            [{ total: 0 }]
        );
        const completingThisMonth = parseInt(completingRow.total, 10);

        // ─── ALERTS ──────────────────────────────────────────────────
        const [overdueInvoiceRow] = await this.safeQuery(
            `SELECT COUNT(*) as total FROM invoices
             WHERE UPPER(status) = 'PENDING'
             AND date_issued < CURRENT_DATE - INTERVAL '30 days'`,
            [{ total: 0 }]
        );
        const pendingInvoiceCount = parseInt(overdueInvoiceRow.total, 10);

        const [ungradedRow] = await this.safeQuery(
            `SELECT COUNT(*) as total FROM exam_submissions WHERE status IN ('submitted','grading')`,
            [{ total: 0 }]
        );
        const ungradedSubmissions = parseInt(ungradedRow.total, 10);

        const [endingRow] = await this.safeQuery(
            `SELECT COUNT(*) as total FROM classes
             WHERE UPPER(status) = 'ACTIVE'
             AND end_date IS NOT NULL
             AND end_date >= CURRENT_DATE
             AND end_date <= CURRENT_DATE + INTERVAL '7 days'
             ${branchFilter}`,
            [{ total: 0 }]
        );
        const classesEndingThisWeek = parseInt(endingRow.total, 10);

        const [visaRow] = await this.safeQuery(
            `SELECT COUNT(*) as total FROM profiles
             WHERE role = 'student'
             AND visa_status IS NOT NULL
             AND visa_status NOT IN ('N/A','Approved','valid','')`,
            [{ total: 0 }]
        );
        const studentsWithVisaIssues = parseInt(visaRow.total, 10);

        // ─── CHARTS: Monthly Trends (6 months) ────────────────────────
        const rawTrends = await this.safeQuery(
            `SELECT
               TO_CHAR(DATE_TRUNC('month', gs.month_start), 'Mon') AS month,
               TO_CHAR(DATE_TRUNC('month', gs.month_start), 'YYYY') AS year,
               COALESCE(SUM(inv.amount), 0) AS "paidRevenue",
               COUNT(DISTINCT p.id) AS "newEnrollments"
             FROM GENERATE_SERIES(
               DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months'),
               DATE_TRUNC('month', CURRENT_DATE),
               INTERVAL '1 month'
             ) AS gs(month_start)
             LEFT JOIN invoices inv
               ON DATE_TRUNC('month', inv.date_issued::date) = gs.month_start
               AND UPPER(inv.status) = 'PAID'
             LEFT JOIN profiles p
               ON DATE_TRUNC('month', p.created_at) = gs.month_start
               AND p.role = 'student'
             GROUP BY gs.month_start
             ORDER BY gs.month_start ASC`,
            []
        );
        const monthlyTrends = rawTrends.map((r: any) => ({
            month: r.month,
            year: r.year,
            paidRevenue: parseFloat(r.paidRevenue) || 0,
            newEnrollments: parseInt(r.newEnrollments, 10) || 0,
        }));

        // ─── CHARTS: CEFR Distribution ────────────────────────────────
        const rawCefr = await this.safeQuery(
            `SELECT p.cefr_level as level, COUNT(DISTINCT p.id) as count
             FROM profiles p
             JOIN class_enrollments ce ON ce.student_id = p.id
             JOIN classes c ON c.id = ce.class_id
             WHERE UPPER(c.status) IN ('ACTIVE','ENROLLING')
             ${branchFilter}
             GROUP BY p.cefr_level
             ORDER BY p.cefr_level ASC`,
            []
        );
        const allLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const cefrMap = Object.fromEntries(rawCefr.map((r: any) => [r.level, parseInt(r.count, 10)]));
        const cefrDistribution = allLevels.map(level => ({
            level,
            count: cefrMap[level] || 0,
        }));

        // ─── NEEDS ATTENTION ──────────────────────────────────────────
        const needsAttention: any[] = [];
        if (ungradedSubmissions > 0) needsAttention.push({
            type: 'grading', severity: 'warning',
            message: `${ungradedSubmissions} exam submission${ungradedSubmissions > 1 ? 's' : ''} awaiting grading`,
            linkPath: '/admin/grading',
            linkText: 'Grade now',
        });
        if (pendingInvoiceCount > 0) needsAttention.push({
            type: 'billing', severity: 'critical',
            message: `${pendingInvoiceCount} invoice${pendingInvoiceCount > 1 ? 's' : ''} overdue by 30+ days`,
            linkPath: '/admin/billing',
            linkText: 'Chase payments',
        });
        if (classesEndingThisWeek > 0) needsAttention.push({
            type: 'classes', severity: 'info',
            message: `${classesEndingThisWeek} class${classesEndingThisWeek > 1 ? 'es' : ''} ending this week`,
            linkPath: '/admin/classes',
            linkText: 'View classes',
        });
        if (studentsWithVisaIssues > 0) needsAttention.push({
            type: 'visa', severity: 'warning',
            message: `${studentsWithVisaIssues} student${studentsWithVisaIssues > 1 ? 's' : ''} with pending visa status`,
            linkPath: '/admin/students',
            linkText: 'Review',
        });

        // ─── RECENT ACTIVITY ──────────────────────────────────────────
        const recentStudents = await this.safeQuery(
            `SELECT id, first_name as "firstName", last_name as "lastName", cefr_level as "cefrLevel", created_at as "createdAt", 'new_student' as type
             FROM profiles WHERE role = 'student' ORDER BY created_at DESC LIMIT 4`,
            []
        );
        const recentInvoices = await this.safeQuery(
            `SELECT i.id, p.first_name as "firstName", p.last_name as "lastName", i.amount, i.status, i.date_issued as "createdAt", 'invoice' as type
             FROM invoices i JOIN profiles p ON p.id = i.student_id
             WHERE UPPER(i.status) = 'PAID'
             ORDER BY i.date_issued DESC LIMIT 3`,
            []
        );
        const recentExams = await this.safeQuery(
            `SELECT es.id, p.first_name as "firstName", p.last_name as "lastName", es.status, es.updated_at as "createdAt", 'exam_graded' as type
             FROM exam_submissions es JOIN profiles p ON p.id = es.student_id
             WHERE es.status = 'graded'
             ORDER BY es.updated_at DESC LIMIT 3`,
            []
        );

        const allActivity = [
            ...recentStudents.map((r: any) => ({
                type: 'new_student',
                description: `${r.firstName} ${r.lastName} enrolled as a new ${r.cefrLevel || ''} student`,
                timestamp: r.createdAt,
                linkPath: '/admin/students',
                initials: `${r.firstName?.[0] || ''}${r.lastName?.[0] || ''}`.toUpperCase(),
            })),
            ...recentInvoices.map((r: any) => ({
                type: 'invoice_paid',
                description: `Invoice paid — GHS ${parseFloat(r.amount).toLocaleString()} from ${r.firstName} ${r.lastName}`,
                timestamp: r.createdAt,
                linkPath: '/admin/billing',
                initials: `${r.firstName?.[0] || ''}${r.lastName?.[0] || ''}`.toUpperCase(),
            })),
            ...recentExams.map((r: any) => ({
                type: 'exam_graded',
                description: `Exam graded for ${r.firstName} ${r.lastName}`,
                timestamp: r.createdAt,
                linkPath: '/admin/grading',
                initials: `${r.firstName?.[0] || ''}${r.lastName?.[0] || ''}`.toUpperCase(),
            })),
        ]
            .filter(a => a.timestamp)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 8);

        return {
            // KPIs
            totalStudents,
            activeStudentsThisMonth,
            revenueThisMonth,
            revenueLastMonth,
            outstandingRevenue,
            passRate90d,
            passRatePrev90d,
            gradedExamCount,
            enrollingClasses,
            activeClasses,
            completingThisMonth,
            // Alerts
            pendingInvoiceCount,
            ungradedSubmissions,
            classesEndingThisWeek,
            studentsWithVisaIssues,
            // Charts
            monthlyTrends,
            cefrDistribution,
            // Right column
            needsAttention,
            recentActivity: allActivity,
            // Meta
            generatedAt: new Date().toISOString(),
        };
    }
}
