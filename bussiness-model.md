# RentShield — Business Model Deep Dive

A landlord protection service that guarantees rental income for 12 months and handles the entire eviction process — attorney, court filings, tenant removal — all for a one-time fee of one month's rent.

**Target customer:** small landlords in Massachusetts with fewer than 3 properties (~250,000 people).

---

## How the Product Works

**What the landlord gets:**

- 12 months of guaranteed rent on a new lease
- Full eviction management if the tenant stops paying (legal filing, attorney, court appearances, tenant removal)
- Zero involvement in the legal process — RentShield handles everything

**What the landlord pays:**

- One month's rent, collected at lease signing (e.g., $2,200 at MA median)

---

## The Protection Stack — Why the Economics Are Tight

The product has a built-in layered deductible that limits actual exposure:

| Layer | Who Covers It | Months |
|---|---|---|
| Security deposit | Tenant → Landlord | 1 month |
| Last month's rent | Tenant → Landlord | 1 month |
| Premium collected | Landlord → RentShield | 1 month |
| **RentShield's actual exposure** | **RentShield** | **up to 9 months max** |

But the real exposure is much lower because of the parallel process timeline.

---

## The Parallel Process Timeline — The Core Insight

RentShield doesn't wait passively during the 60-day deductible. It runs the legal process in parallel:

| Day | Event | Who Pays |
|---|---|---|
| Day 1 | Tenant misses rent | Landlord absorbs |
| Day 1 | Landlord files claim with RentShield | Clock starts |
| Day 1–14 | RentShield sends 14-day notice to quit | RentShield covers cost |
| Day 15 | Notice expires unpaid | Still in deductible |
| Day 30 | Second month missed | Still in deductible |
| Day 60 | Deductible window closes | RentShield files with court same day |
| Day 60–120 | Court process → judgment → execution | RentShield pays landlord rent |
| ~Day 120 | Tenant out | Done |

By the time RentShield owes money (day 60), the case is already 60 days into the legal system and close to resolution. **Actual rent payout per claim is typically 2 months, not 9.**

---

## Per-Claim Cost Breakdown

| Item | Amount |
|---|---|
| Rent payout (avg 2.5 months × $2,200) | $5,500 |
| Court filing fee | $175 |
| Process server / certified mail | $100 |
| Attorney (at scale) | $1,500 |
| **Total cost per claim** | **$7,275** |

Compare this to the retail cost for a landlord going alone: $3,000–$5,000 attorney fees + 5–9 months lost rent = **$15,000–$25,000**. RentShield is charging $2,200 to backstop up to $25K in potential loss.

---

## Unit Economics Per Policy

| Item | Amount |
|---|---|
| Premium collected | $2,200 |
| Expected loss (7.5% claim rate × $7,275) | −$546 |
| **Net profit per policy** | **$1,654** |
| **Gross margin** | **~75%** |
| Break-even claim rate | ~28% |

The MA market-wide eviction rate is ~1.7%. New leases run 5–10% in a bad year. RentShield breaks even only if 1 in 4 tenants default — a near-impossible scenario with new-lease screening.

---

## P&L at Scale

*7.5% claim rate, $2,200 avg rent, 6% float*

| | 100 policies | 250 policies | 500 policies | 1,000 policies |
|---|---|---|---|---|
| Gross premiums | $220,000 | $550,000 | $1,100,000 | $2,200,000 |
| Claims triggered | 8 | 19 | 38 | 75 |
| Rent payouts | −$41,250 | −$103,125 | −$206,250 | −$412,500 |
| Legal costs | −$14,200 | −$35,500 | −$71,000 | −$142,000 |
| **Gross profit** | **$164,550** | **$411,375** | **$822,750** | **$1,645,500** |
| Float income (6% MMF) | +$6,600 | +$16,500 | +$33,000 | +$66,000 |
| Operating expenses | −$49,200 | −$49,200 | −$49,200 | −$98,400 |
| **Net profit** | **$121,950** | **$378,675** | **$806,550** | **$1,613,100** |
| **Net margin** | **55%** | **69%** | **73%** | **73%** |

---

## Three Revenue Streams Stacked

The business is actually three businesses in one:

1. **Risk product** — collect premium, hold reserve, pay out if needed (rarely, due to parallel process)
2. **Legal services at scale** — run evictions at $1,500/case vs. $3,000–$5,000 retail. The volume discount is the moat
3. **Float income** — all premiums sit in a money market fund earning ~6% until a claim is triggered or the lease ends cleanly. At 1,000 policies that's $66K/year in passive income

---

## Adverse Selection Controls

The biggest risk in any guarantee product is bad actors. RentShield has five structural filters:

1. **New leases only** — no covering existing problem tenants
2. **60-day deductible** — landlord absorbs the first 2 months, filtering panic filers
3. **$500–$750 eviction co-pay** — small enough for legitimate claims, large enough to discourage frivolous ones
4. **Claim filing requirement** — landlord must formally file, documenting they've contacted the tenant
5. **10-day minimum late** — tenant must be at least 10 days late before a claim can be filed

---

## The Attorney-at-Scale Moat

| Scale | Retail attorney cost | In-house/retainer cost | Annual savings |
|---|---|---|---|
| 50 evictions/yr | $200,000 | $80,000 | $120,000 |
| 100 evictions/yr | $400,000 | $100,000 + paralegal | $260,000 |
| 200 evictions/yr | $800,000 | $150,000 full team | $650,000 |

At ~4% claim rate, RentShield hits 50 evictions/year at 1,250 policies — that's when in-house counsel pays for itself completely and the cost advantage becomes nearly impossible for a solo landlord to replicate.

---

## Startup Costs — Bootstrap-Ready

| Item | Amount |
|---|---|
| MA regulatory legal opinion | $3,000–$5,000 |
| Service contract drafting | $2,000–$3,000 |
| Website + CRM tools | $1,000–$2,000 |
| Google/Meta ads (first 3 months) | $3,000–$5,000 |
| Reserve (stress case, 100 policies) | $30,000–$40,000 |
| Working capital buffer | $10,000 |
| **Total to launch** | **$50,000–$65,000** |

The business generates cash from day one. Every premium is collected upfront before a single claim is paid. The float earns while it waits. By month 6, the reserve is funded by the business itself.

---

## Market Opportunity

**Massachusetts (launch market):**

- 38,800 eviction filings in 2023 (~80% non-payment)
- ~250,000 small landlords (fewer than 3 properties)
- No direct competitor offering guarantee + eviction management bundled

**National expansion (Year 2+):**

- Same product, state-by-state legal customization
- $360M+ TAM nationally at just 2% penetration
- Tenant-friendly states (NY, CA, IL, NJ) have the longest evictions and highest landlord pain — highest willingness to pay

---

## Key Risk: Legal Classification

The most important pre-launch decision is whether this is classified as:

- **A service contract** — no insurance license needed, lighter regulation
- **An insurance product** — requires MA Division of Insurance license, heavy compliance

The product is structured as a service contract (eviction management with a rent backstop), but one wrong phrase in the contract could trigger insurance classification. Budget $3,000–$5,000 for a MA insurance regulatory attorney to confirm the structure before selling a single policy.

---

## Why This Works

- **Real pain:** every small landlord fears a non-paying tenant
- **Clear pricing:** one month's rent — a number landlords already think in
- **Founder-market fit:** built by a landlord with eviction experience, real estate expertise, and finance background
- **Structural margin of safety:** break-even at 28% claim rate vs. realistic 5–8%
- **Self-financing:** cash-positive from policy #1, no outside capital required
- **Defensible moat:** attorney relationships and eviction volume create a cost advantage that individual landlords and new competitors can't match quickly
