---
organization: "Northwind Logistics"
title: "Inbound Shipment Receiving and Put-Away"
subtitle: "Applies to all Northwind distribution centers"
id: "SOP-WH-014"
version: "2.1"
effective_date: "2026-01-15"
review_date: "2027-01-15"
department: "Warehouse Operations"
owner: "Regional Operations Manager"
approved_by: "VP, Supply Chain"
classification: "Internal"
---

# 1. Purpose

This SOP defines the standardized process for receiving inbound shipments at a
Northwind distribution center and putting stock away into its designated storage
location. It ensures that every unit received is verified against the purchase
order, inspected for damage, recorded accurately in the Warehouse Management
System (WMS), and stored in a location that supports efficient picking. Following
this procedure reduces inventory discrepancies, prevents damaged goods from
entering sellable stock, and keeps the WMS an accurate reflection of physical
inventory.

# 2. Scope

## 2.1 In Scope
- Receiving of supplier shipments arriving by truck against an open purchase order (PO).
- Quality and quantity inspection at the dock.
- System receipt and put-away of conforming stock into storage locations.
- Initial handling of discrepancies and visible damage found during receiving.

## 2.2 Out of Scope
- Returns from customers (see SOP-WH-021, Customer Returns Processing).
- Cycle counting and inventory adjustments (see SOP-WH-030, Cycle Counting).
- Cross-dock and flow-through shipments (see SOP-WH-018, Cross-Dock Handling).

## 2.3 Applies To
- Receiving Clerks, Forklift Operators, and Inventory Control Specialists at all
  Northwind distribution centers operating the WMS.

# 3. Definitions and Acronyms

| Term | Definition |
|------|------------|
| WMS | Warehouse Management System — the system of record for inventory and locations. |
| PO | Purchase Order — the authorized order placed with a supplier. |
| ASN | Advance Shipping Notice — supplier's electronic notice of an incoming shipment. |
| LPN | License Plate Number — a unique barcode identifying a pallet or handling unit. |
| Put-away | The act of moving received stock from the dock to its storage location. |
| Discrepancy | Any difference between ordered, shipped, and received quantities or items. |

# 4. Roles and Responsibilities

| Role | Responsibilities |
|------|------------------|
| Receiving Clerk | Verifies paperwork, counts and inspects goods, performs system receipt. |
| Forklift Operator | Moves pallets from the dock, executes directed put-away in the WMS. |
| Inventory Control Specialist | Resolves discrepancies, approves adjustments, manages holds. |
| Shift Supervisor | Handles escalations, authorizes exceptions, monitors dock throughput. |

# 5. Prerequisites

## 5.1 Access and Permissions
- Active WMS user account with the "Receiving" and "Put-Away" roles enabled.
- RF scanner assigned and logged in to the correct facility.

## 5.2 Tools, Systems, and Materials
- RF handheld scanner, printer for LPN and location labels.
- Pallet jack or forklift with a current inspection tag.
- Damage-report tags and quarantine-area signage.

## 5.3 Inputs
- An open, approved PO in the WMS for the arriving shipment.
- Supplier packing slip or bill of lading (BOL).
- ASN loaded in the WMS where the supplier participates in EDI.

## 5.4 Safety Conditions
- High-visibility vest and steel-toed footwear required on the dock at all times.
- Dock lock or wheel chocks engaged before any person enters a trailer.
- Follow forklift pedestrian-separation rules while equipment is operating.

# 6. Overview of the Process

Receiving proceeds through four phases. First, the Receiving Clerk **checks in**
the trailer and validates paperwork against an open PO. Second, the clerk
**inspects and counts** the goods, comparing physical quantities to the PO and
flagging damage or shortages. Third, conforming stock is **received into the
WMS**, which generates LPNs and directed put-away tasks. Finally, Forklift
Operators **put away** the stock to system-directed locations and confirm each
move, after which the receipt is closed. Discrepancies discovered at any phase
are routed to Inventory Control before the affected stock is made sellable.

# 7. Procedure

## 7.1 Phase 1 — Trailer Check-In and Paperwork Validation

1. **Receiving Clerk** — Confirm the trailer's scheduled appointment in the dock
   scheduling board and direct the driver to the assigned door.
   - *Expected result:* Appointment status changes to "Arrived".
   - *If not:* If no appointment exists, notify the Shift Supervisor before unloading.
2. **Receiving Clerk** — Collect the BOL/packing slip and locate the matching PO
   in the WMS by PO number or ASN.
   - *Expected result:* An open PO with status "Awaiting Receipt" is displayed.
   - *If not:* If the PO is closed or missing, do not unload; escalate to Inventory Control.
3. **Receiving Clerk** — Engage the dock lock/wheel chocks and inspect the trailer
   seal against the number recorded on the BOL.
   - *Expected result:* Seal number matches; seal is intact.
   - *If not:* Photograph the seal, log a security exception, and notify the Supervisor.

## 7.2 Phase 2 — Inspection and Count

1. **Receiving Clerk** — Unload pallets to the staging area beside the assigned door.
2. **Receiving Clerk** — Count each SKU and compare to the PO line quantities.
   - *Expected result:* Physical count equals the PO quantity for each line.
   - *If not:* Record the variance; over-shipments and short-shipments follow Section 8.
3. **Receiving Clerk** — Inspect for visible damage, crushed cartons, leaks, or
   temperature excursion where applicable.
   - *Approval criteria:* Cartons are intact, labels legible, no signs of contamination.
   - *If damaged:* Tag the unit, move it to the quarantine area, and record a damage report.

## 7.3 Phase 3 — System Receipt

1. **Receiving Clerk** — In the WMS Receiving module, select the PO and enter the
   received quantity per line for conforming stock only.
   - *Expected result:* The WMS accepts the receipt and prints one LPN label per pallet.
2. **Receiving Clerk** — Apply the printed LPN label to each pallet in the lower
   right corner, oriented for scanning.
3. **Receiving Clerk** — Confirm the receipt. The WMS generates directed put-away tasks.
   - *Expected result:* Put-away tasks appear in the Forklift Operator task queue.

## 7.4 Phase 4 — Put-Away and Close-Out

1. **Forklift Operator** — Accept the next put-away task on the RF scanner and scan
   the LPN to confirm the correct pallet.
2. **Forklift Operator** — Travel to the system-directed location, scan the location
   barcode, and place the pallet.
   - *Expected result:* Scanned location matches the directed location; the WMS confirms the move.
   - *If not:* If the location is full or blocked, use the RF "request alternate" function; never place stock in an unscanned location.
3. **Receiving Clerk** — Once all tasks are confirmed, close the receipt in the WMS
   and file the signed BOL in the daily receiving folder.

# 8. Decision Points and Business Rules

| Condition | Rule / Action | Owner |
|-----------|---------------|-------|
| Received quantity is less than PO | Receive actual quantity; log a shortage against the PO line and notify Inventory Control. | Receiving Clerk |
| Received quantity exceeds PO by ≤ 5% | Receive up to PO quantity; quarantine the overage pending buyer decision. | Receiving Clerk |
| Received quantity exceeds PO by > 5% | Do not receive the overage; hold the full pallet and escalate to the buyer via Inventory Control. | Inventory Control Specialist |
| Visible damage on any unit | Quarantine, tag, and file a damage report before system receipt. | Receiving Clerk |
| Seal number mismatch | Log a security exception and require Supervisor sign-off before unloading. | Shift Supervisor |

# 9. Exceptions and Escalation

- **Missing or closed PO** — Do not unload. Inventory Control confirms whether a PO
  should exist and either reopens it or refuses the delivery.
- **Supplier substitution (different SKU shipped)** — Quarantine the substituted
  item; the buyer decides accept-or-return within one business day.
- **Cold-chain excursion** — Quarantine immediately and notify Quality; do not
  receive temperature-sensitive stock that breached its threshold.

**Escalation path:** Receiving Clerk → Shift Supervisor → Inventory Control
Specialist → Regional Operations Manager. Escalate when a shipment is blocked for
more than two hours or when the discrepancy value exceeds $2,500.

# 10. Verification and Quality Control

- **Checks performed:** Receiving Clerk self-verifies counts; the WMS blocks
  put-away confirmation on any location mismatch; Inventory Control audits a 5%
  daily sample of closed receipts.
- **Acceptance criteria:** Physical stock, LPN, and WMS location agree for every
  audited pallet; no un-actioned discrepancies remain open past 24 hours.
- **Records to retain:** Signed BOL, damage reports, and the WMS receipt confirmation.

# 11. Metrics and KPIs

| Metric | Definition | Target | Reported to |
|--------|------------|--------|-------------|
| Dock-to-stock time | Trailer arrival to last put-away confirmation | < 4 hours | Regional Operations Manager |
| Receiving accuracy | Receipts with zero post-audit discrepancy | ≥ 99.5% | Inventory Control |
| Damage rate | Damaged units / total units received | < 0.3% | Quality |

# 12. Records and Documentation

| Record | Format | Location | Retention |
|--------|--------|----------|-----------|
| Bill of Lading | Paper, signed | Daily receiving folder | 3 years |
| WMS receipt confirmation | Electronic | WMS Receiving history | 7 years |
| Damage report | Electronic form | Quality management system | 3 years |

# 13. Related Documents and References

- SOP-WH-021 — Customer Returns Processing
- SOP-WH-030 — Cycle Counting
- Northwind Warehouse Safety Manual, Section 4 — Dock Safety
- WMS Receiving Module User Guide, v6

# 14. Revision History

| Version | Date | Author | Summary of Change | Approved By |
|---------|------|--------|-------------------|-------------|
| 1.0 | 2023-06-01 | J. Alvarez | Initial release | VP, Supply Chain |
| 2.0 | 2025-03-10 | J. Alvarez | Added ASN/EDI check-in and LPN labeling | VP, Supply Chain |
| 2.1 | 2026-01-15 | R. Okafor | Updated overage business rules and KPIs | VP, Supply Chain |

# 15. Appendices

## Appendix A — Receiving Quick-Reference Checklist

- [ ] Appointment confirmed and trailer at assigned door
- [ ] Seal verified against BOL
- [ ] PO located and open in WMS
- [ ] Physical count matches PO (variances logged)
- [ ] Damage inspection complete; damaged stock quarantined
- [ ] Receipt entered and LPNs applied
- [ ] All put-away tasks confirmed
- [ ] Receipt closed and BOL filed

## Appendix B — Escalation Contacts

| Situation | Contact | Method |
|-----------|---------|--------|
| Blocked shipment | Shift Supervisor | Radio channel 2 |
| Discrepancy > $2,500 | Inventory Control | WMS exception ticket |
| Cold-chain excursion | Quality on-call | Escalation hotline |
