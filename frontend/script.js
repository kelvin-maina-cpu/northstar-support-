/* =================================================================
   NORTHSTAR SUPPORT — GLOBAL SCRIPT
   Handles: dark mode, dropdown panels, mobile nav, modals,
   contact form validation, knowledge base search, toasts.
   Shared across all pages (index, order-status, returns-refunds,
   my-tickets, profile).
   ================================================================= */

/* -----------------------------------------------------------------
   0. APPLY SAVED THEME IMMEDIATELY (reduces flash of wrong theme)
   ----------------------------------------------------------------- */
(function applyStoredTheme() {
  const savedTheme = localStorage.getItem("northstar-theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
})();

document.addEventListener("DOMContentLoaded", () => {
  /* ===============================================================
     1. TOAST UTILITY
     Lightweight, reusable feedback messages for actions that don't
     need a full modal (e.g. footer links, sign out confirmation).
     =============================================================== */
  function getToastContainer() {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      container.setAttribute("aria-live", "polite");
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(message, duration = 3200) {
    const container = getToastContainer();
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);

    // Trigger enter animation on next frame
    requestAnimationFrame(() => toast.classList.add("toast-visible"));

    setTimeout(() => {
      toast.classList.remove("toast-visible");
      toast.addEventListener("transitionend", () => toast.remove(), { once: true });
    }, duration);
  }

  /* ===============================================================
     2. THEME (DARK MODE) TOGGLE
     =============================================================== */
  const THEME_KEY = "northstar-theme";
  const themeToggles = [
    document.getElementById("darkModeToggle"),
    document.getElementById("settingsDarkModeToggle"),
    document.getElementById("profileDarkModeToggle"),
  ].filter(Boolean);

  function syncThemeToggles() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    themeToggles.forEach((toggle) => {
      toggle.setAttribute("aria-checked", String(isDark));
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    syncThemeToggles();
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(current === "dark" ? "light" : "dark");
  }

  themeToggles.forEach((toggle) => {
    toggle.addEventListener("click", toggleTheme);
  });

  syncThemeToggles();

  /* ===============================================================
     3. GENERIC DROPDOWN PANEL HANDLING
     (Notifications / Help / Profile)
     Only one panel open at a time; closes on outside click,
     Escape key, or its own close button.
     =============================================================== */
  const dropdowns = [];

  function closeDropdown(entry) {
    entry.panel.hidden = true;
    entry.trigger.setAttribute("aria-expanded", "false");
  }

  function closeAllDropdowns(except) {
    dropdowns.forEach((entry) => {
      if (entry !== except && !entry.panel.hidden) {
        closeDropdown(entry);
      }
    });
  }

  function registerDropdown(triggerId, panelId, closeId) {
    const trigger = document.getElementById(triggerId);
    const panel = document.getElementById(panelId);
    if (!trigger || !panel) return;

    const entry = { trigger, panel };
    dropdowns.push(entry);

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const isHidden = panel.hidden;
      closeAllDropdowns(entry);
      panel.hidden = !isHidden;
      trigger.setAttribute("aria-expanded", String(!isHidden));
    });

    const closeBtn = closeId ? document.getElementById(closeId) : null;
    if (closeBtn) {
      closeBtn.addEventListener("click", () => closeDropdown(entry));
    }

    panel.addEventListener("click", (event) => event.stopPropagation());
  }

  registerDropdown("notificationsBtn", "notificationsPanel", "notificationsClose");
  registerDropdown("helpBtn", "helpPanel", "helpClose");
  registerDropdown("profileBtn", "profileMenu", null);

  document.addEventListener("click", () => closeAllDropdowns(null));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllDropdowns(null);
    }
  });

  /* ===============================================================
     4. MOBILE NAVIGATION DRAWER
     =============================================================== */
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      const isHidden = mobileNav.hidden;
      mobileNav.hidden = !isHidden;
      mobileMenuBtn.setAttribute("aria-expanded", String(isHidden));
      mobileMenuBtn.querySelector(".material-symbols-outlined").textContent = isHidden
        ? "close"
        : "menu";
    });

    // Close the drawer after a link inside it is used
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.hidden = true;
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        mobileMenuBtn.querySelector(".material-symbols-outlined").textContent = "menu";
      });
    });
  }

  /* ===============================================================
     5. MODAL HANDLING (Contact / Settings / Sign Out)
     =============================================================== */
  function openModal(modal) {
    if (!modal) return;
    closeAllDropdowns(null);
    // Defense in depth: never allow two modals to be open at once.
    document.querySelectorAll(".modal-overlay").forEach((overlay) => {
      if (overlay !== modal) overlay.hidden = true;
    });
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    const firstField = modal.querySelector("input, textarea, button");
    if (firstField) firstField.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeModal(overlay);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal-overlay").forEach((overlay) => {
        if (!overlay.hidden) closeModal(overlay);
      });
    }
  });

  // --- Contact Modal ---
  const contactModal = document.getElementById("contactModal");
  const contactForm = document.getElementById("contactForm");
  const contactSuccess = document.getElementById("contactSuccess");

  function openContactModal() {
    openModal(contactModal);
  }

  [
    document.getElementById("navContact"),
    document.getElementById("mobileNavContact"),
    document.getElementById("helpContact"),
  ]
    .filter(Boolean)
    .forEach((trigger) => trigger.addEventListener("click", openContactModal));

  const contactModalClose = document.getElementById("contactModalClose");
  const contactCancel = document.getElementById("contactCancel");
  [contactModalClose, contactCancel].filter(Boolean).forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal(contactModal);
      resetContactForm();
    });
  });

  function resetContactForm() {
    if (!contactForm) return;
    contactForm.reset();
    contactForm.hidden = false;
    contactSuccess.hidden = true;
    contactForm.querySelectorAll(".form-field").forEach((field) => {
      field.classList.remove("invalid");
      const error = field.querySelector(".form-error");
      if (error) error.textContent = "";
    });
  }

  function validateContactForm() {
    let isValid = true;

    const nameField = document.getElementById("contactName");
    const nameError = document.getElementById("contactNameError");
    if (!nameField.value.trim()) {
      nameField.closest(".form-field").classList.add("invalid");
      nameError.textContent = "Please enter your name.";
      isValid = false;
    } else {
      nameField.closest(".form-field").classList.remove("invalid");
      nameError.textContent = "";
    }

    const emailField = document.getElementById("contactEmail");
    const emailError = document.getElementById("contactEmailError");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailField.value.trim()) {
      emailField.closest(".form-field").classList.add("invalid");
      emailError.textContent = "Please enter your email.";
      isValid = false;
    } else if (!emailPattern.test(emailField.value.trim())) {
      emailField.closest(".form-field").classList.add("invalid");
      emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    } else {
      emailField.closest(".form-field").classList.remove("invalid");
      emailError.textContent = "";
    }

    const messageField = document.getElementById("contactMessage");
    const messageError = document.getElementById("contactMessageError");
    if (!messageField.value.trim()) {
      messageField.closest(".form-field").classList.add("invalid");
      messageError.textContent = "Please enter a message.";
      isValid = false;
    } else {
      messageField.closest(".form-field").classList.remove("invalid");
      messageError.textContent = "";
    }

    return isValid;
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateContactForm()) return;

      // Future: Replace with real API call to submit the support request.
      contactForm.hidden = true;
      contactSuccess.hidden = false;

      showToast("Your message has been sent to support.");

      setTimeout(() => {
        closeModal(contactModal);
        resetContactForm();
      }, 2200);
    });
  }

  // --- Settings Modal ---
  const settingsModal = document.getElementById("settingsModal");
  const menuSettings = document.getElementById("menuSettings");
  const settingsModalClose = document.getElementById("settingsModalClose");

  if (menuSettings) {
    menuSettings.addEventListener("click", () => openModal(settingsModal));
  }
  if (settingsModalClose) {
    settingsModalClose.addEventListener("click", () => closeModal(settingsModal));
  }

  // --- Sign Out Modal ---
  const signOutModal = document.getElementById("signOutModal");
  const menuSignOut = document.getElementById("menuSignOut");
  const signOutCancel = document.getElementById("signOutCancel");
  const signOutConfirm = document.getElementById("signOutConfirm");

  if (menuSignOut) {
    menuSignOut.addEventListener("click", () => openModal(signOutModal));
  }
  if (signOutCancel) {
    signOutCancel.addEventListener("click", () => closeModal(signOutModal));
  }
  if (signOutConfirm) {
    signOutConfirm.addEventListener("click", () => {
      // Future: Replace with real sign-out / session-clearing API call.
      closeModal(signOutModal);
      showToast("You've been signed out of this demo session.");
    });
  }

  /* ===============================================================
     6. HELP PANEL ACTIONS
     =============================================================== */
  const helpOrder = document.getElementById("helpOrder");
  const helpReturns = document.getElementById("helpReturns");
  const helpRefund = document.getElementById("helpRefund");

  [helpOrder, helpReturns, helpRefund].filter(Boolean).forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      if (target) window.location.href = target;
    });
  });

  /* ===============================================================
     7. KNOWLEDGE BASE SEARCH
     Sample/demo articles until the backend is connected.
     =============================================================== */
  // Future: Replace sample KB data with an API call to the search endpoint.
  const kbArticles = [
    {
      title: "How to track your order",
      description: "Find your order number and check real-time shipping status.",
      icon: "package_2",
      keywords: ["order", "tracking", "track", "shipment", "package", "where is my order"],
      target: "order-status.html",
    },
    {
      title: "Shipping timeframes",
      description: "Standard and expedited shipping usually take 3-7 business days.",
      icon: "local_shipping",
      keywords: ["shipping", "delivery", "arrive", "when will my order arrive", "eta"],
      target: "order-status.html",
    },
    {
      title: "How do I return an item?",
      description: "Step-by-step instructions for starting a return.",
      icon: "assignment_return",
      keywords: ["return", "returns", "send back", "exchange"],
      target: "returns-refunds.html",
    },
    {
      title: "When will I receive my refund?",
      description: "Refunds are typically processed within 5-10 business days.",
      icon: "payments",
      keywords: ["refund", "refunds", "money back", "reimburse"],
      target: "returns-refunds.html",
    },
    {
      title: "Return policy overview",
      description: "Items can be returned within 30 days of delivery in original condition.",
      icon: "policy",
      keywords: ["policy", "return policy", "rules", "eligibility"],
      target: "returns-refunds.html",
    },
    {
      title: "Contact customer support",
      description: "Reach our support team directly for anything not covered here.",
      icon: "support_agent",
      keywords: ["contact", "support", "help", "agent", "talk to someone"],
      target: null,
    },
  ];

  const kbSearchForm = document.getElementById("kbSearchForm");
  const kbSearchInput = document.getElementById("kbSearchInput");
  const kbResults = document.getElementById("kbResults");
  const kbResultsList = document.getElementById("kbResultsList");
  const kbResultsSummary = document.getElementById("kbResultsSummary");
  const kbResultsClose = document.getElementById("kbResultsClose");

  function renderKbResults(query) {
    const normalizedQuery = query.trim().toLowerCase();
    const matches = kbArticles.filter((article) =>
      article.keywords.some((keyword) => keyword.includes(normalizedQuery) || normalizedQuery.includes(keyword))
    );

    kbResultsList.innerHTML = "";

    if (matches.length === 0) {
      kbResultsSummary.textContent = `No results for "${query}"`;
      const emptyState = document.createElement("li");
      emptyState.className = "kb-no-results";
      emptyState.textContent = "Try searching for order tracking, shipping, returns, or refunds.";
      kbResultsList.appendChild(emptyState);
      kbResults.hidden = false;
      return;
    }

    kbResultsSummary.textContent = `${matches.length} result${matches.length > 1 ? "s" : ""} for "${query}"`;

    matches.forEach((article) => {
      const item = document.createElement("li");

      if (article.target) {
        const link = document.createElement("a");
        link.className = "kb-result-item";
        link.href = article.target;
        link.innerHTML = `
          <span class="kb-result-title">
            <span class="material-symbols-outlined" aria-hidden="true">${article.icon}</span>
            ${article.title}
          </span>
          <span class="kb-result-desc">${article.description}</span>
        `;
        item.appendChild(link);
      } else {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "kb-result-item";
        button.innerHTML = `
          <span class="kb-result-title">
            <span class="material-symbols-outlined" aria-hidden="true">${article.icon}</span>
            ${article.title}
          </span>
          <span class="kb-result-desc">${article.description}</span>
        `;
        button.addEventListener("click", openContactModal);
        item.appendChild(button);
      }

      kbResultsList.appendChild(item);
    });

    kbResults.hidden = false;
  }

  if (kbSearchForm) {
    kbSearchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = kbSearchInput.value.trim();
      if (!query) {
        kbSearchInput.focus();
        return;
      }
      renderKbResults(query);
    });
  }

  if (kbResultsClose) {
    kbResultsClose.addEventListener("click", () => {
      kbResults.hidden = true;
      kbSearchInput.value = "";
      kbSearchInput.focus();
    });
  }

  /* ===============================================================
     8. FOOTER LINKS
     Placeholder legal/status pages are not part of this MVP scope;
     surface a clear, honest message instead of a dead link.
     =============================================================== */
  const footerLinkMessages = {
    footerPrivacy: "Privacy Policy page is coming soon.",
    footerTerms: "Terms of Service page is coming soon.",
    footerAccessibility: "Accessibility statement is coming soon.",
    footerStatus: "Status page is coming soon.",
  };

  Object.keys(footerLinkMessages).forEach((id) => {
    const link = document.getElementById(id);
    if (link) {
      link.addEventListener("click", () => showToast(footerLinkMessages[id]));
    }
  });

  /* ===============================================================
     9. SMOOTH SCROLL FOR ON-PAGE ANCHOR LINKS (e.g. Dashboard)
     =============================================================== */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href").slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        event.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ===============================================================
     10. ORDER STATUS PAGE
     =============================================================== */
  // Future: Replace sample order data with an API call to the order lookup service.
  const sampleOrders = {
    NS12345: {
      status: "Shipped",
      statusClass: "status-shipped",
      delivery: "15 Aug 2026",
      timeline: [
        { title: "Order Placed", desc: "10 Aug 2026", state: "complete", icon: "check" },
        { title: "Shipped", desc: "12 Aug 2026 - Package has left the facility.", state: "current", icon: "local_shipping" },
        { title: "Out for Delivery", desc: "", state: "upcoming", icon: "" },
      ],
    },
    NS10000: {
      status: "Delivered",
      statusClass: "status-delivered",
      delivery: "5 Aug 2026",
      timeline: [
        { title: "Order Placed", desc: "1 Aug 2026", state: "complete", icon: "check" },
        { title: "Shipped", desc: "2 Aug 2026 - Package has left the facility.", state: "complete", icon: "local_shipping" },
        { title: "Delivered", desc: "5 Aug 2026 - Left at front door.", state: "complete", icon: "task_alt" },
      ],
    },
    NS20000: {
      status: "Processing",
      statusClass: "status-open",
      delivery: "Pending",
      timeline: [
        { title: "Order Placed", desc: "13 Aug 2026", state: "complete", icon: "check" },
        { title: "Processing", desc: "Preparing your items for shipment.", state: "current", icon: "inventory_2" },
        { title: "Shipped", desc: "", state: "upcoming", icon: "" },
      ],
    },
  };

  const orderStatusForm = document.getElementById("orderStatusForm");

  if (orderStatusForm) {
    const orderNumberInput = document.getElementById("orderNumber");
    const orderNumberField = document.getElementById("orderNumberField");
    const orderNumberError = document.getElementById("orderNumberError");
    const orderLoadingState = document.getElementById("orderLoadingState");
    const orderNotFoundState = document.getElementById("orderNotFoundState");
    const orderResultCard = document.getElementById("orderResultCard");
    const orderResultId = document.getElementById("orderResultId");
    const orderResultStatus = document.getElementById("orderResultStatus");
    const orderResultStatusPill = document.getElementById("orderResultStatusPill");
    const orderResultDelivery = document.getElementById("orderResultDelivery");
    const orderTimeline = document.getElementById("orderTimeline");
    const orderNumberPattern = /^NS\d{4,6}$/i;

    function resetOrderStates() {
      orderLoadingState.hidden = true;
      orderNotFoundState.hidden = true;
      orderResultCard.hidden = true;
    }

    function renderTimeline(steps) {
      orderTimeline.innerHTML = "";
      steps.forEach((step) => {
        const item = document.createElement("li");
        item.className = `timeline-item ${step.state}`;

        const marker = document.createElement("div");
        marker.className = "timeline-marker";
        if (step.icon) {
          marker.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">${step.icon}</span>`;
        }

        const text = document.createElement("div");
        text.innerHTML = `
          <p class="timeline-title">${step.title}</p>
          ${step.desc ? `<p class="timeline-desc">${step.desc}</p>` : ""}
        `;

        item.appendChild(marker);
        item.appendChild(text);
        orderTimeline.appendChild(item);
      });
    }

    orderStatusForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const rawValue = orderNumberInput.value.trim();

      resetOrderStates();
      orderNumberField.classList.remove("invalid");
      orderNumberError.textContent = "";

      // Empty input
      if (!rawValue) {
        orderNumberField.classList.add("invalid");
        orderNumberError.textContent = "Please enter an order number.";
        orderNumberInput.focus();
        return;
      }

      // Invalid format
      if (!orderNumberPattern.test(rawValue)) {
        orderNumberField.classList.add("invalid");
        orderNumberError.textContent = "Order numbers look like NS12345.";
        return;
      }

      const normalized = rawValue.toUpperCase();

      // Loading state
      orderLoadingState.hidden = false;

      // Future: Replace this timeout with a real API request to the order service.
      setTimeout(() => {
        orderLoadingState.hidden = true;
        const order = sampleOrders[normalized];

        if (!order) {
          orderNotFoundState.hidden = false;
          return;
        }

        orderResultId.textContent = `Order: ${normalized}`;
        orderResultStatus.textContent = order.status;
        orderResultDelivery.textContent = order.delivery;
        orderResultStatusPill.textContent = order.status;
        orderResultStatusPill.className = `status-pill ${order.statusClass}`;
        renderTimeline(order.timeline);
        orderResultCard.hidden = false;
      }, 700);
    });
  }

  /* ===============================================================
     11. RETURNS & REFUNDS PAGE
     =============================================================== */
  document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const panel = document.getElementById(trigger.getAttribute("aria-controls"));
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";

      trigger.setAttribute("aria-expanded", String(!isExpanded));
      panel.hidden = isExpanded;

      const icon = trigger.querySelector(".accordion-icon");
      if (icon) icon.textContent = isExpanded ? "expand_more" : "expand_less";
    });
  });

  // "Start a Return" modal, launched from the first accordion item
  const startReturnModal = document.getElementById("startReturnModal");
  const startReturnBtn = document.getElementById("startReturnBtn");
  const startReturnForm = document.getElementById("startReturnForm");
  const startReturnSuccess = document.getElementById("startReturnSuccess");

  if (startReturnBtn) {
    startReturnBtn.addEventListener("click", () => openModal(startReturnModal));
  }

  const startReturnModalClose = document.getElementById("startReturnModalClose");
  const startReturnCancel = document.getElementById("startReturnCancel");
  [startReturnModalClose, startReturnCancel].filter(Boolean).forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal(startReturnModal);
      resetStartReturnForm();
    });
  });

  function resetStartReturnForm() {
    if (!startReturnForm) return;
    startReturnForm.reset();
    startReturnForm.hidden = false;
    startReturnSuccess.hidden = true;
    startReturnForm.querySelectorAll(".form-field").forEach((field) => {
      field.classList.remove("invalid");
      const error = field.querySelector(".form-error");
      if (error) error.textContent = "";
    });
  }

  if (startReturnForm) {
    const returnOrderNumberInput = document.getElementById("returnOrderNumber");
    const returnReasonInput = document.getElementById("returnReason");

    startReturnForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let isValid = true;

      const orderField = returnOrderNumberInput.closest(".form-field");
      const orderError = document.getElementById("returnOrderNumberError");
      if (!returnOrderNumberInput.value.trim()) {
        orderField.classList.add("invalid");
        orderError.textContent = "Please enter your order number.";
        isValid = false;
      } else {
        orderField.classList.remove("invalid");
        orderError.textContent = "";
      }

      const reasonField = returnReasonInput.closest(".form-field");
      const reasonError = document.getElementById("returnReasonError");
      if (!returnReasonInput.value.trim()) {
        reasonField.classList.add("invalid");
        reasonError.textContent = "Please tell us why you're returning this item.";
        isValid = false;
      } else {
        reasonField.classList.remove("invalid");
        reasonError.textContent = "";
      }

      if (!isValid) return;

      // Future: Replace with a real API call to the returns service.
      startReturnForm.hidden = true;
      startReturnSuccess.hidden = false;
      showToast("Your return request has been started.");

      setTimeout(() => {
        closeModal(startReturnModal);
        resetStartReturnForm();
      }, 2200);
    });
  }

  /* ===============================================================
     12. MY TICKETS PAGE
     =============================================================== */
  const newTicketBtn = document.getElementById("newTicketBtn");
  if (newTicketBtn) {
    newTicketBtn.addEventListener("click", openContactModal);
  }

  /* ===============================================================
     13. PROFILE PAGE
     =============================================================== */
  const profileMyTicketsBtn = document.getElementById("profileMyTicketsBtn");
  if (profileMyTicketsBtn) {
    profileMyTicketsBtn.addEventListener("click", () => {
      window.location.href = "my-tickets.html";
    });
  }

  const profileSignOutBtn = document.getElementById("profileSignOutBtn");
  if (profileSignOutBtn) {
    profileSignOutBtn.addEventListener("click", () => openModal(signOutModal));
  }

  // Simple demo-only preference toggles (email / SMS notifications)
  [document.getElementById("emailPrefToggle"), document.getElementById("smsPrefToggle")]
    .filter(Boolean)
    .forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const isChecked = toggle.getAttribute("aria-checked") === "true";
        toggle.setAttribute("aria-checked", String(!isChecked));
      });
    });

  // --- Edit Profile ---
  const editProfileModal = document.getElementById("editProfileModal");
  const editProfileBtn = document.getElementById("editProfileBtn");
  const editProfileForm = document.getElementById("editProfileForm");
  const editProfileSuccess = document.getElementById("editProfileSuccess");

  // Display elements that reflect the current profile (summary card, info
  // table, and the header avatar/dropdown so everything stays in sync).
  const infoFullName = document.getElementById("infoFullName");
  const infoEmail = document.getElementById("infoEmail");
  const infoPhone = document.getElementById("infoPhone");
  const infoAddress = document.getElementById("infoAddress");
  const summaryNameText = document.getElementById("summaryNameText");
  const summaryEmailText = document.getElementById("summaryEmailText");
  const summaryAvatarText = document.getElementById("summaryAvatarText");
  const headerAvatarText = document.getElementById("headerAvatarText");
  const menuAvatarText = document.getElementById("menuAvatarText");
  const menuNameText = document.getElementById("menuNameText");
  const menuEmailText = document.getElementById("menuEmailText");

  function getInitials(fullName) {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function resetEditProfileForm() {
    if (!editProfileForm) return;
    editProfileForm.hidden = false;
    editProfileSuccess.hidden = true;
    editProfileForm.querySelectorAll(".form-field").forEach((field) => {
      field.classList.remove("invalid");
      const error = field.querySelector(".form-error");
      if (error) error.textContent = "";
    });
  }

  function openEditProfileModal() {
    if (!editProfileForm) return;
    resetEditProfileForm();
    // Pre-fill the form with the profile's current values.
    document.getElementById("editFullName").value = infoFullName.textContent.trim();
    document.getElementById("editEmail").value = infoEmail.textContent.trim();
    document.getElementById("editPhone").value = infoPhone.textContent.trim();
    document.getElementById("editAddress").value = infoAddress.textContent.trim();
    openModal(editProfileModal);
  }

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", openEditProfileModal);
  }

  const editProfileModalClose = document.getElementById("editProfileModalClose");
  const editProfileCancel = document.getElementById("editProfileCancel");
  [editProfileModalClose, editProfileCancel].filter(Boolean).forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal(editProfileModal);
      resetEditProfileForm();
    });
  });

  if (editProfileForm) {
    const editFullNameInput = document.getElementById("editFullName");
    const editEmailInput = document.getElementById("editEmail");
    const editPhoneInput = document.getElementById("editPhone");
    const editAddressInput = document.getElementById("editAddress");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    editProfileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let isValid = true;

      const nameField = editFullNameInput.closest(".form-field");
      const nameError = document.getElementById("editFullNameError");
      if (!editFullNameInput.value.trim()) {
        nameField.classList.add("invalid");
        nameError.textContent = "Please enter your full name.";
        isValid = false;
      } else {
        nameField.classList.remove("invalid");
        nameError.textContent = "";
      }

      const emailField = editEmailInput.closest(".form-field");
      const emailError = document.getElementById("editEmailError");
      if (!editEmailInput.value.trim()) {
        emailField.classList.add("invalid");
        emailError.textContent = "Please enter your email.";
        isValid = false;
      } else if (!emailPattern.test(editEmailInput.value.trim())) {
        emailField.classList.add("invalid");
        emailError.textContent = "Please enter a valid email address.";
        isValid = false;
      } else {
        emailField.classList.remove("invalid");
        emailError.textContent = "";
      }

      const phoneField = editPhoneInput.closest(".form-field");
      const phoneError = document.getElementById("editPhoneError");
      if (!editPhoneInput.value.trim()) {
        phoneField.classList.add("invalid");
        phoneError.textContent = "Please enter your phone number.";
        isValid = false;
      } else {
        phoneField.classList.remove("invalid");
        phoneError.textContent = "";
      }

      const addressField = editAddressInput.closest(".form-field");
      const addressError = document.getElementById("editAddressError");
      if (!editAddressInput.value.trim()) {
        addressField.classList.add("invalid");
        addressError.textContent = "Please enter your shipping address.";
        isValid = false;
      } else {
        addressField.classList.remove("invalid");
        addressError.textContent = "";
      }

      if (!isValid) return;

      // Future: Replace with a real API call to update the customer profile.
      const newName = editFullNameInput.value.trim();
      const newEmail = editEmailInput.value.trim();
      const newPhone = editPhoneInput.value.trim();
      const newAddress = editAddressInput.value.trim();
      const initials = getInitials(newName);

      infoFullName.textContent = newName;
      infoEmail.textContent = newEmail;
      infoPhone.textContent = newPhone;
      infoAddress.textContent = newAddress;

      if (summaryNameText) summaryNameText.textContent = newName;
      if (summaryEmailText) summaryEmailText.textContent = newEmail;
      if (summaryAvatarText) summaryAvatarText.textContent = initials;
      if (headerAvatarText) headerAvatarText.textContent = initials;
      if (menuAvatarText) menuAvatarText.textContent = initials;
      if (menuNameText) menuNameText.textContent = newName;
      if (menuEmailText) menuEmailText.textContent = newEmail;

      editProfileForm.hidden = true;
      editProfileSuccess.hidden = false;
      showToast("Your profile has been updated.");

      setTimeout(() => {
        closeModal(editProfileModal);
        resetEditProfileForm();
      }, 2000);
    });
  }
});
