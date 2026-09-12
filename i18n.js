/**
 * i18n.js
 * ------------------------------------------------------------------
 * 質問データ以外の「画面の文言」をまとめたファイルです。
 * ボタンの文字や、送信完了画面のメッセージなどはここを編集してください。
 * ja / en それぞれ書き換えれば、そのまま両言語に反映されます。
 * ------------------------------------------------------------------
 */

const UI_TEXT = {
  ja: {
    siteTitle: "ゲストハウス panipani 生口島",
    siteSubtitle: "宿泊者名簿",
    startHeading: "宿泊者名簿にご登録ください",
    startBody:
      "チェックインの前に、宿泊者名簿へのご入力をお願いしております。スマートフォンから2〜3分ほどで入力いただけます。",
    startButton: "はじめる",
    langButtonLabel: "English",
    back: "戻る",
    next: "次へ",
    saveAndReturn: "保存して確認画面に戻る",
    submit: "この内容で送信する",
    submitting: "送信しています…",
    required: "必須",
    optional: "任意",
    stepLabel: (current, total) => `質問 ${current} / ${total}`,
    guestSectionLabel: (n) => `宿泊者 ${n}`,
    filePickButton: "タップして写真を選択・撮影",
    fileChangeButton: "写真を変更する",
    termsLinkLabel: "宿泊約款を別ウィンドウで開く",
    reviewSectionBooking: "ご予約内容",
    reviewSectionTrip: "ご旅行について",
    reviewHeading: "入力内容のご確認",
    reviewBody: "内容をご確認のうえ、送信してください。修正する場合は各項目の「編集」から戻れます。",
    reviewEdit: "編集",
    noAnswer: "(未回答)",
    selectPlaceholder: "選択してください",
    completeHeading: "宿泊者名簿の登録が完了しました",
    completeBody:
      "ご入力ありがとうございました。当日はスタッフ一同、心よりお待ちしております。",
    completeSubBody: "この画面は閉じていただいて結構です。",
    errorRequired: "この項目は必須です",
    errorEmail: "メールアドレスの形式が正しくありません",
    charCounter: (current, max) => `文字数 ${max}文字以内(現在 ${current}文字)`,
    errorGeneric: "送信中にエラーが発生しました。時間をおいて再度お試しください。",
    consentCheckboxAria: "同意する",
  },
  en: {
    siteTitle: "Guesthouse panipani Ikuchijima",
    siteSubtitle: "Guest Register",
    startHeading: "Please complete the guest register",
    startBody:
      "Before check-in, we kindly ask every guest to fill out this short register. It takes about 2–3 minutes on your phone.",
    startButton: "Start",
    langButtonLabel: "日本語",
    back: "Back",
    next: "Next",
    saveAndReturn: "Save and return to review",
    submit: "Submit",
    submitting: "Submitting…",
    required: "Required",
    optional: "Optional",
    stepLabel: (current, total) => `Question ${current} of ${total}`,
    guestSectionLabel: (n) => `Guest ${n}`,
    filePickButton: "Tap to select or take a photo",
    fileChangeButton: "Change photo",
    termsLinkLabel: "Open terms in a new window",
    reviewSectionBooking: "Booking details",
    reviewSectionTrip: "Trip details",
    reviewHeading: "Please review your answers",
    reviewBody: "Check your answers below and submit. Tap \"Edit\" on any item to go back and change it.",
    reviewEdit: "Edit",
    noAnswer: "(no answer)",
    selectPlaceholder: "Please select",
    completeHeading: "Your guest register is complete",
    completeBody: "Thank you! Our staff are looking forward to welcoming you.",
    completeSubBody: "You may now close this page.",
    errorRequired: "This field is required",
    errorEmail: "Please enter a valid email address",
    charCounter: (current, max) => `Up to ${max} characters (${current} now)`,
    errorGeneric: "Something went wrong while submitting. Please try again shortly.",
    consentCheckboxAria: "I agree",
  },
};
