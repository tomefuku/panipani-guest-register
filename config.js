/**
 * config.js
 * ------------------------------------------------------------------
 * サイト全体の設定値をまとめるファイルです。
 *
 * ▼ Googleスプレッドシートと接続するとき
 *   README.md の手順で発行した「ウェブアプリのURL」を
 *   GAS_ENDPOINT_URL に貼り付けてください。
 *   空文字("")のままの場合は、送信データはこの端末のブラウザ内
 *   (localStorage)にのみ一時保存され、スプレッドシートには送られません。
 * ------------------------------------------------------------------
 */

const CONFIG = {
  // 例: "https://script.google.com/macros/s/xxxxxxxxxxxxxxxx/exec"
  GAS_ENDPOINT_URL:
    "https://script.google.com/macros/s/AKfycbyT-0v00uXz3kMJGIRX8Pk8UrzdCprjmBn9KdD1yM3BWElmVnF6IAx2f89unWgfwd7qMA/exec",

  // ブラウザ内に一時保存する際のキー名(通常は変更不要)
  LOCAL_BACKUP_KEY: "panipani_guest_register_backup",
};
