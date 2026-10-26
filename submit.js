/**
 * submit.js
 * 「フォーム画面」と「データの送り先」を分離するためのファイルです。
 * app.js は submitGuestRegister() だけを呼び出します。
 *
 * 動作:
 *   1. 端末のブラウザ内にバックアップ保存(写真は除く)
 *   2. Google Apps Script に送信し、「保存できた」返事を確認
 *   3. 失敗したら最大3回まで自動再送
 *   4. 確認できなければ { ok:false } → 画面はエラー表示(嘘の完了を出さない)
 * submissionId により、再送しても名簿は二重になりません。
 */

let lastAttempt = null;

function newSubmissionId() {
  try {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  } catch (e) {}
  return "id-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function stripPhotos(answers) {
  return JSON.parse(
    JSON.stringify(answers, (k, v) =>
      typeof k === "string" && k.endsWith("_data") ? "(写真は省略)" : v
    )
  );
}

function saveLocalBackup(payload) {
  try {
    const key = CONFIG.LOCAL_BACKUP_KEY;
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    const entry = {
      submissionId: payload.submissionId,
      submittedAt: payload.submittedAt,
      answers: stripPhotos(payload.answers),
    };
    const i = list.findIndex((x) => x.submissionId === entry.submissionId);
    if (i >= 0) list[i] = entry;
    else list.push(entry);
    localStorage.setItem(key, JSON.stringify(list));
    return true;
  } catch (e) {
    console.warn("ローカルバックアップの保存に失敗しました", e);
    return false;
  }
}

async function postToGas(payload) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 90000);
  try {
    const res = await fetch(CONFIG.GAS_ENDPOINT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      throw new Error("返答が不正です: " + text.slice(0, 100));
    }
    if (json.result !== "success") {
      throw new Error("保存に失敗: " + (json.message || json.result));
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
}

async function submitGuestRegister(answers) {
  const json = JSON.stringify(answers);
  if (!lastAttempt || lastAttempt.json !== json) {
    lastAttempt = { json: json, submissionId: newSubmissionId() };
  }
  const payload = {
    submissionId: lastAttempt.submissionId,
    submittedAt: new Date().toISOString(),
    answers: answers,
  };

  saveLocalBackup(payload);

  if (!CONFIG.GAS_ENDPOINT_URL) {
    console.error("[panipani guest register] GAS_ENDPOINT_URL が未設定です");
    return { ok: false, reason: "no-endpoint" };
  }

  const delays = [0, 2000, 5000];
  for (let i = 0; i < delays.length; i++) {
    if (delays[i]) await wait(delays[i]);
    try {
      await postToGas(payload);
      return { ok: true };
    } catch (err) {
      console.error("送信失敗 (" + (i + 1) + "回目)", err);
    }
  }
  return { ok: false, reason: "failed" };
}
