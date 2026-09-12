/**
 * app.js
 * ------------------------------------------------------------------
 * 画面の描画・ページ送り・入力チェックを行うファイルです。
 * 質問の中身は questions.js、文言は i18n.js、送信処理は submit.js に
 * 分離しているので、通常はこのファイルを編集する必要はありません。
 *
 * 質問は3つのグループを順番につなげた1本の流れとして扱います。
 *   BOOKING_QUESTIONS → (GUEST_QUESTIONS × 宿泊人数) → TRIP_QUESTIONS
 * ------------------------------------------------------------------
 */

const state = {
  lang: "ja",
  screen: "start", // "start" | "question" | "review" | "complete"
  stepIndex: 0,
  answers: {},
  submitting: false,
  errors: {},
  editMode: false, // 確認画面から「編集」で来た場合はtrue。次へ/戻るで確認画面に直帰する
};

const root = document.getElementById("app");

function t() {
  return UI_TEXT[state.lang];
}

/** グループ(booking/guest/trip)に応じた回答保存キーを組み立てる(「その他」欄など、独自idを持つ付随項目用) */
function siblingAnswerKey(question, id) {
  if (question.group === "guest") return `guest${question.guestIndex}_${id}`;
  return id;
}

/**
 * 質問全体の一本道のリストを作る。
 * GUEST_QUESTIONS は guestCount の回答に応じて、その場で複製される。
 * 各質問には答えの保存先キー(answerKey)と、表示用の宿泊者番号(guestIndex)を付与する。
 */
function buildFlow() {
  const flow = [];

  BOOKING_QUESTIONS.forEach((q) => {
    flow.push({ ...q, answerKey: q.id, group: "booking" });
  });

  const guestCount = Math.max(0, Math.min(20, parseInt(state.answers.guestCount, 10) || 0));
  for (let i = 1; i <= guestCount; i++) {
    GUEST_QUESTIONS.forEach((q) => {
      flow.push({
        ...q,
        answerKey: `guest${i}_${q.id}`,
        group: "guest",
        guestIndex: i,
        baseId: q.id,
      });
    });
  }

  TRIP_QUESTIONS.forEach((q) => {
    flow.push({ ...q, answerKey: q.id, group: "trip" });
  });

  return flow.filter((q) => questionIsVisible(q));
}

function questionIsVisible(q) {
  if (!q.showIf) return true;
  if (q.group === "guest") {
    const siblingKey = `guest${q.guestIndex}_${q.showIf.id}`;
    return state.answers[siblingKey] === q.showIf.equals;
  }
  return state.answers[q.showIf.id] === q.showIf.equals;
}

function isAnswered(question) {
  const value = state.answers[question.answerKey];
  if (question.type === "checkbox") return Array.isArray(value) && value.length > 0;
  if (question.type === "consent") return value === true;
  if (question.type === "file") return !!(value && value.dataUrl);
  if (value === undefined || value === null) return false;
  return String(value).trim().length > 0;
}

function validateCurrent(question) {
  const errors = {};
  if (question.required && !isAnswered(question)) {
    errors[question.answerKey] = t().errorRequired;
  }
  return errors;
}

function startForm() {
  state.screen = "question";
  state.stepIndex = 0;
  render();
}

function goNext() {
  const flow = buildFlow();
  const question = flow[state.stepIndex];
  const errors = validateCurrent(question);
  state.errors = errors;
  if (Object.keys(errors).length > 0) {
    render();
    return;
  }
  if (state.editMode) {
    state.editMode = false;
    state.screen = "review";
    render();
    return;
  }
  if (state.stepIndex < flow.length - 1) {
    state.stepIndex += 1;
    render();
  } else {
    state.screen = "review";
    render();
  }
}

function goBack() {
  if (state.screen === "review") {
    state.screen = "question";
    state.stepIndex = buildFlow().length - 1;
    render();
    return;
  }
  if (state.editMode) {
    state.editMode = false;
    state.screen = "review";
    render();
    return;
  }
  if (state.stepIndex > 0) {
    state.stepIndex -= 1;
    render();
  } else {
    state.screen = "start";
    render();
  }
}

function editQuestion(answerKey) {
  const flow = buildFlow();
  const index = flow.findIndex((q) => q.answerKey === answerKey);
  if (index >= 0) {
    state.stepIndex = index;
    state.screen = "question";
    state.editMode = true;
    render();
  }
}

function setAnswer(answerKey, value) {
  state.answers[answerKey] = value;
  if (state.errors[answerKey]) delete state.errors[answerKey];
}

function toggleLanguage() {
  state.lang = state.lang === "ja" ? "en" : "ja";
  render();
}

async function handleSubmit() {
  state.submitting = true;
  render();
  try {
    const result = await submitGuestRegister(buildAnswerSummary());
    if (result && result.ok) {
      state.screen = "complete";
    } else {
      state.errors = { _submit: t().errorGeneric };
    }
  } catch (err) {
    console.error("送信処理中に予期しないエラーが発生しました", err);
    state.errors = { _submit: t().errorGeneric };
  }
  state.submitting = false;
  render();
}

/**
 * 送信用データを組み立てる。
 * booking / guests(配列) / trip の3つに分けて出力する。
 */
function buildAnswerSummary() {
  const flow = buildFlow();
  const summary = { booking: {}, guests: [], trip: {} };
  const guestMap = {};

  function addEntry(group, guestIndex, key, entry) {
    if (group === "booking") {
      summary.booking[key] = entry;
    } else if (group === "trip") {
      summary.trip[key] = entry;
    } else if (group === "guest") {
      if (!guestMap[guestIndex]) guestMap[guestIndex] = {};
      guestMap[guestIndex][key] = entry;
    }
  }

  flow.forEach((q) => {
    const rawValue = state.answers[q.answerKey];
    const value = q.type === "file" && rawValue ? { fileName: rawValue.name } : rawValue;
    addEntry(q.group, q.guestIndex, q.baseId || q.id, {
      question_ja: q.label.ja,
      question_en: q.label.en,
      value: value !== undefined ? value : null,
    });

    // ファイルは容量が大きいため、実データは別のキーにそのまま残す
    if (q.type === "file" && rawValue) {
      addEntry(q.group, q.guestIndex, (q.baseId || q.id) + "_data", rawValue.dataUrl);
    }

    // チェックボックス質問に付随する「その他」欄
    if (q.extra) {
      const extraKey = siblingAnswerKey(q, q.extra.id);
      const extraValue = state.answers[extraKey];
      if (extraValue) {
        addEntry(q.group, q.guestIndex, q.extra.id, {
          question_ja: q.extra.label.ja,
          question_en: q.extra.label.en,
          value: extraValue,
        });
      }
    }
  });

  Object.keys(guestMap)
    .sort((a, b) => Number(a) - Number(b))
    .forEach((key) => summary.guests.push(guestMap[key]));

  return summary;
}

/* ---------------------------------------------------------------- */
/* 描画                                                               */
/* ---------------------------------------------------------------- */

function render() {
  root.innerHTML = "";
  root.appendChild(renderHeader());

  if (state.screen === "start") root.appendChild(renderStart());
  if (state.screen === "question") root.appendChild(renderQuestion());
  if (state.screen === "review") root.appendChild(renderReview());
  if (state.screen === "complete") root.appendChild(renderComplete());
}

function el(tag, className, children) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  (children || []).forEach((child) => {
    if (child) node.appendChild(child);
  });
  return node;
}

function textEl(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = text;
  return node;
}

function renderHeader() {
  const header = el("header", "site-header", [
    el("div", "site-header__brand", [
      textEl("p", "site-header__title", t().siteTitle),
      textEl("p", "site-header__subtitle", t().siteSubtitle),
    ]),
  ]);

  const langButton = textEl("button", "lang-toggle", t().langButtonLabel);
  langButton.type = "button";
  langButton.addEventListener("click", toggleLanguage);
  header.appendChild(langButton);

  if (state.screen === "question") {
    const flow = buildFlow();
    const progress = el("div", "progress", []);
    const bar = el("div", "progress__bar", []);
    const pct = ((state.stepIndex + 1) / flow.length) * 100;
    bar.style.width = pct + "%";
    progress.appendChild(bar);
    const wrap = el("div", "progress-wrap", [header, progress]);
    const stepLabel = textEl(
      "p",
      "progress-label",
      t().stepLabel(state.stepIndex + 1, flow.length)
    );
    wrap.appendChild(stepLabel);
    return wrap;
  }

  return header;
}

function renderStart() {
  const wrap = el("section", "screen screen--start", []);
  wrap.appendChild(textEl("h1", "screen__heading", t().startHeading));
  wrap.appendChild(textEl("p", "screen__body", t().startBody));
  const startButton = textEl("button", "btn btn--primary btn--large", t().startButton);
  startButton.type = "button";
  startButton.addEventListener("click", startForm);
  wrap.appendChild(startButton);
  return wrap;
}

function renderQuestion() {
  const flow = buildFlow();
  if (state.stepIndex >= flow.length) state.stepIndex = flow.length - 1;
  const question = flow[state.stepIndex];

  const wrap = el("section", "screen screen--question", []);

  if (question.group === "guest") {
    wrap.appendChild(
      textEl("p", "guest-tag", t().guestSectionLabel(question.guestIndex))
    );
  }

  const badge = textEl(
    "span",
    "badge " + (question.required ? "badge--required" : "badge--optional"),
    question.required ? t().required : t().optional
  );
  wrap.appendChild(badge);
  wrap.appendChild(textEl("h1", "screen__heading", question.label[state.lang]));
  if (question.description && question.description[state.lang]) {
    wrap.appendChild(textEl("p", "screen__body", question.description[state.lang]));
  }

  wrap.appendChild(renderInput(question));

  if (state.errors[question.answerKey]) {
    wrap.appendChild(textEl("p", "field-error", state.errors[question.answerKey]));
  }

  wrap.appendChild(renderNav());
  return wrap;
}

/** cards/checkbox共通:「その他」の自由記述欄が設定されていれば、選択肢の下に続けて表示する */
function wrapWithExtra(question, group) {
  if (!question.extra) return group;

  const wrap = el("div", "checkbox-with-extra", [group]);
  const extraKey = siblingAnswerKey(question, question.extra.id);
  wrap.appendChild(textEl("p", "extra-label", question.extra.label[state.lang]));
  const extraInput = document.createElement("input");
  extraInput.type = "text";
  extraInput.className = "input-text";
  extraInput.value = state.answers[extraKey] || "";
  extraInput.placeholder = (question.extra.placeholder && question.extra.placeholder[state.lang]) || "";
  extraInput.addEventListener("input", (e) => setAnswer(extraKey, e.target.value));
  wrap.appendChild(extraInput);
  return wrap;
}

function renderInput(question) {
  const value = state.answers[question.answerKey];

  if (question.type === "cards") {
    const group = el("div", "cards", []);
    question.options.forEach((option) => {
      const isSelected = value === option.value;
      const card = textEl(
        "button",
        "card" + (isSelected ? " card--selected" : ""),
        option.label[state.lang]
      );
      card.type = "button";
      card.addEventListener("click", () => {
        setAnswer(question.answerKey, option.value);
        render();
      });
      group.appendChild(card);
    });
    return wrapWithExtra(question, group);
  }

  if (question.type === "checkbox") {
    const selected = Array.isArray(value) ? value : [];
    const group = el("div", "cards", []);
    question.options.forEach((option) => {
      const isSelected = selected.includes(option.value);
      const card = textEl(
        "button",
        "card" + (isSelected ? " card--selected" : ""),
        option.label[state.lang]
      );
      card.type = "button";
      card.addEventListener("click", () => {
        const next = isSelected
          ? selected.filter((v) => v !== option.value)
          : [...selected, option.value];
        setAnswer(question.answerKey, next);
        render();
      });
      group.appendChild(card);
    });
    return wrapWithExtra(question, group);
  }

  if (question.type === "select") {
    const select = document.createElement("select");
    select.className = "input-select";
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = t().selectPlaceholder;
    select.appendChild(placeholderOption);
    question.options.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option.value;
      opt.textContent = option.label[state.lang];
      if (value === option.value) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener("change", (e) => setAnswer(question.answerKey, e.target.value));
    return el("div", "input-wrap", [select]);
  }

  if (question.type === "textarea") {
    const textarea = document.createElement("textarea");
    textarea.className = "input-textarea";
    textarea.rows = 4;
    textarea.value = value || "";
    textarea.placeholder = (question.placeholder && question.placeholder[state.lang]) || "";
    textarea.addEventListener("input", (e) => setAnswer(question.answerKey, e.target.value));
    return el("div", "input-wrap", [textarea]);
  }

  if (question.type === "file") {
    return renderFileInput(question, value);
  }

  if (question.type === "consent") {
    return renderConsent(question, value);
  }

  // text / email / tel / number / date / datetime / passport
  const input = document.createElement("input");
  const typeMap = {
    text: "text",
    email: "email",
    tel: "tel",
    number: "number",
    date: "date",
    datetime: "datetime-local",
    passport: "text",
  };
  input.type = typeMap[question.type] || "text";
  input.className = "input-text";
  input.value = value !== undefined && value !== null ? value : "";
  input.placeholder = (question.placeholder && question.placeholder[state.lang]) || "";
  if (question.type === "number") {
    if (question.min !== undefined) input.min = question.min;
    if (question.max !== undefined) input.max = question.max;
  }

  if (question.maxLength) {
    input.maxLength = question.maxLength;
    const counter = textEl("p", "char-counter", "");
    const updateCounter = () => {
      counter.textContent = t().charCounter(input.value.length, question.maxLength);
    };
    input.addEventListener("input", (e) => {
      setAnswer(question.answerKey, e.target.value);
      updateCounter();
    });
    updateCounter();
    return el("div", "input-wrap", [input, counter]);
  }

  input.addEventListener("input", (e) => setAnswer(question.answerKey, e.target.value));
  return el("div", "input-wrap", [input]);
}

function renderFileInput(question, value) {
  const wrap = el("div", "file-field", []);

  if (value && value.dataUrl) {
    const preview = el("div", "file-preview", []);
    const img = document.createElement("img");
    img.src = value.dataUrl;
    img.alt = value.name || "";
    preview.appendChild(img);
    wrap.appendChild(preview);
  }

  const label = document.createElement("label");
  label.className = "file-button";
  label.textContent = value && value.dataUrl ? t().fileChangeButton : t().filePickButton;

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.capture = "environment";
  input.className = "file-input-hidden";
  input.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAnswer(question.answerKey, { dataUrl: reader.result, name: file.name });
      render();
    };
    reader.readAsDataURL(file);
  });

  label.appendChild(input);
  wrap.appendChild(label);
  return wrap;
}

function renderConsent(question, value) {
  const wrap = el("div", "consent-wrap", []);

  if (TERMS_TEXT && TERMS_TEXT[state.lang]) {
    const box = el("div", "terms-box", []);
    const pre = document.createElement("pre");
    pre.className = "terms-box__text";
    pre.textContent = TERMS_TEXT[state.lang];
    box.appendChild(pre);
    wrap.appendChild(box);
  }

  if (typeof TERMS_URL === "string" && TERMS_URL) {
    const link = document.createElement("a");
    link.href = TERMS_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "terms-link";
    link.textContent = t().termsLinkLabel;
    wrap.appendChild(link);
  }

  const label = document.createElement("label");
  label.className = "consent";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = value === true;
  checkbox.setAttribute("aria-label", t().consentCheckboxAria);
  checkbox.addEventListener("change", (e) => setAnswer(question.answerKey, e.target.checked));
  const span = textEl("span", "consent__text", question.consentText[state.lang]);
  label.appendChild(checkbox);
  label.appendChild(span);
  wrap.appendChild(label);

  return wrap;
}

function renderNav() {
  const nav = el("div", "nav-bar", []);
  const backButton = textEl("button", "btn btn--ghost", t().back);
  backButton.type = "button";
  backButton.addEventListener("click", goBack);

  const nextLabel = state.editMode ? t().saveAndReturn : t().next;
  const nextButton = textEl("button", "btn btn--primary", nextLabel);
  nextButton.type = "button";
  nextButton.addEventListener("click", goNext);

  nav.appendChild(backButton);
  nav.appendChild(nextButton);
  return nav;
}

function renderReview() {
  const flow = buildFlow();
  const wrap = el("section", "screen screen--review", []);
  wrap.appendChild(textEl("h1", "screen__heading", t().reviewHeading));
  wrap.appendChild(textEl("p", "screen__body", t().reviewBody));

  const list = el("div", "review-list", []);
  let currentGuestIndex = null;

  flow.forEach((question) => {
    if (question.group === "guest" && question.guestIndex !== currentGuestIndex) {
      currentGuestIndex = question.guestIndex;
      list.appendChild(
        textEl("p", "review-section-title", t().guestSectionLabel(currentGuestIndex))
      );
    }
    if (question.group !== "guest" && currentGuestIndex !== null) {
      currentGuestIndex = null;
    }

    const row = el("div", "review-item", []);
    const textCol = el("div", "review-item__text", [
      textEl("p", "review-item__label", question.label[state.lang]),
    ]);

    if (question.type === "file") {
      const value = state.answers[question.answerKey];
      if (value && value.dataUrl) {
        const img = document.createElement("img");
        img.src = value.dataUrl;
        img.className = "review-item__thumb";
        textCol.appendChild(img);
      } else {
        textCol.appendChild(textEl("p", "review-item__value", t().noAnswer));
      }
    } else {
      textCol.appendChild(textEl("p", "review-item__value", formatAnswer(question)));
    }

    if (question.extra) {
      const extraKey = siblingAnswerKey(question, question.extra.id);
      const extraValue = state.answers[extraKey];
      if (extraValue) {
        textCol.appendChild(
          textEl("p", "review-item__extra", `${question.extra.label[state.lang]}: ${extraValue}`)
        );
      }
    }

    const editButton = textEl("button", "review-item__edit", t().reviewEdit);
    editButton.type = "button";
    editButton.addEventListener("click", () => editQuestion(question.answerKey));
    row.appendChild(textCol);
    row.appendChild(editButton);
    list.appendChild(row);
  });
  wrap.appendChild(list);

  if (state.errors._submit) {
    wrap.appendChild(textEl("p", "field-error", state.errors._submit));
  }

  const nav = el("div", "nav-bar", []);
  const backButton = textEl("button", "btn btn--ghost", t().back);
  backButton.type = "button";
  backButton.addEventListener("click", goBack);

  const submitButton = textEl(
    "button",
    "btn btn--primary",
    state.submitting ? t().submitting : t().submit
  );
  submitButton.type = "button";
  submitButton.disabled = state.submitting;
  submitButton.addEventListener("click", handleSubmit);

  nav.appendChild(backButton);
  nav.appendChild(submitButton);
  wrap.appendChild(nav);

  return wrap;
}

function formatAnswer(question) {
  const value = state.answers[question.answerKey];
  if (!isAnswered(question)) return t().noAnswer;

  if (question.type === "cards" || question.type === "select") {
    const option = question.options.find((o) => o.value === value);
    return option ? option.label[state.lang] : t().noAnswer;
  }
  if (question.type === "checkbox") {
    const labels = (value || []).map((v) => {
      const option = question.options.find((o) => o.value === v);
      return option ? option.label[state.lang] : v;
    });
    return labels.join(" / ");
  }
  if (question.type === "consent") {
    return value ? "✓" : t().noAnswer;
  }
  return String(value);
}

function renderComplete() {
  const wrap = el("section", "screen screen--complete", []);
  wrap.appendChild(el("div", "complete-mark", []));
  wrap.appendChild(textEl("h1", "screen__heading", t().completeHeading));
  wrap.appendChild(textEl("p", "screen__body", t().completeBody));

  const info = COMPLETE_INFO && COMPLETE_INFO[state.lang];
  if (info) {
    const infoWrap = el("div", "complete-info", []);
    if (info.notice) {
      infoWrap.appendChild(textEl("p", "complete-notice", info.notice));
    }
    (info.sections || []).forEach((section) => {
      infoWrap.appendChild(textEl("h2", "complete-info__title", section.title));
      const body = document.createElement("pre");
      body.className = "complete-info__body";
      body.textContent = section.body;
      infoWrap.appendChild(body);
    });
    if (info.linkUrl) {
      const link = document.createElement("a");
      link.href = info.linkUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "complete-info__link";
      link.textContent = info.linkLabel || info.linkUrl;
      infoWrap.appendChild(link);
    }
    wrap.appendChild(infoWrap);
  }

  wrap.appendChild(textEl("p", "screen__body screen__body--muted", t().completeSubBody));
  return wrap;
}

render();
