# OKN Social Command Center (OKN Social OS)
## Master Architectural Blueprint & End-to-End Operations Manual

**Ecosystem Targets:**
- 🪙 **OKN Token**: [https://okntoken.com](https://okntoken.com)
- ⚡ **OKNEXUS Exchange**: [https://oknexusexchange.com](https://oknexusexchange.com)
- 📂 **GitHub Repository**: [lovethmykel-ui/oknsocials](https://github.com/lovethmykel-ui/oknsocials)
- 🔒 **Default Security Passcode**: `1234`
- 📄 **Downloadable PDF Blueprint**: [`/OKN_Social_OS_Master_Blueprint.pdf`](file:///c:/Users/DORATHY/UI%20UX%20Skill/oknsocials/public/OKN_Social_OS_Master_Blueprint.pdf)

---

## 1. System Architecture & Component Hierarchy

```mermaid
graph TD
    A[User / Executive Browser] --> B[Apple-Style Passcode Gate: PIN 1234]
    B --> C[Master App Shell: src/app/page.tsx]
    
    subgraph Shell Layer
        C --> S[Enterprise Desktop Sidebar]
        C --> H[Top Header with UTC Clock & Search]
        C --> M[Mobile Liquid Glass Dock]
        C --> CP[Command Palette: Cmd+K]
        C --> ND[Flyout Notification Center]
    end

    subgraph 12 Interactive Workspaces
        C --> W1[1. Command Center Dashboard]
        C --> W2[2. AI Social Director]
        C --> W3[3. Unified Inbox 3-Pane]
        C --> W4[4. Content Studio Adaptive Composer]
        C --> W5[5. Content Calendar]
        C --> W6[6. Campaign Builder]
        C --> W7[7. Media Vault]
        C --> W8[8. Executive Analytics]
        C --> W9[9. Social Accounts Buffer-Style Hub]
        C --> W10[10. AI Agent Matrix 12 Agents]
        C --> W11[11. Project AI Brain]
        C --> W12[12. System & Database Settings]
    end

    subgraph Buffer-Style Social Integration Engine
        W9 --> OAUTH[/api/social/oauth/platform - OAuth 2.0 PKCE Flow]
        W9 --> PING[/api/social/test-connection - Live Latency Ping]
        W9 --> DISPATCH[/api/social/publish - Live API Dispatch]
        W9 --> HOOK[/api/webhooks/platform - Real-Time Ingestion]
    end

    subgraph Intelligence & Safety Engine
        W4 --> GAPI[Live Google Gemini AI Engine: gemini-flash-latest]
        W4 --> SE[Sentinel 4-Tier Risk Classifier]
        W3 --> AIResp[Brand-Voice Response Generator]
        W11 --> PBR[Policy & Forbidden Claims Enforcer]
    end

    subgraph Data & Storage Layer
        C --> SUPA[(Supabase PostgreSQL 15 Tables + RLS)]
        C --> STAT[Dynamic React State + Local Storage]
    end
```

---

## 2. Complete Module Blueprint & Capabilities

### 1. Command Center Dashboard
- **Executive Metrics**: Total Reach, Engagement Rate, Community Size, AI Autonomous Decisions.
- **Contextual Status**: Real-time operational indicator for both OKN Token and OKNEXUS Exchange.
- **Setup Checklist**: Step-by-step guidance for connecting accounts, creating posts, and running campaigns.
- **Pipeline Snapshot**: Immediate overview of queued releases and unread community conversations.

### 2. AI Social Director
- **Operational Intelligence Center**: 9-capability matrix (Dynamic Gating, Strategic Timing, Sentiment Analysis, Threat Interception, etc.).
- **Live Autonomous Decision Feed**: Timestamped stream of actions taken by AI agents with confidence scores.
- **Reasoning Inspector**: Explains the exact policy rationale behind every decision.

### 3. Unified Inbox
- **3-Pane Workflow**: Category filters (Unread, Needs Approval, Flagged) → Thread list → Full conversation context.
- **7-Platform Aggregation**: X, Instagram, LinkedIn, Telegram, YouTube, TikTok, Facebook.
- **Automated Triage**: Sentiment classification (Positive, Neutral, Critical) and intent tagging (Product Question, Scam Alert, Partnership).
- **AI Suggested Brand Response**: Generates compliant replies on demand with 1-click insertion into the composer.

### 4. Content Studio (Adaptive Multi-Channel Composer)
- **Unified Concept Input**: Write a single raw narrative hook.
- **✦ AI Adapt via Gemini**: Synthesizes 7 platform-specific copies in parallel via live Google Gemini AI.
  - **X**: 280-char punchy post with hashtags and CTA signal.
  - **Instagram**: Rich caption with spacing, bio link CTA, and 8+ hashtags.
  - **LinkedIn**: Professional format with numbered insights and discussion prompt.
  - **Telegram**: Formatted community announcement with bold markdown.
  - **YouTube / TikTok / Facebook**: Tailored metadata, hooks, and timestamps.
- **Live Platform Previews**: Pixel-accurate dark preview cards for X, Instagram, LinkedIn, and Telegram.
- **Sentinel Safety Evaluator**: Pre-publish gating that checks forbidden claims and speculative promises.
- **Celebration Feedback**: Confetti explosion on publish.

### 5. Content Calendar
- **Release Scheduling**: Plan posts across dates and time slots.
- **View Modes**: Toggle between Month grid, Week view, and List agenda.
- **Platform Badging**: Visual indication of target platforms for each release.

### 6. Campaign Builder
- **Multi-Stage Structure**: Teaser → Educational → Launch → Community → Follow-up.
- **Milestone Tracking**: Budget allocation, target reach progress bars, and scheduled deliverables.

### 7. Media Vault
- **Asset Categories**: Logos, 3D Renders, Social Graphics, Videos, Flyers.
- **Metadata Inspector**: Aspect ratios (1:1, 16:9, 9:16, 4:5), dimensions, file sizes, and quick-attach links.

### 8. Executive Analytics
- **SVG Area & Bar Charts**: Reach and impressions trends across 7d, 30d, and 90d intervals.
- **Audience & Platform Breakdown**: Distribution percentages across social channels.
- **Velocity Metrics**: Engagement spikes and response speed tracking.

### 9. Social Accounts Integration Hub (Buffer.com Style)
- **3 Connection Modes**:
  1. **OAuth 2.0 1-Click Connect**: Buffer-style popup authorization flow with granted scopes.
  2. **API Keys / Bot Token Setup**: Direct credential integration (Telegram BotFather token, Meta Graph App ID, Bearer Tokens).
  3. **Live Webhook Ingestion**: Dedicated webhook receiver per platform (`/api/webhooks/[platform]`) for real-time DMs, mentions, and replies.
- **Live Diagnostics**: Ping `/api/social/test-connection` for real latency and scope validation.

### 10. AI Agent Matrix (12 Specialized Agents)
- **Full Roster**: Social Director, Content Architect, Inbox Intelligence, Comment Moderator, Community Liaison, Sentinel Threat Interceptor, Analytics Engine, Release Scheduler, Campaign Operations, Trend Scout, Influencer Scout, and Account Health Monitor.
- **Granular Autonomy Control**: Toggle each agent between `OFF`, `SUGGEST ONLY`, `APPROVAL REQUIRED`, and `AUTONOMOUS`.

### 11. Project AI Brain
- **Knowledge Base Rules**: Official websites ([https://okntoken.com](https://okntoken.com) and [https://oknexusexchange.com](https://oknexusexchange.com)).
- **Approved Claims**: Official value propositions and capabilities.
- **Forbidden Claims Guard**: Strict blacklist blocking promises of financial returns, unregistered securities claims, and scam vectors.

### 12. System Settings & Security
- **Security PIN**: Built-in passcode protection (`1234`).
- **Supabase Integration**: 15 PostgreSQL tables with Row Level Security.
- **Audit Logs**: Immutable log of administrative actions and AI agent permissions.

---

## 3. Buffer-Style Social Integration API Reference

| Platform | Auth Type | Initiation Endpoint | Token Exchange / Callback | Live Dispatch Endpoint |
|---|---|---|---|---|
| **X / Twitter** | OAuth 2.0 PKCE | `GET /api/social/oauth/x` | `GET /api/social/oauth/callback` | `POST /api/social/publish` |
| **Telegram** | BotFather API Token | Configuration Modal | Direct Verification | `POST /api/social/publish` |
| **Instagram** | Meta Graph OAuth 2.0 | `GET /api/social/oauth/instagram` | `GET /api/social/oauth/callback` | `POST /api/social/publish` |
| **LinkedIn** | LinkedIn OAuth 2.0 | `GET /api/social/oauth/linkedin` | `GET /api/social/oauth/callback` | `POST /api/social/publish` |
| **YouTube** | Google OAuth 2.0 | `GET /api/social/oauth/youtube` | `GET /api/social/oauth/callback` | `POST /api/social/publish` |
| **TikTok** | TikTok OAuth 2.0 | `GET /api/social/oauth/tiktok` | `GET /api/social/oauth/callback` | `POST /api/social/publish` |
| **Facebook** | Meta Graph OAuth 2.0 | `GET /api/social/oauth/facebook` | `GET /api/social/oauth/callback` | `POST /api/social/publish` |

---

## 4. Operations Manual — How to Connect & Publish

### Step 1: Connecting Social Accounts (Buffer Style)
1. Navigate to **Social Accounts** from the sidebar.
2. In the top bar, select any platform icon (e.g. **X**, **Telegram**, **Instagram**, or **LinkedIn**).
3. In the modal:
   - **For Instant OAuth 2.0**: Review the required scopes and click **"Authorize & Connect"**.
   - **For Telegram**: Switch to the **API Keys / Bot Token** tab, paste your Bot Token from `@BotFather`, enter your `@Channel` username or Chat ID, and click **"Save & Verify Credentials"**.
   - **For Real-Time Webhooks**: Switch to the **Webhooks** tab and copy your dedicated webhook URL (`https://your-domain/api/webhooks/[platform]`).
4. The account will immediately appear in your active fleet with a green nominal status badge.

### Step 2: Testing Live Connection Health
1. On any connected account card, click the **"Test Ping"** button.
2. The system pings `/api/social/test-connection`, verifying API token validity and latency in real-time.

### Step 3: Generating & Dispatching Content with Gemini AI
1. Go to **Content Studio**.
2. Enter your raw release concept (e.g., *"OKNEXUS Perpetual DEX liquidity vaults are officially opening with zero counterparty drag at https://oknexusexchange.com"*).
3. Click **"✦ AI Adapt via Gemini"**.
4. Gemini synthesizes tailored copies for X, Instagram, LinkedIn, Telegram, etc.
5. Click **"Publish All Now"** to dispatch the post across all connected channels via `/api/social/publish`.

---

## 5. Official Ecosystem Links Reference

| Entity | Official Website | Social Focus |
|---|---|---|
| **OKN Token** | [https://okntoken.com](https://okntoken.com) | Utility, ecosystem rewards, governance, staking |
| **OKNEXUS Exchange** | [https://oknexusexchange.com](https://oknexusexchange.com) | Perpetual DEX, institutional liquidity, sub-ms execution |
| **Command Center Repo** | [https://github.com/lovethmykel-ui/oknsocials](https://github.com/lovethmykel-ui/oknsocials) | Next.js 16 App Router codebase |
