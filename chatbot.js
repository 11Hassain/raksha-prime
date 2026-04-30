/* ==========================================================
   MAven Chatbot — Raksha Prime Customer Support
   Rule-based NLP engine with typing simulation & quick replies
   ========================================================== */
(function () {
    'use strict';

    // ─── DOM refs ─────────────────────────────────────────────────
    const launcher   = document.getElementById('chatbot-launcher');
    const chatWindow = document.getElementById('chatbot-window');
    const closeBtn   = document.getElementById('chatbot-close');
    const messagesEl = document.getElementById('chatbot-messages');
    const inputEl    = document.getElementById('chatbot-input');
    const sendBtn    = document.getElementById('chatbot-send');
    const qrEl       = document.getElementById('chatbot-quick-replies');
    const badge      = document.getElementById('chatbot-badge');

    const BOT_AVATAR = 'https://www.mediassist.in/assets/images/maven-standing.png';

    // ─── Knowledge Base ────────────────────────────────────────────
    // Each entry: { keywords[], response, chips[] }
    const KB = [
        // ── ELIGIBILITY ──────────────────────────────────────────
        {
            id: 'eligibility',
            keywords: ['eligib', 'who can', 'qualify', 'enrolled', 'enroll', 'join', 'valid for', 'applicable'],
            response: `✅ <b>Eligibility for Raksha Prime</b><br><br>
Any patient admitted to one of our <b>7,000+ network hospitals</b> through a Medi Assist health insurance policy is eligible.<br><br>
• Corporate group health insurance members ✓<br>
• Individual Medi Assist policyholders ✓<br>
• Dependents covered under a policy ✓<br><br>
There is <b>no extra charge</b> for availing Raksha Prime.`,
            chips: ['How to enroll?', 'List of hospitals', 'Is it free?']
        },

        // ── ENROLLMENT / BOOKING ─────────────────────────────────
        {
            id: 'enroll',
            keywords: ['enroll', 'book', 'register', 'sign up', 'how to avail', 'how do i use', 'start', 'activate'],
            response: `📋 <b>How to Enroll in Raksha Prime</b><br><br>
Enrollment happens automatically once you are admitted to a network hospital:<br><br>
1️⃣ Get admitted at any of our <b>7,000+ network hospitals</b>.<br>
2️⃣ Our <b>Care Ranger</b> will contact you (or your family) within a few hours.<br>
3️⃣ They will explain the process and confirm your enrollment.<br>
4️⃣ On discharge day, simply pay the AI-calculated <b>refundable deposit</b> and go home!<br><br>
No paperwork, no long queues. 🎉`,
            chips: ['What is a Care Ranger?', 'Refundable deposit', 'Discharge process']
        },

        // ── CARE RANGER ──────────────────────────────────────────
        {
            id: 'care_ranger',
            keywords: ['care ranger', 'ranger', 'representative', 'coordinator', 'who contacts'],
            response: `👩‍⚕️ <b>What is a Care Ranger?</b><br><br>
A <b>Care Ranger</b> is your dedicated Raksha Prime support specialist. They:<br><br>
• Reach out to you shortly after hospital admission<br>
• Guide you through the entire discharge process<br>
• Handle all communication with the hospital billing department<br>
• Keep you informed about your claim status in real time<br><br>
Think of them as your personal hospital-discharge concierge! 🌟<br><br>
📞 <b>Care Ranger Helpline:</b> <a href="tel:+911206937807" style="color:#D71921;">+91 1206937807</a>`,
            chips: ['Care Ranger helpline', 'Discharge process', 'Contact support']
        },

        // ── HELPLINE / PHONE NUMBER ───────────────────────────────
        {
            id: 'helpline_number',
            keywords: ['number', 'phone', 'phone number', 'helpline number', 'contact number',
                       'ranger number', 'care ranger number', 'toll free', 'whatsapp',
                       'what is the number', 'give me number', 'helpline'],
            response: `📞 <b>Raksha Prime Helpline Numbers</b><br><br>
You can reach us through the following:<br><br>
🔴 <b>Care Ranger Helpline:</b><br>
&nbsp;&nbsp;&nbsp;<a href="tel:+911206937807" style="color:#D71921; font-size:1.05em; font-weight:700;">+91 120-693-7807</a><br><br>
📧 <b>Email Support:</b><br>
&nbsp;&nbsp;&nbsp;<a href="mailto:carerangers@mediassist.in" style="color:#D71921;">carerangers@mediassist.in</a><br><br>
🌐 <b>Online Portal:</b><br>
&nbsp;&nbsp;&nbsp;<a href="https://mediassisttpa.in" target="_blank" style="color:#D71921;">mediassisttpa.in</a><br><br>
⏰ Available <b>Mon–Sat, 8am–8pm</b>. For discharge emergencies, call directly — our rangers resolve most issues in one call!`,
            chips: ['Contact support', 'Discharge process', 'Claim status', 'What is a Care Ranger?']
        },

        // ── DISCHARGE PROCESS ────────────────────────────────────
        {
            id: 'discharge',
            keywords: ['discharge', 'leaving hospital', 'check out', 'go home', 'exit', 'when can i leave'],
            response: `🏠 <b>Discharge Process</b><br><br>
With Raksha Prime, discharge is quick and stress-free:<br><br>
1️⃣ Doctor signs discharge order.<br>
2️⃣ You pay a small <b>AI-calculated refundable deposit</b> (usually within minutes).<br>
3️⃣ You leave the hospital immediately — <b>no waiting at the billing counter</b>.<br>
4️⃣ Within 2–5 working days, your claim is settled from home.<br>
5️⃣ Any excess deposit is <b>refunded directly to your bank account</b>.<br><br>
Average discharge time: <b>under 30 minutes</b> 🚀`,
            chips: ['Refundable deposit', 'Refund timeline', 'Out-of-pocket expenses']
        },

        // ── REFUNDABLE DEPOSIT ───────────────────────────────────
        {
            id: 'deposit',
            keywords: ['deposit', 'advance', 'upfront', 'pay at hospital', 'how much to pay', 'initial payment', 'ai calculated'],
            response: `💳 <b>Refundable Deposit — How It Works</b><br><br>
The deposit is a small, AI-estimated amount calculated based on:<br>
• Your policy coverage limits<br>
• Treatment type and estimated hospital bill<br>
• Historical claim data for the procedure<br><br>
<b>Important points:</b><br>
✔️ It is fully <b>refundable</b> if the final bill is lower.<br>
✔️ The exact difference is refunded to your <b>registered bank account</b>.<br>
✔️ If the final bill exceeds the deposit, you may receive a request for the balance.<br><br>
The goal is to get you home quickly with a fair, accurate number.`,
            chips: ['Refund timeline', 'Final bill settlement', 'Out-of-pocket expenses']
        },

        // ── REFUND ───────────────────────────────────────────────
        {
            id: 'refund',
            keywords: ['refund', 'money back', 'when will i get', 'reimburs', 'return amount', 'excess amount', 'bank transfer'],
            response: `💰 <b>Refund Timeline & Process</b><br><br>
After discharge, here's how refunds work:<br><br>
• The final hospital bill is processed within <b>2–5 working days</b>.<br>
• Once the claim is settled with the insurer, excess deposit is <b>transferred directly to your bank account</b>.<br>
• You'll receive an email/SMS notification when the refund is processed.<br><br>
<b>Still waiting?</b> If it's been more than 7 working days, please reach us:<br>
📞 <b>+91 1206937807</b><br>
📧 <b>carerangers@mediassist.in</b>`,
            chips: ['Track claim status', 'Contact support', 'Final bill settlement']
        },

        // ── OUT-OF-POCKET EXPENSES ───────────────────────────────
        {
            id: 'oop',
            keywords: ['out of pocket', 'oop', 'not covered', 'co-pay', 'copay', 'deductible', 'excess', 'non-covered', 'what i have to pay', 'my share'],
            response: `📊 <b>Out-of-Pocket Expenses Explained</b><br><br>
Out-of-pocket expenses are costs <b>not covered</b> by your insurance policy. These can include:<br><br>
• Co-payment percentages defined in your policy<br>
• Non-medical expenses (attendant charges, telephone, etc.)<br>
• Treatments/procedures excluded from your policy<br>
• Costs exceeding your sum insured limit<br><br>
<b>When will I know the amount?</b><br>
You'll receive a detailed breakup via <b>email within 24–48 hours</b> after discharge. Your Care Ranger will also explain it before you leave.`,
            chips: ['Refundable deposit', 'Claim not covered', 'Contact support']
        },

        // ── CLAIM STATUS ─────────────────────────────────────────
        {
            id: 'claim_status',
            keywords: ['claim status', 'claim update', 'check claim', 'where is my claim', 'claim progress', 'claim tracking', 'status of claim'],
            response: `🔍 <b>Tracking Your Claim</b><br><br>
You can track your Raksha Prime claim through:<br><br>
1️⃣ <b>Medi Assist Portal</b> — Log in at <a href="https://mediassisttpa.in" target="_blank" style="color:#D71921;">mediassisttpa.in</a> with your member ID.<br>
2️⃣ <b>Medi Assist App</b> — Available on Android & iOS.<br>
3️⃣ <b>Email notifications</b> — Automatic updates are sent to your registered email.<br>
4️⃣ <b>Call us</b> — 📞 +91 1206937807 (Mon–Sat, 8am–8pm)<br><br>
Have your <b>claim number</b> or <b>member ID</b> ready for faster assistance.`,
            chips: ['Claim rejected', 'Refund timeline', 'Contact support']
        },

        // ── CLAIM REJECTED / DENIED ──────────────────────────────
        {
            id: 'claim_rejected',
            keywords: ['reject', 'denied', 'not approved', 'claim failed', 'declined', 'repudiat', 'claim not settled'],
            response: `⚠️ <b>Claim Rejected or Denied?</b><br><br>
We understand how frustrating this can be. Here's what to do:<br><br>
1️⃣ <b>Check the rejection reason</b> in your email or portal.<br>
2️⃣ Common reasons:<br>
• Policy exclusions or waiting periods<br>
• Missing or incorrect documents<br>
• Treatment not medically necessary per insurer<br><br>
3️⃣ <b>Appeal the decision</b> — You can raise a grievance:<br>
📧 <b>carerangers@mediassist.in</b><br>
📞 <b>+91 1206937807</b><br><br>
Our team will review your case and liaise with the insurer on your behalf.`,
            chips: ['Contact support', 'Missing documents', 'Track claim status']
        },

        // ── DOCUMENTS ────────────────────────────────────────────
        {
            id: 'documents',
            keywords: ['document', 'paperwork', 'form', 'submit', 'upload', 'send documents', 'what papers', 'prescription', 'discharge summary', 'bills'],
            response: `📄 <b>Documents for Raksha Prime</b><br><br>
One of the biggest benefits of Raksha Prime is <b>minimal paperwork</b> for you! However, the hospital and insurer may need:<br><br>
<b>Standard documents (handled by hospital):</b><br>
• Discharge summary<br>
• Final hospital bills & receipts<br>
• Lab reports & prescriptions<br><br>
<b>You may need to share:</b><br>
• Policy card / member ID<br>
• Government photo ID (Aadhaar/PAN)<br>
• Bank details for refund (if not already on file)<br><br>
Your Care Ranger will tell you exactly what's needed in your case.`,
            chips: ['Discharge process', 'Claim rejected', 'Contact support']
        },

        // ── HOSPITAL NETWORK ─────────────────────────────────────
        {
            id: 'hospitals',
            keywords: ['hospital', 'network hospital', 'empanelled', 'which hospital', 'list of hospital', 'near me', 'find hospital', '7000'],
            response: `🏥 <b>Raksha Prime Hospital Network</b><br><br>
Raksha Prime is available at <b>7,000+ hospitals</b> across India, including major cities and tier-2 towns.<br><br>
<b>How to find a network hospital:</b><br>
1️⃣ Visit <a href="https://mediassisttpa.in" target="_blank" style="color:#D71921;">mediassisttpa.in</a><br>
2️⃣ Click "Network Hospitals"<br>
3️⃣ Search by city, pincode, or hospital name<br><br>
<b>Is my hospital covered?</b><br>
If you're already admitted, your Care Ranger will confirm coverage during the welcome call. 📞`,
            chips: ['Eligibility', 'Discharge process', 'Contact support']
        },

        // ── COST / PRICING ───────────────────────────────────────
        {
            id: 'cost',
            keywords: ['cost', 'free', 'charge', 'fee', 'price', 'how much', 'pricing', 'pay for raksha', 'service charge'],
            response: `🎁 <b>Is Raksha Prime Free?</b><br><br>
Yes! <b>Raksha Prime is completely free</b> for patients.<br><br>
• No enrollment fees<br>
• No service charges<br>
• No hidden costs<br><br>
The only amount you pay is the <b>refundable deposit</b> at the time of discharge (which represents your estimated share of the bill, not a fee for using Raksha Prime).<br><br>
We are funded by Medi Assist as part of your health insurance benefits. 💚`,
            chips: ['Refundable deposit', 'Eligibility', 'How to enroll?']
        },

        // ── CASHLESS / INSURANCE ─────────────────────────────────
        {
            id: 'cashless',
            keywords: ['cashless', 'insurance', 'policy', 'tpa', 'pre-auth', 'pre auth', 'authorization', 'approved amount'],
            response: `🔐 <b>Cashless & Pre-Authorization</b><br><br>
Raksha Prime works <b>alongside your cashless claim</b>:<br><br>
• Medi Assist (as your TPA) sends a <b>pre-authorization</b> to the hospital before treatment.<br>
• This approves a specific amount to be paid directly to the hospital.<br>
• With Raksha Prime, you leave before the final settlement — we handle the rest.<br><br>
<b>Cashless pre-auth denied?</b><br>
Contact us immediately at 📞 <b>+91 1206937807</b> — our team can assist with escalation or reimbursement options.`,
            chips: ['Claim rejected', 'Out-of-pocket expenses', 'Contact support']
        },

        // ── TECHNICAL / APP ISSUES ───────────────────────────────
        {
            id: 'tech',
            keywords: ['app', 'login', 'password', 'portal', 'website', 'otp', 'cant access', 'not working', 'error', 'technical'],
            response: `🛠️ <b>Technical Issues</b><br><br>
If you're having trouble with the Medi Assist portal or app:<br><br>
• <b>Forgot password?</b> Use the "Forgot Password" option on the login screen.<br>
• <b>OTP not received?</b> Check spam, wait 2 minutes, then retry.<br>
• <b>App crashing?</b> Clear cache or reinstall from your app store.<br>
• <b>Portal not loading?</b> Try a different browser or disable extensions.<br><br>
Still stuck? Our support team can help:<br>
📞 <b>+91 1206937807</b> | 📧 <b>carerangers@mediassist.in</b>`,
            chips: ['Contact support', 'Track claim status', 'Main menu']
        },

        // ── CONTACT / ESCALATION ─────────────────────────────────
        {
            id: 'contact',
            keywords: ['contact', 'call', 'email', 'reach', 'speak', 'human', 'support', 'escalate', 'complaint', 'grievance', 'talk to someone', 'live agent', 'customer care'],
            response: `📞 <b>Contact Raksha Prime Support</b><br><br>
We're here for you 24x7:<br><br>
🔴 <b>Phone:</b> <a href="tel:+911206937807" style="color:#D71921;">+91 1206937807</a><br>
📧 <b>Email:</b> <a href="mailto:carerangers@mediassist.in" style="color:#D71921;">carerangers@mediassist.in</a><br>
🌐 <b>Website:</b> <a href="https://mediassisttpa.in" target="_blank" style="color:#D71921;">mediassisttpa.in</a><br><br>
For urgent discharge-related issues, calling is the fastest option. Our Care Rangers are trained to resolve most issues within the same call. 💪`,
            chips: ['Track claim status', 'Claim rejected', 'Refund timeline']
        },

        // ── GREETING ─────────────────────────────────────────────
        {
            id: 'greeting',
            keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste', 'hola', 'howdy'],
            response: `👋 <b>Hello there!</b> I'm MAven, your Raksha Prime assistant.<br><br>
I can help you with:<br>
• Discharge process & timing<br>
• Refunds & out-of-pocket expenses<br>
• Claim status & rejections<br>
• Eligibility & enrollment<br>
• Hospital network questions<br><br>
What can I help you with today?`,
            chips: ['Discharge process', 'Claim status', 'Eligibility', 'Contact support']
        },

        // ── THANK YOU ────────────────────────────────────────────
        {
            id: 'thanks',
            keywords: ['thank', 'thanks', 'helpful', 'great', 'awesome', 'wonderful', 'good job', 'perfect'],
            response: `😊 You're welcome! I'm glad I could help.<br><br>
If you have any more questions, feel free to ask. Wishing you a speedy recovery! 🌸<br><br>
For urgent matters, always reach us at 📞 <b>+91 1206937807</b>.`,
            chips: ['Main menu', 'Contact support']
        }
    ];

    // ─── Welcome Message ──────────────────────────────────────────
    const WELCOME = {
        response: `👋 Hi! I'm <b>MAven</b>, your Raksha Prime support assistant.<br><br>
I'm here to help you navigate hospital discharge, claims, refunds, and more — any time of day.<br><br>
<i>What's on your mind today?</i>`,
        chips: ['Discharge process', 'Refund timeline', 'Eligibility', 'Contact support', 'Is it free?']
    };

    // ─── Fallback ────────────────────────────────────────────────
    const FALLBACK = {
        response: `🤔 I didn't quite catch that. Here are some topics I can help with:`,
        chips: ['Discharge process', 'Claim status', 'Refund timeline', 'Out-of-pocket expenses', 'Eligibility', 'Contact support']
    };

    // ─── Keyword → KB chip label mappings ────────────────────────
    const CHIP_ALIAS = {
        'Discharge process':        'discharge',
        'Refund timeline':          'refund',
        'Eligibility':              'eligibility',
        'How to enroll?':           'enroll',
        'Is it free?':              'cost',
        'Contact support':          'contact',
        'Refundable deposit':       'deposit',
        'Out-of-pocket expenses':   'oop',
        'Claim status':             'claim_status',
        'Track claim status':       'claim_status',
        'Claim rejected':           'claim_rejected',
        'List of hospitals':        'hospitals',
        'Final bill settlement':    'discharge',
        'Missing documents':        'documents',
        'What is a Care Ranger?':   'care_ranger',
        'Care Ranger helpline':     'helpline_number',
        'Main menu':                '__menu__'
    };

    // ─── State ───────────────────────────────────────────────────
    let isOpen      = false;
    let hasOpened   = false;

    // ─── Helpers ─────────────────────────────────────────────────
    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function renderBotMessage(html) {
        const row = document.createElement('div');
        row.className = 'chat-msg bot';
        row.innerHTML = `
            <img class="chat-msg-avatar" src="${BOT_AVATAR}" alt="MAven">
            <div class="chat-bubble">${html}</div>`;
        messagesEl.appendChild(row);
        scrollToBottom();
    }

    function renderUserMessage(text) {
        const row = document.createElement('div');
        row.className = 'chat-msg user';
        row.innerHTML = `<div class="chat-bubble">${escapeHTML(text)}</div>`;
        messagesEl.appendChild(row);
        scrollToBottom();
    }

    function escapeHTML(str) {
        const d = document.createElement('div');
        d.appendChild(document.createTextNode(str));
        return d.innerHTML;
    }

    function renderTypingIndicator() {
        const row = document.createElement('div');
        row.className = 'chat-msg bot';
        row.id = 'typing-row';
        row.innerHTML = `
            <img class="chat-msg-avatar" src="${BOT_AVATAR}" alt="MAven">
            <div class="chat-bubble" style="padding:4px 14px;">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>`;
        messagesEl.appendChild(row);
        scrollToBottom();
        return row;
    }

    function removeTypingIndicator() {
        const el = document.getElementById('typing-row');
        if (el) el.remove();
    }

    function renderQuickReplies(chips) {
        qrEl.innerHTML = '';
        (chips || []).forEach(label => {
            const btn = document.createElement('button');
            btn.className = 'qr-chip';
            btn.textContent = label;
            btn.addEventListener('click', (e) => { e.stopPropagation(); handleChip(label); });
            qrEl.appendChild(btn);
        });
    }

    function clearQuickReplies() {
        qrEl.innerHTML = '';
    }

    // ─── NLP engine ──────────────────────────────────────────────
    function findAnswer(userText) {
        const lower = userText.toLowerCase().trim();

        // Score each KB entry
        let best = null;
        let bestScore = 0;

        KB.forEach(entry => {
            let score = 0;
            entry.keywords.forEach(kw => {
                if (lower.includes(kw.toLowerCase())) score++;
            });
            if (score > bestScore) {
                bestScore = score;
                best = entry;
            }
        });

        if (bestScore > 0) return best;
        return null;
    }

    function botReply(responseHTML, chips, delay = 900) {
        const typingEl = renderTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            renderBotMessage(responseHTML);
            renderQuickReplies(chips);
        }, delay);
    }

    // ─── Handle user input ────────────────────────────────────────
    function handleUserMessage(text) {
        if (!text.trim()) return;
        renderUserMessage(text);
        clearQuickReplies();
        inputEl.value = '';

        const match = findAnswer(text);
        if (match) {
            botReply(match.response, match.chips);
        } else {
            botReply(FALLBACK.response, FALLBACK.chips, 700);
        }
    }

    // ─── Handle chip click ────────────────────────────────────────
    function handleChip(label) {
        clearQuickReplies();

        if (label === 'Main menu') {
            renderUserMessage(label);
            botReply(WELCOME.response, WELCOME.chips, 600);
            return;
        }

        const aliasId = CHIP_ALIAS[label];
        if (aliasId) {
            const entry = KB.find(e => e.id === aliasId);
            if (entry) {
                renderUserMessage(label);
                botReply(entry.response, entry.chips);
                return;
            }
        }

        // Fallback: treat chip label as user text input
        handleUserMessage(label);
    }

    // ─── Open / Close ─────────────────────────────────────────────
    function openChat() {
        chatWindow.classList.add('open');
        isOpen = true;
        launcher.setAttribute('aria-expanded', 'true');

        // Hide badge
        badge.classList.add('hidden');

        // Show welcome message only on first open
        if (!hasOpened) {
            hasOpened = true;
            setTimeout(() => {
                botReply(WELCOME.response, WELCOME.chips, 500);
            }, 200);
        }

        // Focus input
        setTimeout(() => inputEl.focus(), 400);
    }

    function closeChat() {
        chatWindow.classList.remove('open');
        isOpen = false;
        launcher.setAttribute('aria-expanded', 'false');
    }

    // ─── Event Listeners ─────────────────────────────────────────
    launcher.addEventListener('click', () => {
        if (isOpen) closeChat(); else openChat();
    });

    closeBtn.addEventListener('click', closeChat);

    sendBtn.addEventListener('click', () => handleUserMessage(inputEl.value));

    inputEl.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserMessage(inputEl.value);
        }
    });

    // Close on outside click
    document.addEventListener('click', e => {
        if (isOpen && !chatWindow.contains(e.target) && !launcher.contains(e.target)) {
            closeChat();
        }
    });

    // ─── Accessibility: close on Escape ──────────────────────────
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && isOpen) closeChat();
    });

})();
