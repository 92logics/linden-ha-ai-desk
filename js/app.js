(function () {
  "use strict";

  var SOURCES = {
    notice: "Legal ad, Housing Authority of the City of Linden, published 11 and 18 Sep 2026 (NoticeRegistry reproduction)",
    portal: "ha.internationaleprocurement.com homepage, fetched 3 Oct 2026 (login shell only)",
    home: "lindenha.org homepage, fetched 3 Oct 2026",
    ph: "lindenha.org/public-housing/, fetched 3 Oct 2026",
    faq: "lindenha.org/faqs/, fetched 3 Oct 2026",
    contact: "lindenha.org/contact-us/, fetched 3 Oct 2026"
  };

  function tags(keys) {
    return keys.map(function (key) {
      return '<span class="tag">' + SOURCES[key] + "</span>";
    }).join("");
  }

  function block(paragraphs, list, sourceKeys, handoff) {
    var html = "";
    if (handoff) {
      html += '<p class="handoff">Talk to a person. This prototype cannot finish this.</p>';
    }
    paragraphs.forEach(function (p) {
      html += "<p>" + p + "</p>";
    });
    if (list && list.length) {
      html += "<ul>" + list.map(function (item) {
        return "<li>" + item + "</li>";
      }).join("") + "</ul>";
    }
    html += "<p>" + tags(sourceKeys) + "</p>";
    return { html: html, handoff: !!handoff };
  }

  var OFFICE = "The office published on the contact page is 1601 Dill Avenue, Linden, NJ 07036, phone (908) 298-3820, fax (908) 298-6990. Hours there are Monday–Friday 9:00 a.m.–4:30 p.m., closed 12:00–1:00 for lunch. The FAQ page states Monday–Friday 9:00–4:30 and does not mention lunch. The homepage lists info@lindenha.org.";

  var WAITLIST = "The authority’s own pages do not agree, so this desk will not tell you the list is open or closed. The homepage announcement says the Public Housing waiting list is open, the 202 PRAC–elderly-only list is closed, and the Section 8 list is closed. The public housing program page says the public housing waitlist is closed. The FAQ says all waiting lists are currently closed. Call (908) 298-3820 before you apply or before you tell a resident which list is open.";

  var intents = [
    {
      id: "emergency",
      label: "Gas smell / emergency",
      prompt: "I smell gas in my apartment.",
      keys: ["gas", "smell gas", "smoke", "fire", "carbon monoxide", "co alarm", "flood", "flooding", "911", "can't breathe", "cannot breathe", "medical", "chest pain", "sparking", "no heat", "locked in"],
      rank: 20,
      answer: function () {
        return block(
          [
            "If there is gas, fire, smoke, a carbon monoxide alarm, flooding that is spreading, or a medical emergency, leave if you can and call 911. Do not wait for this prototype.",
            "No after-hours emergency maintenance number was on the notice or the authority pages fetched for this demo. When it is safe, call the office at (908) 298-3820. This chat cannot dispatch staff or create a work order."
          ],
          null,
          ["contact", "faq"],
          true
        );
      }
    },
    {
      id: "maintenance",
      label: "Report a repair",
      prompt: "My sink is leaking. How do I get maintenance?",
      keys: ["maintenance", "repair", "leak", "leaking", "sink", "work order", "broken", "toilet", "heat", "plumber", "pest", "mold"],
      rank: 6,
      answer: function () {
        return block(
          [
            "The public housing page says residents have access to maintenance services. It does not publish a work-order form, a portal step, or a response time. This prototype does not create a work order.",
            "The contact page names Robert Horre as Maintenance Supervisor. The phone line printed next to that name is inconsistent with other extensions on the same page, so this demo will not quote an extension for him. Call the main office during published hours: (908) 298-3820.",
            OFFICE,
            "If the problem is a gas smell, fire, smoke, rising water, or no heat you believe is dangerous, use the emergency path and call 911. Do not leave it in this chat."
          ],
          null,
          ["ph", "contact"],
          true
        );
      }
    },
    {
      id: "documents",
      label: "Documents to bring",
      prompt: "What documents do I need to apply?",
      keys: ["document", "documents", "paperwork", "papers", "identification", "social security", "birth certificate", "proof of income", "what do i bring", "packet"],
      rank: 8,
      answer: function () {
        return block(
          [
            "The public housing page lists these items under “Provide Required Documentation.” It does not say this is the full packet.",
            "The homepage mentions an “Application Packet” but this demo did not download that file. Ask the office for the packet rather than relying on this list alone.",
            WAITLIST
          ],
          [
            "Identification for all household members",
            "Proof of income",
            "Social Security cards and birth certificates"
          ],
          ["ph", "home", "faq"],
          true
        );
      }
    },
    {
      id: "apply",
      label: "Apply for housing",
      prompt: "How do I apply for public housing?",
      keys: ["apply", "application", "pre-application", "waitlist", "waiting list", "wait list", "list open", "list closed", "section 8", "hcv", "voucher", "prac", "public housing"],
      rank: 4,
      answer: function () {
        return block(
          [
            "The public housing page describes this sequence. It also says a pre-application is available online when the waitlist is open, or in person at the office. This prototype cannot take an application.",
            WAITLIST,
            "The FAQ says the Housing Authority does not offer emergency housing. The FAQ also says a response to a public housing application takes 2 to 5 years on average. That is the FAQ’s figure, not a promise about a specific household.",
            "The FAQ and the public housing page do not describe household eligibility the same way. The FAQ says a single person qualifies only if under 62 and permanently disabled, or 62 or older. The program page says the portfolio serves families as well as seniors and people with disabilities, and that single individuals may apply, with citizenship or eligible immigration status and a background screening. Do not treat either page as the only rule. A person at the office has to apply the current policy."
          ],
          [
            "Complete a pre-application (online only if that list is actually open, or in person).",
            "Provide the documents the program page names.",
            "If the list is open, the page says the application is processed and you receive a confirmation.",
            "Eligibility interview and screening.",
            "A unit offer and lease signing only after your name reaches the top and eligibility is verified."
          ],
          ["ph", "home", "faq"],
          true
        );
      }
    },
    {
      id: "status",
      label: "Waiting-list status",
      prompt: "How do I check my waiting list status?",
      keys: ["status", "where am i", "my application", "place on the list", "position", "check my waiting"],
      rank: 10,
      answer: function () {
        return block(
          [
            "This prototype cannot see your file. The FAQ publishes these call-in lines, including the page’s own spelling and punctuation.",
            "“You may call to request your status for Section.” is how that FAQ sentence ends. It does not name a program after the word Section."
          ],
          [
            "Public Housing and Multi-Family (the FAQ spells it “Muli-Family”): 908-298-3820 x203",
            "Section: 908-486-7172 x304",
            "John T Gregoria: 908-298-3821 x407"
          ],
          ["faq"],
          true
        );
      }
    },
    {
      id: "hours",
      label: "Office hours and address",
      prompt: "What are the office hours and address?",
      keys: ["hours", "address", "phone number", "lunch", "office", "location", "dill", "ferguson", "fergason"],
      rank: 3,
      answer: function () {
        return block(
          [
            OFFICE,
            "Board text on the homepage says regular meetings are in person at Ann J. Ferguson Towers, Community Room, 1601 Dill Avenue, at 5:30 p.m. unless the board switches a meeting to remote. A heading on the same homepage spells the building “Ann J. Fergason Towers.” This demo does not resolve that spelling.",
            "The 2026 meeting dates printed on the homepage include 9 December 2026. Earlier dates on that list, and the tenant roundtable printed as 10 June 2026 at 5:30 p.m., are before 3 October 2026. The page does not say whether December is still confirmed."
          ],
          null,
          ["contact", "faq", "home"],
          false
        );
      }
    },
    {
      id: "rent",
      label: "How rent is described",
      prompt: "How much will my rent be?",
      keys: ["rent", "30%", "flat rent", "payment", "how much will my rent"],
      rank: 9,
      answer: function () {
        return block(
          [
            "This prototype will not calculate or quote a dollar rent. The public pages describe the method, and they are not worded the same way.",
            "The FAQ says a public housing tenant can choose income-based rent or a flat rent. Income-based rent is described there as 30% of monthly adjusted income (the page spells it “montly”). Flat rent is based on apartment size. For Section 8, the FAQ says rent is generally 30% of adjusted gross income, with exceptions a case worker explains.",
            "The public housing program page says tenants typically pay 30% of adjusted gross income and HUD subsidy covers the remainder. It does not mention the flat-rent choice. A case worker has to calculate the actual charge."
          ],
          null,
          ["faq", "ph"],
          true
        );
      }
    },
    {
      id: "person",
      label: "I need a person",
      prompt: "I need to talk to a person.",
      keys: ["a person", "human", "someone", "case worker", "caseworker", "complaint", "grievance", "accommodation", "hearing", "talk to"],
      rank: 7,
      answer: function () {
        return block(
          [
            "Call or visit the office. This chat is not a case worker and cannot see a file.",
            OFFICE,
            "Use a person, not this prototype, for your own application status, a rent figure, a reasonable accommodation, a grievance or hearing, a lockout, or any rule the public pages state differently.",
            "The procurement notice names Dr. Marlena Berghammer, Executive Director, as the agency contact for the RFP. The contact page lists her office line as (908) 298-3820 ext. 205 and MBerghammer@lindenha.org. That is the notice contact, not the path for a leak or a waitlist question. The same page lists Endelyn Jaugan for Public Housing at ext. 207, ejaugan@lindenha.org. Section 8 names are on that page, but some extension and email lines are duplicated in the page text, so this demo does not assign those extensions."
          ],
          null,
          ["contact", "faq", "notice"],
          true
        );
      }
    },
    {
      id: "scope",
      label: "What this prototype is",
      prompt: "What AI work is the housing authority soliciting?",
      keys: ["rfp", "bid", "proposal", "solicitation", "soliciting", "prototype", "92 logics", "what is this", "automation", "ai work", "tender", "not a bid"],
      rank: 5,
      answer: function () {
        return block(
          [
            "This screen is a 92 Logics prototype of a staff and resident desk. It is not the Housing Authority’s system and it is not a proposal.",
            "The advertisement requests proposals for “AI AUTOMATION, RESIDENT COMMUNICATION & OPERATIONAL SUPPORT SERVICES.” It names Dr. Marlena Berghammer, Executive Director, as agency contact; says there is no site visit; sets questions at 21 September 2026, 3:30 p.m.; and sets proposals at 9 October 2026, 2:30 p.m. It does not print a time zone. It says documents are on ha.internationaleprocurement.com (no “www”), pricing goes only in the Marketplace fields, hard copies must not be mailed, late proposals are not considered, responses are subject to HUD-5369-B, the award is the proposal most advantageous considering cost and other factors, the contract is to be signed within seven days of award, and the RFP is a fair and open process under N.J.S.A. 19:44A-20.4 et seq. Proposals may not be withdrawn for 60 days.",
            "That advertisement does not say what the AI must do: no channels, no property system, no languages, and no task list. The marketplace homepage fetched for this demo is a support shell (phone 1-866-526-0160, support@internationaleprocurement.com, 9:00 a.m.–7:00 p.m. Eastern, Monday–Friday). It does not show the solicitation without login. A figure of $247.42 at the end of the legal ad is not treated here as a contract value.",
            "Resident answers elsewhere on this desk use only the public lindenha.org pages fetched on 3 October 2026, and they stop where those pages conflict or stay silent."
          ],
          null,
          ["notice", "portal"],
          false
        );
      }
    }
  ];

  var samples = [
    {
      id: "s1",
      who: "Scripted sample · not a real resident",
      title: "Kitchen sink leaking for two days",
      body: "The kitchen sink has dripped for two days. It is not flooding. Can someone come out?",
      intent: "maintenance"
    },
    {
      id: "s2",
      who: "Scripted sample · not a real resident",
      title: "Wants to apply for Section 8 today",
      body: "Is the Section 8 list open? I want to apply online this afternoon.",
      intent: "apply"
    },
    {
      id: "s3",
      who: "Scripted sample · not a real resident",
      title: "Papers for a public housing application",
      body: "What should I bring if I come to the office about public housing?",
      intent: "documents"
    },
    {
      id: "s4",
      who: "Scripted sample · not a real resident",
      title: "Asks the bot to confirm a $400 rent",
      body: "Another site told me my rent is $400. Please confirm that and update my account.",
      intent: "rent"
    }
  ];

  var thread = document.getElementById("thread");
  var chips = document.getElementById("chips");
  var inbox = document.getElementById("inbox");
  var ask = document.getElementById("ask");
  var form = document.getElementById("composer");
  var residentView = document.getElementById("resident-view");
  var staffView = document.getElementById("staff-view");
  var residentNav = document.getElementById("resident-nav");
  var staffNav = document.getElementById("staff-nav");
  var ticket = document.getElementById("ticket");
  var reply = document.getElementById("reply");
  var handoffBtn = document.getElementById("handoff");
  var copyStatus = document.getElementById("copy-status");
  var handed = {};
  var currentSample = null;

  function el(html) {
    var node = document.createElement("div");
    node.innerHTML = html;
    return node.firstElementChild;
  }

  function addMessage(role, html, extraClass) {
    var node = document.createElement("div");
    node.className = "msg " + role + (extraClass ? " " + extraClass : "");
    node.innerHTML = html;
    thread.appendChild(node);
    thread.scrollTop = thread.scrollHeight;
  }

  function hasKey(q, key) {
    var escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp("(^|[^a-z0-9])" + escaped + "([^a-z0-9]|$)", "i").test(q);
  }

  function scoreIntent(text) {
    var q = text.toLowerCase();
    var best = null;
    var bestScore = 0;
    intents.forEach(function (intent) {
      var score = 0;
      intent.keys.forEach(function (key) {
        if (hasKey(q, key)) score += key.length > 10 ? 4 : 2;
      });
      if (score > 0 && intent.rank) score += intent.rank;
      if (score > bestScore) {
        best = intent;
        bestScore = score;
      }
    });
    return bestScore > 0 ? best : null;
  }

  function unknown() {
    return block(
      [
        "That is not answered by the RFP advertisement or by the Linden Housing Authority pages this demo was given.",
        "Please call (908) 298-3820, Monday–Friday 9:00 a.m.–4:30 p.m. The contact page also says the office is closed 12:00–1:00 for lunch. Do not treat this chat as an application, a work order, or a rent quote."
      ],
      null,
      ["notice", "contact"],
      true
    );
  }

  function replyTextFrom(result) {
    var holder = document.createElement("div");
    holder.innerHTML = result.html;
    var lines = [];
    holder.querySelectorAll("p, li").forEach(function (node) {
      if (node.querySelector(".tag")) return;
      var text = node.textContent.replace(/\s+/g, " ").trim();
      if (text) lines.push(node.tagName === "LI" ? "- " + text : text);
    });
    lines.push("");
    lines.push("Sent from the 92 Logics prototype desk. Not an official housing authority message. Nothing was filed.");
    return lines.join("\n");
  }

  function answerQuestion(text) {
    var clean = text.replace(/\s+/g, " ").trim();
    if (!clean) return;
    addMessage("user", "<p>" + escapeHtml(clean) + "</p>");
    var intent = scoreIntent(clean);
    var result = intent ? intent.answer() : unknown();
    addMessage("bot", result.html, result.handoff ? "warn" : "");
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function showSample(sample) {
    currentSample = sample;
    var result = intents.filter(function (item) { return item.id === sample.intent; })[0].answer();
    ticket.innerHTML =
      '<p class="kicker">' + sample.who + "</p>" +
      "<h3>" + sample.title + "</h3>" +
      "<p>" + sample.body + "</p>" +
      (result.handoff ? '<p class="handoff">Recommended path: hand to a person. Do not file this in the prototype.</p>' : "") +
      "<p>" + (handed[sample.id] ? "Marked handed to a person on this screen only." : "Not marked. Nothing has been sent.") + "</p>";
    reply.value = replyTextFrom(result);
    handoffBtn.textContent = handed[sample.id] ? "Clear handoff mark" : "Mark as handed to a person";
    document.querySelectorAll(".inbox button").forEach(function (button) {
      button.setAttribute("aria-current", button.dataset.id === sample.id ? "true" : "false");
    });
    copyStatus.textContent = "";
  }

  intents.forEach(function (intent) {
    var button = document.createElement("button");
    button.type = "button";
    button.textContent = intent.label;
    button.addEventListener("click", function () {
      ask.value = "";
      addMessage("user", "<p>" + escapeHtml(intent.prompt) + "</p>");
      var result = intent.answer();
      addMessage("bot", result.html, result.handoff ? "warn" : "");
    });
    chips.appendChild(button);
  });

  samples.forEach(function (sample) {
    var li = document.createElement("li");
    var button = document.createElement("button");
    button.type = "button";
    button.dataset.id = sample.id;
    button.textContent = sample.title;
    button.addEventListener("click", function () { showSample(sample); });
    li.appendChild(button);
    inbox.appendChild(li);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    answerQuestion(ask.value);
    ask.value = "";
  });

  document.querySelectorAll('input[name="mode"]').forEach(function (input) {
    input.addEventListener("change", function () {
      var staff = input.value === "staff" && input.checked;
      residentView.hidden = staff;
      residentNav.hidden = staff;
      staffView.hidden = !staff;
      staffNav.hidden = !staff;
      if (staff && !currentSample) showSample(samples[0]);
    });
  });

  handoffBtn.addEventListener("click", function () {
    if (!currentSample) return;
    handed[currentSample.id] = !handed[currentSample.id];
    showSample(currentSample);
  });

  document.getElementById("copy-reply").addEventListener("click", function () {
    var done = function (ok) {
      copyStatus.textContent = ok
        ? "Copied on this computer. It was not emailed or filed."
        : "Copy was blocked. Select the reply and copy it yourself. Nothing was sent.";
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(reply.value).then(function () { done(true); }, function () { done(false); });
    } else {
      reply.focus();
      reply.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
      done(ok);
    }
  });

  addMessage(
    "bot",
    block(
      [
        "I am a 92 Logics prototype for a Linden Housing Authority resident and staff desk. I am not the Authority, I am not a bid, and I only answer from the public RFP advertisement and the lindenha.org pages checked on 3 October 2026.",
        "I can walk through maintenance contact limits, how the public housing page says to apply, the documents that page names, office hours, and when you should talk to a person. I cannot see your file."
      ],
      null,
      ["notice", "home"],
      false
    ).html
  );
})();
