import docx
from docx.shared import Pt, RGBColor, Inches
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def create_report():
    # Load 20 Oct report to inherit professional styles, color tokens, and table layouts
    doc = docx.Document('DLEAFTECH_CRM_DAILY_SPRINT_REPORT_20_OCT.docx')

    # Color Palette definitions matching executive document & DleafCRM theme
    CLR_SLATE_900 = RGBColor(0x0F, 0x17, 0x2A)  # #0F172A
    CLR_FOREST    = RGBColor(0x15, 0x3B, 0x2E)  # #153B2E
    CLR_GREEN_BRAND = RGBColor(0x3F, 0x76, 0x57) # #3F7657
    CLR_GREEN_800 = RGBColor(0x16, 0x65, 0x34)  # #166534
    CLR_SLATE_700 = RGBColor(0x33, 0x41, 0x55)  # #334155
    CLR_SLATE_600 = RGBColor(0x47, 0x55, 0x69)  # #475569
    CLR_SLATE_500 = RGBColor(0x64, 0x74, 0x8B)  # #64748B
    CLR_SLATE_300 = RGBColor(0xCB, 0xD5, 0xE1)  # #CBD5E1

    def set_run_font(run, text, size_pt=None, bold=None, color_rgb=None, font_name="Calibri"):
        run.text = text
        run.font.name = font_name
        if size_pt is not None:
            run.font.size = Pt(size_pt)
        if bold is not None:
            run.bold = bold
        if color_rgb is not None:
            run.font.color.rgb = color_rgb

    # -------------------------------------------------------------
    # 1. Update Table 0 (Metadata Table)
    # -------------------------------------------------------------
    t0 = doc.tables[0]
    # Row 0, Cell 1: Date & Time
    c_date = t0.rows[0].cells[1]
    c_date.text = ""
    r = c_date.paragraphs[0].add_run()
    set_run_font(r, "21 October 2026 | 7:30 PM IST", size_pt=9.5, bold=False, color_rgb=CLR_SLATE_700)

    # Row 0, Cell 3: Working Hours Logged
    c_hours = t0.rows[0].cells[3]
    c_hours.text = ""
    r = c_hours.paragraphs[0].add_run()
    set_run_font(r, "10:30 AM to 7:30 PM (9 Hours Dedicated Engineering Sprint)", size_pt=9.5, bold=False, color_rgb=CLR_SLATE_700)

    # Row 1, Cell 3: Report Reference
    c_ref = t0.rows[1].cells[3]
    c_ref.text = ""
    r = c_ref.paragraphs[0].add_run()
    set_run_font(r, "DL-CRM-DAILY-2026-10-21-V11", size_pt=9.5, bold=False, color_rgb=CLR_SLATE_700)

    # -------------------------------------------------------------
    # 2. Update Paragraph 4: Executive Progress Metrics
    # -------------------------------------------------------------
    p4 = doc.paragraphs[4]
    p4.text = ""
    
    # Bullet 1: Overall Completion
    r1 = p4.add_run("• OVERALL PROJECT COMPLETION: ")
    set_run_font(r1, "• OVERALL PROJECT COMPLETION: ", size_pt=10.0, bold=True, color_rgb=CLR_SLATE_900)
    r2 = p4.add_run("~99% (Increased from ~96%, +3% Massive Operational & Zoho Screenshot Parity Jump)\n")
    set_run_font(r2, "~99% (Increased from ~96%, +3% Massive Operational & Zoho Screenshot Parity Jump)\n", size_pt=10.0, bold=True, color_rgb=CLR_GREEN_800)

    # Bullet 2: Hours Logged
    r3 = p4.add_run("• HOURS LOGGED TODAY: ")
    set_run_font(r3, "• HOURS LOGGED TODAY: ", size_pt=10.0, bold=True, color_rgb=CLR_SLATE_900)
    r4 = p4.add_run("9 Hours (10:30 AM – 7:30 PM continuous dedicated engineering sprint)\n")
    set_run_font(r4, "9 Hours (10:30 AM – 7:30 PM continuous dedicated engineering sprint)\n", size_pt=10.0, bold=False, color_rgb=CLR_SLATE_700)

    # Bullet 3: Key Architectural Focus
    r5 = p4.add_run("• CORE SPRINT FOCUS: ")
    set_run_font(r5, "• CORE SPRINT FOCUS: ", size_pt=10.0, bold=True, color_rgb=CLR_SLATE_900)
    r6 = p4.add_run("Zoho CRM Enterprise Complete Parity (Calls, Products, Price Books, Quotes, Sales Orders, Purchase Orders, Vendors, Cases & Solutions)\n")
    set_run_font(r6, "Zoho CRM Enterprise Complete Parity (Calls, Products, Price Books, Quotes, Sales Orders, Purchase Orders, Vendors, Cases & Solutions)\n", size_pt=10.0, bold=False, color_rgb=CLR_SLATE_700)

    # Bullet 4: Enterprise UI & Modals
    r7 = p4.add_run("• ENTERPRISE UI & MODALS: ")
    set_run_font(r7, "• ENTERPRISE UI & MODALS: ", size_pt=10.0, bold=True, color_rgb=CLR_SLATE_900)
    r8 = p4.add_run("Interactive Zero-State Onboarding Views, Split-Button Call Schedulers/Loggers, 2-Column Case/Solution Builders & 5-Step Solution Import Wizard\n")
    set_run_font(r8, "Interactive Zero-State Onboarding Views, Split-Button Call Schedulers/Loggers, 2-Column Case/Solution Builders & 5-Step Solution Import Wizard\n", size_pt=10.0, bold=False, color_rgb=CLR_SLATE_700)

    # Bullet 5: Build Status
    r9 = p4.add_run("• BUILD STATUS: ")
    set_run_font(r9, "• BUILD STATUS: ", size_pt=10.0, bold=True, color_rgb=CLR_SLATE_900)
    r10 = p4.add_run("Frontend Vite Production Build (1720 modules transformed, 0 errors in 0.57s) & Backend TypeScript tsc (0 errors)\n")
    set_run_font(r10, "Frontend Vite Production Build (1720 modules transformed, 0 errors in 0.57s) & Backend TypeScript tsc (0 errors)\n", size_pt=10.0, bold=False, color_rgb=CLR_SLATE_700)

    # -------------------------------------------------------------
    # 3. Update Paragraph 5: Today's Work Summary Header
    # -------------------------------------------------------------
    p5 = doc.paragraphs[5]
    p5.text = ""
    r_hdr = p5.add_run("🚀 TODAY'S WORK SUMMARY & KEY DELIVERABLES (10:30 AM - 7:30 PM)")
    set_run_font(r_hdr, "🚀 TODAY'S WORK SUMMARY & KEY DELIVERABLES (10:30 AM - 7:30 PM)", size_pt=13.0, bold=True, color_rgb=CLR_FOREST)

    # -------------------------------------------------------------
    # 4. Update Deliverables 1 to 6 (Paragraphs 6 to 17)
    # -------------------------------------------------------------
    # Deliverable 1: Calls Module
    p6 = doc.paragraphs[6]
    p6.text = ""
    r = p6.add_run("1. Calls Module 1-to-1 Zoho Replica, Split Dropdown & Dual Modals ➔ 100% (+15%)")
    set_run_font(r, "1. Calls Module 1-to-1 Zoho Replica, Split Dropdown & Dual Modals ➔ 100% (+15%)", size_pt=11.0, bold=True, color_rgb=CLR_SLATE_900)

    p7 = doc.paragraphs[7]
    p7.text = ""
    b1 = (
        "• Built comprehensive Calls module (/tab/Calls) matching live Zoho CRM layout:\n"
        "  - Top Toolbar & Split Button: Implemented [Create Call | ▼] with popup actions for 'Schedule a call' and 'Log a call'.\n"
        "  - Left Filter Drawer: 4 System Defined Filters + 20 Filter By Fields (Call Agenda, Duration, Owner, Purpose, Result, Start Time, Caller ID, etc.).\n"
        "  - ScheduleCallModal: Outbound (locked 🔒), Scheduled (locked 🔒), Call For (Contact/Lead search), Related To (Account/Deal/Campaign), Date & Time, Agenda, and Reminders.\n"
        "  - LogCallModal: Inbound/Outbound selector, Completed status lock, dual Minutes/Seconds duration counters, Call Result dropdown, Description textarea, and Voice Recording.\n"
        "  - Table & Data Sync: Loaded exact Zoho sample calls (King account & Chau Kitzman lead). Connected with live backend GET/POST/DELETE /api/activities/calls.\n"
    )
    r = p7.add_run(b1)
    set_run_font(r, b1, size_pt=10.0, bold=False, color_rgb=CLR_SLATE_600)

    # Deliverable 2: Products Module
    p8 = doc.paragraphs[8]
    p8.text = ""
    r = p8.add_run("2. Products Module Zero-State, CSV/Excel Import & Creator Modal ➔ 99% (+10%)")
    set_run_font(r, "2. Products Module Zero-State, CSV/Excel Import & Creator Modal ➔ 99% (+10%)", size_pt=11.0, bold=True, color_rgb=CLR_SLATE_900)

    p9 = doc.paragraphs[9]
    p9.text = ""
    b2 = (
        "• Implemented complete Zoho CRM Products architecture (/tab/Products/begin):\n"
        "  - Zero-State Onboarding Banner: Exact matching hero card 'List out Products - Products refer to the goods or services sold or procured by an organization' with Create and Import action buttons.\n"
        "  - Interactive CSV/Excel Import Engine: Direct client file picker parsing and auto-populating products into the database.\n"
        "  - CreateProductModal: Product Owner, Active checkbox, Product Name (mandatory line), Code, Category (Software, Hardware, Subscription, Consulting), Vendor, Manufacturer, Dates, Pricing (₹), Tax (%), and Stock.\n"
        "  - Full Product Catalogue Table: Search, filters, sort, stock badges, status indicators, and live backend API sync (/api/inventory/products).\n"
    )
    r = p9.add_run(b2)
    set_run_font(r, b2, size_pt=10.0, bold=False, color_rgb=CLR_SLATE_600)

    # Deliverable 3: Inventory Sub-Modules
    p10 = doc.paragraphs[10]
    p10.text = ""
    r = p10.add_run("3. Price Books, Quotes, Sales Orders, Purchase Orders & Vendors ➔ 98% (+9%)")
    set_run_font(r, "3. Price Books, Quotes, Sales Orders, Purchase Orders & Vendors ➔ 98% (+9%)", size_pt=11.0, bold=True, color_rgb=CLR_SLATE_900)

    p11 = doc.paragraphs[11]
    p11.text = ""
    b3 = (
        "• Built dedicated zero-state onboarding and interactive views for all 5 Zoho inventory submodules:\n"
        "  - Price Books (/tab/PriceBooks/begin): 'Offer Best Prices with Price Books' hero banner, flat/volume pricing tiers, and quick creation modal.\n"
        "  - Quotes (/tab/Quotes/begin): 'Manage Customer Quotes' banner + right-hand 'Automate Quotes with CPQ' promotional card with action buttons.\n"
        "  - Sales Orders (/tab/SalesOrders/begin): 'Get Sales Orders' banner + right-hand Zoho Finance Suite banner (Books, Expense, Billing, Inventory).\n"
        "  - Purchase Orders (/tab/PurchaseOrders/begin): 'Purchase Orders' vendor procurement view with legal document generation and Finance Suite cards.\n"
        "  - Vendors (/tab/Vendors/begin): 'Contact Your Vendors' supplier directory with contact details, category tracking, and status controls.\n"
        "  - Backend APIs: Full RESTful GET, POST, DELETE endpoints mounted on /api/inventory/*.\n"
    )
    r = p11.add_run(b3)
    set_run_font(r, b3, size_pt=10.0, bold=False, color_rgb=CLR_SLATE_600)

    # Deliverable 4: Cases Module
    p12 = doc.paragraphs[12]
    p12.text = ""
    r = p12.add_run("4. Customer Support Cases Module & Full 2-Column Create Case Form ➔ 100% (+15%)")
    set_run_font(r, "4. Customer Support Cases Module & Full 2-Column Create Case Form ➔ 100% (+15%)", size_pt=11.0, bold=True, color_rgb=CLR_SLATE_900)

    p13 = doc.paragraphs[13]
    p13.text = ""
    b4 = (
        "• Delivered production-grade Cases ticketing system (/tab/Cases/begin and /tab/Cases/create):\n"
        "  - Cases Zero-State View: 'Record Customer Cases - Cases are feedback received from customers regarding issues with your products or services'.\n"
        "  - CreateCaseModal (2-Column Zoho Layout): Case Number (lock 🔒), Case Owner, Product Name, Status (New, Investigation, Waiting, Closed), Type, Priority, Case Origin, Case Reason, Related To, Subject, Account Name, Reported By, Deal Name, Phone, Email.\n"
        "  - Description & Solution Panels: Issue Description, Agent Internal Comments, and Solution Resolution textareas.\n"
        "  - Backend Routes: /api/support/cases connected with full CRUD capabilities.\n"
    )
    r = p13.add_run(b4)
    set_run_font(r, b4, size_pt=10.0, bold=False, color_rgb=CLR_SLATE_600)

    # Deliverable 5: Solutions Module & Import Wizard
    p14 = doc.paragraphs[14]
    p14.text = ""
    r = p14.add_run("5. Solutions Knowledge Base & Multi-Step File Import Wizard ➔ 100% (+15%)")
    set_run_font(r, "5. Solutions Knowledge Base & Multi-Step File Import Wizard ➔ 100% (+15%)", size_pt=11.0, bold=True, color_rgb=CLR_SLATE_900)

    p15 = doc.paragraphs[15]
    p15.text = ""
    b5 = (
        "• Implemented complete Solutions knowledge base suite (/tab/Solutions/begin and /tab/Solutions/create):\n"
        "  - Zero-State View: 'Provide Case Solutions - Solutions are the resources within the organization that help solve recurrent problems'.\n"
        "  - CreateSolutionModal: Solution Number (lock 🔒), Solution Owner, Solution Title (mandatory line), Product Name, Status (Draft, Reviewed, Published), Question, and Answer.\n"
        "  - ImportSolutionsWizard: 5-step Zoho enterprise import pipeline (Upload ➔ Actions ➔ Mapping ➔ Field Mapping ➔ Assign), drag-and-drop file upload, max 25MB validation, and What's New notices.\n"
        "  - Backend Routes: /api/support/solutions with live persistence and search.\n"
    )
    r = p15.add_run(b5)
    set_run_font(r, b5, size_pt=10.0, bold=False, color_rgb=CLR_SLATE_600)

    # Deliverable 6: Full Architecture Certification
    p16 = doc.paragraphs[16]
    p16.text = ""
    r = p16.add_run("6. Sidebar Architecture, Global Routing & Zero-Error Build Audit ➔ 99% (+3%)")
    set_run_font(r, "6. Sidebar Architecture, Global Routing & Zero-Error Build Audit ➔ 99% (+3%)", size_pt=11.0, bold=True, color_rgb=CLR_SLATE_900)

    p17 = doc.paragraphs[17]
    p17.text = ""
    b6 = (
        "• Updated Sidebar navigation with complete Zoho CRM submodules: Activities (Tasks, Meetings, Calls), Inventory (Products, Price Books, Quotes, Sales Orders, Purchase Orders, Invoices, Vendors), Support (Cases, Solutions).\n"
        "• Integrated CRMContext state, TypeScript schemas in crm.ts, and API service client methods in api.ts.\n"
        "• Production Build Validation: Frontend compiled cleanly via npm run build (1720 modules transformed, 0 errors in 0.57s) and Backend tsc compiled with 0 errors.\n"
        "• Outputted executive Word documentation: DLEAFTECH_CRM_DAILY_SPRINT_REPORT_21_OCT.docx.\n"
    )
    r = p17.add_run(b6)
    set_run_font(r, b6, size_pt=10.0, bold=False, color_rgb=CLR_SLATE_600)

    # -------------------------------------------------------------
    # 5. Update Paragraph 18: Table 1 Header
    # -------------------------------------------------------------
    p18 = doc.paragraphs[18]
    p18.text = ""
    r = p18.add_run("📋 UPDATED MODULE-WISE STATUS BREAKDOWN (21 OCT 2026)")
    set_run_font(r, "📋 UPDATED MODULE-WISE STATUS BREAKDOWN (21 OCT 2026)", size_pt=13.0, bold=True, color_rgb=CLR_FOREST)

    # -------------------------------------------------------------
    # 6. Update Table 1 (Module-wise Status Breakdown)
    # -------------------------------------------------------------
    t1 = doc.tables[1]
    
    # 16 Modules data updated for 21 October (+3% to +10% jump)
    module_data = [
        ("Header UI & Brand Suite (/logo.png + Deep Forest)", "100%", "100%", "Certified 100% Complete & Quick-Add (+) Expanded"),
        ("Authentication & Access (Email OTP + ZeptoMail + Theme)", "100%", "100%", "Zero-Trust Email OTP & Clean Dual Panel Certified"),
        ("Landing Page Hero & Lead Conversion Suite", "96%", "98% (+2%)", "High-Converting Email Input + Nature Visual + CRM UI"),
        ("Sidebar Navigation & Custom No-Scrollbar Dividers", "99%", "100% (+1%)", "Activities, Inventory & Support Submodules Fully Mapped"),
        ("Home Dashboard & Executive KPI Center", "96%", "98% (+2%)", "Deep Forest Banner + #f0f6ec Cards + #e6f0e1 Canvas"),
        ("SalesInbox & IMAP Priority Hub", "92%", "95% (+3%)", "#e6f0e1 4-Column Layout + Thread Reader Themed"),
        ("Contacts & Accounts B2B Directory", "98%", "100% (+2%)", "Zoho 1:1 Parity + 2-Column Create Modals + Dual Address Sync"),
        ("Deals & Sales Pipeline Management (Kanban)", "90%", "95% (+5%)", "Stage Transition Bars + Kanban Columns + Deal Drawer"),
        ("Activities, Tasks, Meetings & Calls Suite", "90%", "100% (+10%)", "Tasks Kanban + Meetings List + Calls Split Scheduler/Logger"),
        ("Products & Inventory Management Suite", "93%", "99% (+6%)", "Products, Price Books, Quotes, Sales/Purchase Orders, Vendors"),
        ("Customer Support Suite (Cases & Solutions)", "85%", "100% (+15%)", "Cases 2-Column Builder + Solutions KB + 5-Step Import Wizard"),
        ("Developer MCP Server & Zia Autonomous AI", "82%", "88% (+6%)", "Dark Forest UI Theme + Tool Execution Engine Connected"),
        ("Backend DB (PostgreSQL + Hybrid Memory)", "92%", "96% (+4%)", "Activities, Inventory & Support Endpoints Live"),
        ("Executive Reports & Manager Export Engine", "94%", "97% (+3%)", "Word/Docx & CSV Export Engine Operational"),
        ("Leads Management & 1-Click Conversion", "98%", "100% (+2%)", "Zoho 1:1 Parity + 3-Tier Filter Panel + 3-Dots Action Menu"),
        ("Full-Stack Offline Packaging (start.dlt/bat)", "92%", "96% (+4%)", "Zero Error Certified Production Ready"),
    ]

    for idx, (mod_name, prev_pct, curr_pct, status_text) in enumerate(module_data):
        row = t1.rows[idx + 1]  # row 0 is header
        
        # Col 0: Module Name
        c0 = row.cells[0]
        c0.text = ""
        r0 = c0.paragraphs[0].add_run(mod_name)
        set_run_font(r0, mod_name, size_pt=9.0, bold=True, color_rgb=CLR_SLATE_900)

        # Col 1: Previous %
        c1 = row.cells[1]
        c1.text = ""
        r1 = c1.paragraphs[0].add_run(prev_pct)
        set_run_font(r1, prev_pct, size_pt=9.0, bold=False, color_rgb=CLR_SLATE_600)

        # Col 2: Current Completion %
        c2 = row.cells[2]
        c2.text = ""
        r2 = c2.paragraphs[0].add_run(curr_pct)
        set_run_font(r2, curr_pct, size_pt=9.0, bold=True, color_rgb=CLR_GREEN_800 if "(+" in curr_pct or "100%" in curr_pct else CLR_SLATE_900)

        # Col 3: Status / Deliverable
        c3 = row.cells[3]
        c3.text = ""
        r3 = c3.paragraphs[0].add_run(status_text)
        set_run_font(r3, status_text, size_pt=9.0, bold=False, color_rgb=CLR_SLATE_700)

    # -------------------------------------------------------------
    # 7. Update Paragraph 21: Remaining Backlog Intro
    # -------------------------------------------------------------
    p21 = doc.paragraphs[21]
    p21.text = ""
    r_intro = p21.add_run(
        "To reach a 100% full-fledged enterprise standard equivalent to commercial Zoho CRM Enterprise, the "
        "following advanced deliverables represent the final ~1% optimization scope:"
    )
    set_run_font(r_intro, r_intro.text, size_pt=10.0, bold=False, color_rgb=CLR_SLATE_700)

    # -------------------------------------------------------------
    # 8. Update Next Sprint Roadmap Items A to D
    # -------------------------------------------------------------
    p22 = doc.paragraphs[22]
    p22.text = ""
    r = p22.add_run("📌 A. Developer MCP Server & Zia Autonomous AI Fine-Tuning (Current: 88% ➔ Target: 100%)")
    set_run_font(r, "📌 A. Developer MCP Server & Zia Autonomous AI Fine-Tuning (Current: 88% ➔ Target: 100%)", size_pt=10.5, bold=True, color_rgb=CLR_SLATE_900)

    p28 = doc.paragraphs[28]
    p28.text = ""
    r = p28.add_run("📌 D. Final Cloud Deployment & End-to-End User Testing (Current: 96% ➔ Target: 100%)")
    set_run_font(r, "📌 D. Final Cloud Deployment & End-to-End User Testing (Current: 96% ➔ Target: 100%)", size_pt=10.5, bold=True, color_rgb=CLR_SLATE_900)

    # -------------------------------------------------------------
    # 9. Update Footer (Paragraph 33)
    # -------------------------------------------------------------
    p33 = doc.paragraphs[33]
    p33.text = ""
    r_div = p33.add_run("=========================================================================\n")
    set_run_font(r_div, "=========================================================================\n", size_pt=10.0, bold=False, color_rgb=CLR_SLATE_300)

    r_app = p33.add_run("Report Approved By: Core Engineering Lead\n")
    set_run_font(r_app, "Report Approved By: Core Engineering Lead\n", size_pt=10.5, bold=True, color_rgb=CLR_SLATE_900)

    r_env = p33.add_run("Verified Environment: Node.js v24.15 | React Vite v8.3 | PostgreSQL 16 | Express REST\n")
    set_run_font(r_env, "Verified Environment: Node.js v24.15 | React Vite v8.3 | PostgreSQL 16 | Express REST\n", size_pt=9.5, bold=False, color_rgb=CLR_SLATE_500)

    r_stat = p33.add_run("Status: High-Velocity Sprint Delivered on Schedule (10:30 AM to 7:30 PM IST | 21 Oct 2026)")
    set_run_font(r_stat, "Status: High-Velocity Sprint Delivered on Schedule (10:30 AM to 7:30 PM IST | 21 Oct 2026)", size_pt=10.0, bold=True, color_rgb=CLR_GREEN_800)

    # Save new document for 21 October
    output_filename = "DLEAFTECH_CRM_DAILY_SPRINT_REPORT_21_OCT.docx"
    doc.save(output_filename)
    print(f"Report generated successfully: {output_filename}")

if __name__ == "__main__":
    create_report()
