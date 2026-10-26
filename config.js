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
    "https://script.google.com/macros/s/AKfycbwxoJuXCE391iXK_rIPMYTGw5isgd6I0J4L0MY_HXwQPlIEFcpi-B7n7sbuv4Wxl97g/exec",

  // ブラウザ内に一時保存する際のキー名(通常は変更不要)
  LOCAL_BACKUP_KEY: "panipani_guest_register_backup",
};
