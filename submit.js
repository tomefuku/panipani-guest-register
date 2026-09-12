/**
 * submit.js
 * ------------------------------------------------------------------
 * 「フォーム画面」と「データの送り先」を分離するためのファイルです。
 * app.js はこのファイルの submitGuestRegister() だけを呼び出します。
 * 送り先を変えたい場合は、このファイルの中だけを書き換えればOKです。
 *
 * 現在の動作:
 *   1. まず端末のブラウザ内(localStorage)にバックアップとして保存します。
 *   2. CONFIG.GAS_ENDPOINT_URL が設定されていれば、
 *      Google Apps Script(GAS)のウェブアプリへも送信を試みます。
 *
 * ゲストの送信操作そのものは、通信状況などでスプレッドシートへの
 * 送信がうまくいかなかった場合でも失敗として扱いません(その場合でも
 * ブラウザ内のバックアップは残るため、後から確認・再送できます)。
 * ゲストの目の前で「送信エラー」を出さないための設計です。
 * ------------------------------------------------------------------
 */

async function submitGuestRegister(answers) {
  const payload = {
    submittedAt: new Date().toISOString(),
    answers: answers,
  };

  // 1. ローカルバックアップ(スプレッドシート接続前でもデータを失わないため)
  let localSaved = false;
  try {
    const key = CONFIG.LOCAL_BACKUP_KEY;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push(payload);
    localStorage.setItem(key, JSON.stringify(existing));
    localSaved = true;
  } catch (storageError) {
    console.warn("ローカルバックアップの保存に失敗しました", storageError);
  }

  // 2. Googleスプレッドシートへの送信(URL未設定の場合はスキップ)
  if (CONFIG.GAS_ENDPOINT_URL) {
    try {
      await fetch(CONFIG.GAS_ENDPOINT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      // no-cors のため実際に成功したかはここでは判定できません。
    } catch (networkError) {
      // 通信エラーがあっても、ゲストの送信自体は失敗にしません
      // (ローカルバックアップは残っているため、後から確認できます)。
      console.error("スプレッドシートへの送信に失敗しました", networkError);
    }
  } else {
    console.info(
      "[panipani guest register] GAS_ENDPOINT_URL が未設定のため、今回はブラウザ内保存のみ行いました。"
    );
  }

  // ローカルバックアップにも完全に失敗した場合のみ、エラー扱いにします
  return { ok: localSaved || !!CONFIG.GAS_ENDPOINT_URL };
}
