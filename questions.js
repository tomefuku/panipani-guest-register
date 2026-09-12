/**
 * questions.js
 * ------------------------------------------------------------------
 * 質問データを3つのグループに分けて管理しています。
 *
 *   1. BOOKING_QUESTIONS … 予約全体で1回だけ聞く質問(チェックイン日など)
 *   2. GUEST_QUESTIONS   … 宿泊者1名ごとに繰り返し聞く質問(お名前など)
 *                            「ご宿泊者人数」で入力された人数の分だけ、
 *                            自動的に「宿泊者1」「宿泊者2」…と連続して
 *                            表示されます(最初からやり直す必要はありません)。
 *   3. TRIP_QUESTIONS    … 全員分の宿泊者情報の入力が終わったあとに、
 *                            予約全体について1回だけ聞く質問
 *                            (ご利用目的・予約サイトなど)
 *
 * 質問の追加・変更方法は、各質問オブジェクトの
 *   label / options / required / description / showIf
 * を編集するだけで反映されます。
 *
 * ▼ 宿泊者ごとの質問を増やしたいとき
 *   GUEST_QUESTIONS 配列に質問を追加してください。人数分、自動的に
 *   繰り返し表示されます。
 *
 * ▼ 宿泊者ごとの質問の中で「他の質問の回答に応じて表示を切り替えたい」とき
 *   showIf: { id: "residence", equals: "overseas" }
 *   のように、GUEST_QUESTIONS内の他の質問の id を指定してください
 *   (宿泊者ごとに、その人自身の回答を見て判定します)。
 *
 * ▼ 画像・写真のアップロード欄を増やしたいとき
 *   type: "file" の質問を追加してください(パスポートの写しの項目が実例です)。
 *
 * ▼ 宿泊約款の本文を入れたいとき
 *   ファイル下部の TERMS_TEXT.ja / TERMS_TEXT.en を、実際の約款の
 *   文章に書き換えてください。ここに入れた文章がそのまま確認画面の
 *   スクロールボックスに表示され、その場で読めるようになります。
 *   (Googleドキュメントへのリンクも併記したい場合は TERMS_URL を設定してください。
 *    不要な場合は空文字 "" のままにしてください。)
 * ------------------------------------------------------------------
 */

const PREFECTURES = [
  { value: "hokkaido", label: { ja: "北海道", en: "Hokkaido" } },
  { value: "aomori", label: { ja: "青森県", en: "Aomori" } },
  { value: "iwate", label: { ja: "岩手県", en: "Iwate" } },
  { value: "miyagi", label: { ja: "宮城県", en: "Miyagi" } },
  { value: "akita", label: { ja: "秋田県", en: "Akita" } },
  { value: "yamagata", label: { ja: "山形県", en: "Yamagata" } },
  { value: "fukushima", label: { ja: "福島県", en: "Fukushima" } },
  { value: "ibaraki", label: { ja: "茨城県", en: "Ibaraki" } },
  { value: "tochigi", label: { ja: "栃木県", en: "Tochigi" } },
  { value: "gunma", label: { ja: "群馬県", en: "Gunma" } },
  { value: "saitama", label: { ja: "埼玉県", en: "Saitama" } },
  { value: "chiba", label: { ja: "千葉県", en: "Chiba" } },
  { value: "tokyo", label: { ja: "東京都", en: "Tokyo" } },
  { value: "kanagawa", label: { ja: "神奈川県", en: "Kanagawa" } },
  { value: "niigata", label: { ja: "新潟県", en: "Niigata" } },
  { value: "toyama", label: { ja: "富山県", en: "Toyama" } },
  { value: "ishikawa", label: { ja: "石川県", en: "Ishikawa" } },
  { value: "fukui", label: { ja: "福井県", en: "Fukui" } },
  { value: "yamanashi", label: { ja: "山梨県", en: "Yamanashi" } },
  { value: "nagano", label: { ja: "長野県", en: "Nagano" } },
  { value: "gifu", label: { ja: "岐阜県", en: "Gifu" } },
  { value: "shizuoka", label: { ja: "静岡県", en: "Shizuoka" } },
  { value: "aichi", label: { ja: "愛知県", en: "Aichi" } },
  { value: "mie", label: { ja: "三重県", en: "Mie" } },
  { value: "shiga", label: { ja: "滋賀県", en: "Shiga" } },
  { value: "kyoto", label: { ja: "京都府", en: "Kyoto" } },
  { value: "osaka", label: { ja: "大阪府", en: "Osaka" } },
  { value: "hyogo", label: { ja: "兵庫県", en: "Hyogo" } },
  { value: "nara", label: { ja: "奈良県", en: "Nara" } },
  { value: "wakayama", label: { ja: "和歌山県", en: "Wakayama" } },
  { value: "tottori", label: { ja: "鳥取県", en: "Tottori" } },
  { value: "shimane", label: { ja: "島根県", en: "Shimane" } },
  { value: "okayama", label: { ja: "岡山県", en: "Okayama" } },
  { value: "hiroshima", label: { ja: "広島県", en: "Hiroshima" } },
  { value: "yamaguchi", label: { ja: "山口県", en: "Yamaguchi" } },
  { value: "tokushima", label: { ja: "徳島県", en: "Tokushima" } },
  { value: "kagawa", label: { ja: "香川県", en: "Kagawa" } },
  { value: "ehime", label: { ja: "愛媛県", en: "Ehime" } },
  { value: "kochi", label: { ja: "高知県", en: "Kochi" } },
  { value: "fukuoka", label: { ja: "福岡県", en: "Fukuoka" } },
  { value: "saga", label: { ja: "佐賀県", en: "Saga" } },
  { value: "nagasaki", label: { ja: "長崎県", en: "Nagasaki" } },
  { value: "kumamoto", label: { ja: "熊本県", en: "Kumamoto" } },
  { value: "oita", label: { ja: "大分県", en: "Oita" } },
  { value: "miyazaki", label: { ja: "宮崎県", en: "Miyazaki" } },
  { value: "kagoshima", label: { ja: "鹿児島県", en: "Kagoshima" } },
  { value: "okinawa", label: { ja: "沖縄県", en: "Okinawa" } },
];

const BOOKING_QUESTIONS = [
  {
    id: "checkinDate",
    type: "date",
    required: true,
    label: {
      ja: "チェックイン日を教えてください",
      en: "What is your check-in date?",
    },
    description: { ja: "", en: "" },
  },
  {
    id: "checkoutDate",
    type: "date",
    required: true,
    label: {
      ja: "チェックアウト日を教えてください",
      en: "What is your check-out date?",
    },
    description: { ja: "", en: "" },
  },
  {
    id: "guestCount",
    type: "number",
    required: true,
    min: 1,
    max: 20,
    placeholder: { ja: "例: 3", en: "e.g. 3" },
    label: {
      ja: "ご宿泊者人数は何名様ですか？",
      en: "How many guests are staying?",
    },
    description: {
      ja: "入力した人数分、この後お一人ずつ続けてご入力いただけます。",
      en: "You will be asked to enter details for each guest, one after another.",
    },
  },
  {
    id: "representativePhone",
    type: "tel",
    required: true,
    maxLength: 20,
    placeholder: { ja: "例: 090-1234-5678", en: "e.g. +81 90-1234-5678" },
    label: {
      ja: "代表者電話番号を教えてください",
      en: "What is the representative's phone number?",
    },
    description: { ja: "", en: "" },
  },
];

const GUEST_QUESTIONS = [
  {
    id: "name",
    type: "text",
    required: true,
    placeholder: { ja: "例: 瀬戸田 太郎", en: "e.g. Taro Setoda" },
    label: {
      ja: "お名前を教えてください",
      en: "What is your name?",
    },
    description: { ja: "", en: "" },
  },
  {
    id: "age",
    type: "number",
    required: true,
    min: 0,
    max: 120,
    placeholder: { ja: "例: 32", en: "e.g. 32" },
    label: {
      ja: "ご年齢を教えてください",
      en: "What is your age?",
    },
    description: { ja: "", en: "" },
  },
  {
    id: "gender",
    type: "cards",
    required: true,
    label: {
      ja: "性別を教えてください",
      en: "What is your gender?",
    },
    description: { ja: "", en: "" },
    options: [
      { value: "male", label: { ja: "男性", en: "Male" } },
      { value: "female", label: { ja: "女性", en: "Female" } },
      { value: "other", label: { ja: "その他", en: "Other" } },
    ],
    extra: {
      id: "genderOther",
      label: {
        ja: "その他の場合はこちらにご記入ください",
        en: "If other, please describe",
      },
      placeholder: { ja: "", en: "" },
    },
  },
  {
    id: "occupation",
    type: "cards",
    required: true,
    label: {
      ja: "ご職業を教えてください",
      en: "What is your occupation?",
    },
    description: { ja: "", en: "" },
    options: [
      { value: "company_employee", label: { ja: "会社員", en: "Company Employee" } },
      { value: "company_executive", label: { ja: "会社役員", en: "Company Executive" } },
      { value: "civil_servant", label: { ja: "公務員", en: "Civil servant" } },
      { value: "self_employed", label: { ja: "自営業", en: "Self-employed" } },
      { value: "homemaker", label: { ja: "主夫/主婦", en: "Homemaker" } },
      { value: "part_time", label: { ja: "アルバイト", en: "Part-time worker" } },
      { value: "student", label: { ja: "学生", en: "Student" } },
      { value: "other", label: { ja: "その他", en: "Other" } },
    ],
    extra: {
      id: "occupationOther",
      label: {
        ja: "その他の場合はこちらにご記入ください",
        en: "If other, please describe",
      },
      placeholder: { ja: "", en: "" },
    },
  },
  {
    id: "residence",
    type: "cards",
    required: true,
    label: {
      ja: "お住まいを教えてください",
      en: "Where do you live?",
    },
    description: { ja: "", en: "" },
    options: [
      { value: "japan", label: { ja: "日本", en: "Japan" } },
      { value: "overseas", label: { ja: "海外", en: "Overseas" } },
    ],
  },
  {
    id: "prefecture",
    type: "select",
    required: true,
    showIf: { id: "residence", equals: "japan" },
    label: {
      ja: "都道府県を教えてください",
      en: "Which prefecture do you live in?",
    },
    description: { ja: "", en: "" },
    options: PREFECTURES,
  },
  {
    id: "address",
    type: "text",
    required: true,
    showIf: { id: "residence", equals: "japan" },
    placeholder: {
      ja: "例: 尾道市瀬戸田町瀬戸田104-1",
      en: "e.g. 104-1 Setoda, Setoda-cho, Onomichi",
    },
    label: {
      ja: "ご住所を教えてください",
      en: "What is your address?",
    },
    description: { ja: "", en: "" },
  },
  {
    id: "passportNumber",
    type: "passport",
    required: true,
    showIf: { id: "residence", equals: "overseas" },
    placeholder: { ja: "例: AB1234567", en: "e.g. AB1234567" },
    label: {
      ja: "旅券番号(パスポート番号)を教えてください",
      en: "What is your passport number?",
    },
    description: {
      ja: "旅館業法に基づき、日本国内に住所を有しない外国籍のお客様にご入力いただいております。",
      en: "Required by Japanese law for guests who do not have an address in Japan.",
    },
  },
  {
    id: "passportPhoto",
    type: "file",
    required: true,
    showIf: { id: "residence", equals: "overseas" },
    label: {
      ja: "パスポートの写し(画像)をアップロードしてください",
      en: "Please upload a photo of your passport",
    },
    description: {
      ja: "顔写真のページがはっきり写るように撮影してください。",
      en: "Please make sure the photo page is clearly visible.",
    },
  },
];

const TRIP_QUESTIONS = [
  {
    id: "destination",
    type: "text",
    required: true,
    placeholder: { ja: "例: 広島市内", en: "e.g. Hiroshima City" },
    label: {
      ja: "行先地(次の主な目的地)を教えてください",
      en: "What is your next main destination?",
    },
    description: { ja: "", en: "" },
  },
  {
    id: "purpose",
    type: "checkbox",
    required: true,
    label: {
      ja: "ご宿泊の目的を教えてください",
      en: "What is the purpose of your stay?",
    },
    description: { ja: "", en: "" },
    options: [
      { value: "sightseeing", label: { ja: "観光・旅行", en: "Sightseeing or Travel" } },
      { value: "cycling", label: { ja: "サイクリング", en: "Cycling" } },
      { value: "homecoming", label: { ja: "帰省・帰郷", en: "Returning home" } },
      {
        value: "event",
        label: {
          ja: "イベント(ライブ、フェス、結婚式など)",
          en: "Events (live shows, festivals, weddings, etc.)",
        },
      },
      { value: "business", label: { ja: "仕事・出張", en: "Work or Business trip" } },
      {
        value: "long_stay",
        label: { ja: "長期滞在・ワーケーション", en: "Long-term stay or workation" },
      },
    ],
    extra: {
      id: "purposeOther",
      label: {
        ja: "その他の場合はこちらにご記入ください",
        en: "If other, please describe",
      },
      placeholder: { ja: "", en: "" },
    },
  },
  {
    id: "reservationSite",
    type: "checkbox",
    required: true,
    label: {
      ja: "ご予約サイトを教えてください",
      en: "Which reservation site did you use?",
    },
    description: { ja: "", en: "" },
    options: [
      { value: "booking_com", label: { ja: "booking.com", en: "booking.com" } },
      { value: "rakuten", label: { ja: "楽天トラベル", en: "Rakuten Travel" } },
      { value: "jalan", label: { ja: "じゃらん", en: "jalan" } },
      {
        value: "direct",
        label: { ja: "直接(HP・電話・LINE等)", en: "Direct (website, phone, LINE, etc.)" },
      },
    ],
    extra: {
      id: "reservationSiteOther",
      label: {
        ja: "その他の場合はこちらにご記入ください",
        en: "If other, please describe",
      },
      placeholder: { ja: "", en: "" },
    },
  },
  {
    id: "hearAboutUs",
    type: "checkbox",
    required: true,
    label: {
      ja: "当ゲストハウスを知ったきっかけを教えてください",
      en: "How did you find out about this guesthouse?",
    },
    description: { ja: "", en: "" },
    options: [
      { value: "google_map", label: { ja: "Google map", en: "Google map" } },
      {
        value: "booking_site",
        label: { ja: "宿泊予約サイト", en: "Accommodation booking site" },
      },
      { value: "official_site", label: { ja: "公式ホームページ", en: "Official website" } },
      { value: "other", label: { ja: "その他", en: "Other" } },
    ],
    extra: {
      id: "hearAboutUsOther",
      label: {
        ja: "その他の場合はこちらにご記入ください",
        en: "If other, please describe",
      },
      placeholder: { ja: "", en: "" },
    },
  },
  {
    id: "reasonForChoosing",
    type: "checkbox",
    required: true,
    label: {
      ja: "宿泊を決めた理由を教えてください",
      en: "Why did you choose to stay here?",
    },
    description: { ja: "", en: "" },
    options: [
      { value: "price", label: { ja: "宿泊料金", en: "Accommodation fee" } },
      { value: "access", label: { ja: "立地・アクセス", en: "Location or access" } },
      { value: "surroundings", label: { ja: "周辺環境", en: "Surrounding environment" } },
      {
        value: "guesthouse_interest",
        label: { ja: "ゲストハウスに興味があったから", en: "Interest in guesthouses" },
      },
      { value: "facilities", label: { ja: "館内設備", en: "Facilities" } },
    ],
    extra: {
      id: "reasonForChoosingOther",
      label: {
        ja: "その他の場合はこちらにご記入ください",
        en: "If other, please describe",
      },
      placeholder: { ja: "", en: "" },
    },
  },
  {
    id: "agreement",
    type: "consent",
    required: true,
    label: {
      ja: "宿泊約款および利用規約に同意しますか？",
      en: "Do you agree to the Accommodation Agreement and Terms of Use?",
    },
    description: { ja: "", en: "" },
    consentText: {
      ja: "はい、宿泊約款・利用規約の内容に同意します。",
      en: "Yes, I agree to the Accommodation Agreement and Terms of Use.",
    },
  },
];

/**
 * 宿泊約款・利用規約の本文(その場で読めるように、確認画面のスクロールボックスに
 * そのまま表示されます)。日本語の正本と、その英訳をどちらも反映済みです。
 * 内容を修正したい場合は、下記の ja / en の文章を直接書き換えてください。
 * (第18条の通り、日本文と英文に相違がある場合は日本文が優先されます)
 */
const TERMS_TEXT = {
  ja: `宿泊約款

第１条　本約款の適用範囲
１．本宿泊約款（以下「本約款」）は、「ゲストハウス panipani 生口島」（英語表記：Guesthouse panipani Ikuchijima、以下「当館」）が宿泊契約およびこれに関連する契約を締結する際に適用されるものとし、本約款に定めのない事項については法令または一般に確立された慣習に従うものとします。
２．当館が特約を定める際は、その内容を書面またはメール等で明確にし、本約款の趣旨・法令・習慣に反しない範囲でのみ認められます。
３．本約款は、当館公式サイトおよび予約サイト（OTA）、電話、メール、SNSなどのメッセージ等を通じて成立した宿泊契約にも適用されます。
４．当館はドミトリー形式（二段ベッド）の宿泊施設であり、居室は男女共用、浴室・トイレ・キッチン・リビング等の設備は他の宿泊者と共用してご利用いただく形態です。個別の専用設備をご希望の場合は、あらかじめ当館までご相談ください。

第２条　宿泊契約の申込み
１．当館に宿泊契約の申込みをする代表者には、次の事項を当館へ申し出ていただきます。
（１）代表者の氏名、住所、電話番号
（２）宿泊日、出発日
（３）その他、当館が必要と認めた事項
２．宿泊者が宿泊中に、すでに契約した宿泊日を超えて宿泊を継続する申入れをした場合、当館はその申し出がなされた時点で新たな宿泊契約の申込みがあったものとして処理します。
３．清掃およびベッドメイキングの都合上、当日のご予約はお受けできません。ご予約は宿泊日の２日前までにお願いいたします。

第３条　宿泊契約の成立
１．宿泊契約は、当館が前条の申込みを承諾した時に成立するものとします。但し、当館が承諾しなかった事を証明した時は、この限りではありません。
２．当館の宿泊料金は、予約時にクレジットカードにより即時決済していただきます。現地でのお支払い（現金払い等）による本予約はお受けしておりません。当館が決済の完了を確認した時点で、本契約が成立するものとします。
３．宿泊料金は、第４条及び第５条に該当する場合は、違約金、次いで賠償金の順序で充当し、残額があれば返還します。ただし、決済に関わる手数料がある場合は宿泊者に負担いただきます。

第４条　当館による宿泊契約締結の拒否および解除
１．当館は次に掲げる場合において、宿泊契約に応じないことがあります。また成立済みの宿泊契約であっても契約を解除することがあります。
（１）満室のため、宿泊定員に余裕がないとき。
（２）宿泊の申込みが本約款によらないと認められるとき。
（３）宿泊しようとする者が、法令の規定または公の秩序もしくは善良の風俗に反する行為をするおそれがあると認められるとき。
（４）宿泊しようとする者が、暴力団、暴力団員、暴力団準構成員あるいは反社会勢力に該当するとき。
（５）宿泊しようとする者が、伝染病であると明らかに認められるとき。
（６）宿泊しようとする者が、当館に対して暴力的要求行為、あるいは合理的範囲を超える負担を要求した場合。または過去同様な行為を行ったと認められるとき。
（７）天災地変・施設の故障、その他やむを得ない理由により宿泊させることができないとき。
（８）宿泊しようとする者が、他の宿泊者の迷惑となる言動や行為を当館が認めたとき。
２．前項により、当館が宿泊契約を解除した場合、当館の故意または重過失によるものを除き、違約金・損害賠償を請求できるものとします。既払料金の取り扱いは、宿泊者の故意・過失の有無に応じて以下の通りとします。
（１）当館の都合または天災地変・施設の故障などの不可抗力による提供不能：未提供分に相当する額を返還します。
（２）宿泊者の規約違反・迷惑行為・虚偽申告等に起因する解除：返金いたしません。

第５条　宿泊者による宿泊契約の解除（キャンセル・変更）
１．宿泊者は、当館に申し出て、宿泊契約を解除または変更することができます。ご予約の変更は予約サイト上で承ります。予約サイト上での変更ができない場合は、当館お問い合わせフォームまたはメール（panipani.ikuchijima@gmail.com）にてご連絡ください。
２．当館は宿泊者がその責めに帰すべき事由により宿泊契約の全部または一部を解除したときは、以下の違約金を申し受けます。
（１）宿泊日の４日前までの解除　違約金なし（無料）
（２）宿泊日の３日前に解除した場合　宿泊費の５０％
（３）宿泊日の前日以降に解除した場合　宿泊費の１００％
（４）宿泊日当日の場合　宿泊費の１００％
（５）無連絡不泊の場合　宿泊費の１００％
３．当館は宿泊者が宿泊日当日になっても到着しないとき、その宿泊予約は取消しされたものとみなして処理することがあります。この場合においても前項の解除に関する違約金を申し受けます。
４．宿泊者が、天災地変、交通機関の運休・不通、行政による避難指示により、当館に到着できないと当館が認めた場合は、宿泊者の責めに帰さない事由として、違約金は申し受けません。
５．本条における日付の判定は日本時間を基準とし、宿泊日の０時時点で当日扱いとします。また、予約サイト（OTA）に別段の定めがある場合は、当該規約を優先します。

第６条　宿泊の登録
１．宿泊者は宿泊日当日、次の事柄をご登録いただきます。
（１）代表者を含む宿泊者全員の氏名、住所、電話番号、年齢、性別
（２）宿泊日、出発日
（３）外国籍の宿泊者にあっては、国籍、旅券番号
（４）その他、当館が必要と認めた事項
２．日本国内の住所を有しない外国籍宿泊者については、法令に基づき旅券の提示および旅券番号の記録（必要に応じて写しの保存）を求めることがあります。

第７条　問い合わせ対応時間
１．当館の電話・メール等での問い合わせ対応時間は、９時から２１時までとします。
２．上記対応時間外における連絡には、原則として応じることができません。
３．対応時間外に宿泊者からの連絡が取れなかったことにより、到着できなかった場合やチェックインができなかった場合、当館の故意または重過失がある場合を除き、当館は一切の責任を負わず、いかなる理由でも宿泊料金の返還はできません。

第８条　客室および施設の利用時間
１．宿泊者が当館の客室を使用できる時間は、チェックイン時間からチェックアウト時間までとします。時間外は客室だけでなく当館の全施設が利用できません。ただし、連続して宿泊する場合は、到着日及び出発日を除き、終日使用することができます。
２．チェックインは１６時から２１時まで、チェックアウトは早朝から１０時までとします。当館はセルフチェックイン方式のため、ご予約時にご登録いただいた連絡先へ事前に送付する入館方法に従い、１６時以降いつでもチェックイン可能です。深夜の入館時は、近隣および他の宿泊者への迷惑とならないようご配慮ください。
３．連絡なく２１時を過ぎてもご来館の連絡がない場合、当館はご登録の連絡先（メール、メッセージアプリ等）に確認の連絡を行います。連絡が取れなかった場合、または宿泊者が連絡に気付かずに宿泊できなかった場合であっても、当館の故意または重過失がある場合を除き、当館は一切の責任を負わず、宿泊料金の返還も行いません。
４．交通機関の遅延等による到着遅れは、事前にご連絡があった場合のみ柔軟に対応いたします。
５．チェックイン前の荷物預かりや早着希望については、事前にご相談ください。
６．チェックアウト時間の延長は、当日の空室状況により承ります。延長料金はお一人様１時間あたり１,０００円（１時間未満の端数は１時間として計算）とします。延長時間の上限は当館の判断により定め、状況によりお断りすることがあります。
７．連泊いただく場合、清掃スタッフが１６時頃まで施設内で作業していることがあります。シーツ交換をご希望の場合は、備え付けの交換カードを布団の上に見えるように置いてください。

第９条　料金の支払い
１．宿泊料金は、ご予約時にクレジットカードにより即時決済していただきます。現地でのお支払い（現金・その他方法）はお受けしておりません。決済手数料がある場合は、宿泊者の負担とします。
２．アメニティ等、現地でお申し込みいただく追加サービスの精算は、現金またはPayPayにて承ります（現金の場合は封筒に入れて所定の料金箱にお入れください）。
３．当館が宿泊者に客室を提供し、使用が可能になったのち、宿泊者が任意に宿泊しなかった場合においても、宿泊料金は申し受けます。
４．宿泊料金には消費税を含みます。その他別途料金（延長料金、アメニティ料等）がある場合は別途定めて表示します。
５．領収書の発行をご希望の場合は、事前にお申し付けください。電子データにてお渡しいたします。
６．予約サイト（OTA）を経由して予約された場合の料金・決済・返金条件は、当該サイトに表示された条件を優先します。本約款と相違がある場合でも同様とします。

第１０条　ペット同伴の禁止
１．当館では、ペットを同伴した宿泊はお受けしておりません。動物アレルギーをお持ちの方や他の宿泊者への配慮のため、あらかじめご了承ください。
２．前項に反してペットを同伴されたことが判明した場合、当館は宿泊契約を解除し、退館を求めることがあります。この場合の返金はいたしません。

第１１条　利用規約の遵守
１．宿泊者は当館の利用規約（別紙参照）に従っていただきます。
２．宿泊者が利用規約に違反した場合、当館は利用停止または契約解除・退館を求めることがあります。

第１２条　当館の責任
１．当館は、宿泊契約の履行に関連して当館の故意または過失により宿泊者に損害が生じた場合、法令に従い相当因果関係の範囲で賠償します。
２．地震、火災、台風、豪雨、洪水、津波、停電、感染症の流行、その他の天災地変、またはこれらに伴う公共交通機関の運休・不通、行政指示等の不可抗力により、宿泊者の安全確保のために当館が宿泊の提供を中止、または宿泊者に避難を求める場合があります。この場合、当館の故意または重過失がない限り、当館はそのことによって生じた損害について責任を負いません。
３．前項に基づき宿泊契約の履行が困難となった場合、当館はその責を負わず、損害賠償の義務を負いません。ただし、宿泊料金を受領済みで、宿泊が実際に提供されなかった場合には、未提供分に相当する料金を返還します。
４．宿泊者が災害その他の不可抗力により当館に到着できない場合は、宿泊者の責めに帰さない事由として、違約金は申し受けません。
５．宿泊者自身または第三者の行為により発生した損害について、当館は一切の責任を負いません。
６．宿泊者が客室および共用施設利用時に被った事故について、当館の故意または重過失によらない限り、当館は一切の責任を負いません。

第１３条　宿泊者の責任
１．宿泊者の故意又は過失により当館の施設、備品等に損害を与えたときは、その損害を賠償していただきます。
２．チェックアウト後の室内清掃において、著しい汚れやゴミの放置、嘔吐・排泄物等の粗相により通常を超える清掃・消臭作業が必要となった場合は、実費相当額または当館が定める特別清掃料をお支払いいただきます。
３．宿泊者は、自転車等の利用や置き場の使用に関して、所定の場所を使用し、適切な管理を行うものとします。
４．前条第２項に定める通り、宿泊者は、当館の指示に従い、速やかに避難その他の安全確保に協力するものとします。
５．入館用の鍵・キーボックス等の破損・紛失・暗証番号変更において、実費または当館が定める手数料を申し受けます。

第１４条　寄託物等の取扱い
１．宿泊者の物品や現金、貴重品は、自己責任で管理してください。滅失または毀損等の損害について、当館の故意または重過失がある場合を除き、一切の責任を負いません。

第１５条　手荷物又は携帯品等の保管
１．当館は常駐スタッフがいないセルフチェックイン施設のため、チェックイン前およびチェックイン後の手荷物預かりは、原則としてお受けできません。事前にご相談いただき、やむを得ず館内で保管される場合は、自己責任で管理してください。
２．チェックアウト後の忘れ物は、食料品は当日１５時まで、その他は発見日を含め７日間保管し、その後は廃棄します。
３．忘れ物の郵送を希望される場合は、送料・手数料はお客様負担となります。

第１６条　駐車場の利用
１．当館は、宿泊者に対し無料の駐車場（２台分）を提供します。ただし、連続１か月以上の滞在の場合は、駐車場代として月額５,０００円を申し受けます。
２．駐車場は予約不可です。台数には限りがあるため、満車の場合は当館にて駐車場を確保する義務を負わず、宿泊者ご自身で近隣の有料駐車場等を手配していただきます。その際に発生する料金は宿泊者の負担とします。
３．当館の駐車場内および当館敷地内で発生した車両トラブル（接触・盗難・破損等）については、当館は一切の責任を負いません。
４．近隣への無断駐車や路上駐車が確認された場合は、警察への通報および宿泊契約の解除を行う場合があります。

第１７条　個人情報及びプライバシーの取り扱い
１．当館は、個人情報保護法に基づき、個人データの安全管理措置を講じます。
２．当館は、宿泊者の個人情報を、宿泊契約の履行、施設運営および法令に基づく宿泊者名簿の作成・保存等、適正な目的の範囲内でのみ収集・利用します。
３．当館は、取得した宿泊者の個人情報を本人の同意がある場合、または法令に基づく場合を除き、第三者には提供しません。
４．当館は、宿泊者の安全確保および防犯を目的として、館内共用部等に監視カメラを設置する場合があります。これにより取得した映像データは、目的の範囲内でのみ利用し、一定期間保管後、適切な方法により消去します。
５．当館は、取得した宿泊者の個人情報および映像データについて、漏洩・改ざん等が生じないよう、適切な管理・保護に努めます。

第１８条　支配する国語
１．本約款は日本語版を正本とします。参考のため英語版を用意する場合がありますが、両文に相違があるときは、日本文が優先されます。

第１９条　インターネット通信の使用
１．当館内でのインターネット通信の利用に当たっては、利用者自身の責任において行うものとします。利用中のシステム障害その他理由によりサービスが中断し、その結果、利用者が損害を受けた場合においても、当館は一切の責任を負いません。
２．インターネット通信の利用に際し、当館が不適切と判断した行為により、当館および第三者に損害が見込まれる場合、または生じた損害については、その損害相当額を申し受けます。
３．不正アクセスおよび著作権侵害、違法ダウンロード等、法令に抵触する行為は禁止します。
４．本サービスの利用により第三者との間に紛争が生じた場合、当館の故意または重過失がある場合を除き、当該紛争は利用者の責任と負担において解決するものとします。

第２０条　本約款の変更
当館は、本約款に定めのない事項および営業上必要と判断した事項について、予告なく内容を変更することがあります。変更後の約款は、当館ホームページ等に掲示し、掲示日以降の宿泊申込分に適用されます。

第２１条　準拠法および合意管轄
本約款に関する紛争については、日本法を準拠法とし、当館所在地を管轄する地方裁判所または簡易裁判所を第一審の専属的合意管轄裁判所とします。

附則　本約款は、2026年10月1日より施行します。


利用規約

「ゲストハウス panipani 生口島」（以下「当館」）では、お客様に安全かつ快適にご利用いただくために、次の通り利用規約を定めておりますので、ご協力くださいますようお願い申し上げます。この規約をお守りいただけない場合は、当館のご利用をお断り申し上げますので、予めご承知おきください。

１．適用範囲
（１）当館の全施設（宿泊施設、敷地等すべてを含みます。以下総称して「当館内諸施設」といいます。）をご利用の来館者に適用されます。ただし、本規則に定めのないものは、宿泊約款を適用いたします。

２．火災予防および安全管理
（１）当館内諸施設は全館禁煙です。電子タバコも該当します。喫煙される場合は必ず屋外にて喫煙し、吸い殻はご自身で処分してください。
（２）お客様用以外のスタッフ専用スペース等には立ち入らないでください。
（３）客室ドア前および玄関ドア前、廊下には荷物を置かないでください。
（４）災害、火災、停電、その他緊急事態が発生した場合は、当館スタッフまたは行政の指示に従い、速やかに避難その他安全確保にご協力ください。

３．お預かり品およびお忘れ物等の保管について
お預かり品およびお忘れ物等の保管については、原則お預かり日より７日間となっております。食べ物は原則お預かり日より１５時までです。それ以降は、当館にて処分させていただきます。

４．当館内諸施設に関すること
（１）宿泊者以外の方の宿泊者用エリアへの立ち入りはお断りします。
（２）当館の洗濯機は有料にて利用いただけますが、利用後は直ちに洗濯物を取り出し、次の利用者の妨げにならないようにしてください。
（３）宿泊客が当館の館内設備を利用できる時間は、チェックイン日の１６時からチェックアウト日の１０時までとします。チェックイン前およびチェックアウト後は、館内設備を利用いただけません。
（４）浴室・トイレ・キッチン・リビング等は共用です。他のお客様も利用されますので、占有したままのご利用や長時間の占用はご遠慮ください。
（５）館内で飲酒された方は、自転車や車の運転を行うことはできません。
（６）駐輪・駐車は当館が指定する場所のみで行ってください。近隣敷地や道路上への駐輪・駐車は禁止します。違反があった場合は、退館を求めることがあります。
（７）ごみ類は当館の定める分別方式に従って処分してください。
（８）消灯時間は設けていませんが、他のお客様の迷惑とならないよう、音や光には十分お気をつけください。
（９）他のお客様または近隣住民からの苦情が発生した場合、当館は宿泊者に対して注意・警告を行うことがあります。注意・警告後も改善が見られない場合は、退館していただくことがあります。その際の返金はいたしません。

５．行動に関すること
（１）当館ご利用のお客様は、必ず当館スタッフの指示に従って行動してください。承諾いただけない場合は、退館していただく場合がございます。
（２）当館内への入退出は当館とご契約頂いたお客様のみ可能となります。
（３）発熱や感染症の疑いがあると当館が判断した場合には、ご利用をお断りすることがあります。
（４）当館内に危険物や法令で持ち込みを禁止されている物を持ち込むことはできません。
（５）その他、宿泊者および近隣住民、当館の安全を損なう行為は固くお断りします。

６．責任に関すること
（１）当館利用者間および利用者と第三者との間で発生したトラブルについて、当館は一切の責任を負いません。必ず当事者間にて解決してください。
（２）当館内での盗難・紛失・破損等に関しても、当館は一切の責任を負いません。

７．その他の禁止事項
（１）当館内諸施設で賭博、又は風紀を乱すような行為。
（２）当館内諸施設で他のお客様にご迷惑を及ぼすような大声、放歌、または喧騒な行為。
（３）著しく不潔な身体または服装により他のお客様に迷惑を及ぼす恐れが認められること。
（４）客室を当館の許可なしに宿泊以外の目的（撮影・展示・販売等）に使用すること。
（５）撮影・配信・イベント利用等、通常の宿泊利用を超えるご利用をご希望の場合は、事前に当館の承諾を得てください。無断利用の場合は追加料金を請求し、状況により退館していただきます。
（６）当館内の設備および備品を当館の許可なく持ち出したり、他の場所へ移動させたり、変更・改造・汚損・破損させる行為。
（７）当館内諸施設で許可なく、広告、宣伝物の配布、掲示、物品の販売、勧誘、営業行為等、及びビラ等の配布、署名活動等を行うこと。
（８）館内で撮影された写真等を当館の許可なく営業上の目的で公にすること。
（９）館内および敷地内でのドローンの使用、無断撮影、録音等、他の宿泊者または近隣住民のプライバシーを侵害する行為。
（１０）他の宿泊者を特定できる写真や映像を、本人の同意なくSNSやインターネットに投稿すること。他のお客様の顔や姿が映り込んだ写真・動画をSNS等に投稿する際は、必ず当人の同意を得てください。無断撮影や投稿が確認された場合は、削除要請または退館をお願いする場合があります。
（１１）その他当館が不適当と判断する行為。

８．情報に関すること
（１）当館の屋号「ゲストハウス panipani 生口島」（英文；Guesthouse panipani Ikuchijima）を当館以外の第三者が使用することを禁じます。
（２）当館は旅館業法または住宅宿泊事業法に基づく事業として運営しています。フロント常駐や客室清掃サービス、ルームサービス等は提供しておりません。
（３）当館ご利用時にご登録いただいた個人情報等の取扱いに関しては当館の定めるプライバシーポリシーに従います。
（４）ご登録いただいたメールアドレスや電話番号等への各種ご案内は、同意いただいた範囲内で送付します。
（５）当ウェブサイトや当館のSNSに掲載されている写真や文章、デザインは当館に帰属します。無断で使用する事を禁じます。
（６）本利用規約に関する内容は予告なく変更する事があり、その事前通知の義務はありません。変更の際は、その旨をホームページ等に掲示し、宿泊者は変更後の規約に従うものとします。
（７）本利用規約に定めのない事項および本規則と宿泊約款の内容が異なる場合は、宿泊約款を優先します。

附則　本規約は、2026年10月1日より施行します。

ゲストハウス panipani 生口島　〒722-2411　広島県尾道市瀬戸田町瀬戸田104-1　panipani.ikuchijima@gmail.com`,
  en: `Accommodation Agreement

Article 1 (Scope of Application)
1. This Accommodation Agreement (the "Agreement") applies when "Guesthouse panipani Ikuchijima" (Japanese name: ゲストハウス panipani 生口島, the "Property") enters into an accommodation contract and any related contracts with a guest. Matters not provided for in this Agreement shall be governed by applicable laws and generally established practice.
2. Any special terms established by the Property shall be clearly stated in writing, by email, or otherwise, and shall only be valid to the extent they do not conflict with the purpose of this Agreement, applicable laws, or established practice.
3. This Agreement applies to accommodation contracts concluded through the Property's official website, online travel agency (OTA) sites, phone, email, social media messages, or any other means.
4. The Property is a dormitory-style facility (bunk beds). Rooms are shared by all genders, and the bathroom, toilet, kitchen, living room, and other facilities are shared with other guests. Guests who wish to request private or exclusive facilities should contact the Property in advance.

Article 2 (Application for Accommodation Contract)
1. A representative applying for an accommodation contract with the Property shall provide the following information:
(1) The representative's name, address, and phone number
(2) Check-in date and check-out date
(3) Any other information the Property deems necessary
2. If a guest requests to extend their stay beyond the originally contracted dates while already staying at the Property, the Property will treat this as a new application for an accommodation contract at the time the request is made.
3. Same-day reservations cannot be accepted due to cleaning and bed-making requirements. Reservations must be made at least two days before the check-in date.

Article 3 (Formation of Accommodation Contract)
1. The accommodation contract is formed when the Property accepts the application described in the preceding article, except where the Property can prove that it did not accept the application.
2. Accommodation fees must be settled immediately by credit card at the time of booking. Reservations paid on-site (e.g., by cash) are not accepted. The contract is formed once the Property confirms that payment has been completed.
3. Where Articles 4 and 5 apply, accommodation fees already paid shall first be applied to any penalty fee, then to any damages, with any remaining balance refunded. However, any payment processing fees shall be borne by the guest.

Article 4 (Refusal or Cancellation of Accommodation Contract by the Property)
1. The Property may refuse to conclude an accommodation contract, or may cancel a contract already concluded, in any of the following cases:
(1) When the Property is fully booked and no capacity remains.
(2) When the application is found not to comply with this Agreement.
(3) When the applicant is deemed likely to act in violation of laws, public order, or good morals.
(4) When the applicant is found to be a member of an organized crime group, a related party, or otherwise part of an antisocial force.
(5) When the applicant is clearly found to have a contagious disease.
(6) When the applicant makes violent demands or demands an unreasonable burden on the Property, or is found to have done so in the past.
(7) When accommodation cannot be provided due to a natural disaster, facility malfunction, or other unavoidable reason.
(8) When the Property determines that the applicant's words or conduct would cause a nuisance to other guests.
2. When the Property cancels the accommodation contract under the preceding paragraph, it may claim a penalty fee and/or damages, except where the cancellation is due to the Property's own intent or gross negligence. The handling of fees already paid shall be as follows, depending on whether the guest was at fault:
(1) Where the Property is unable to provide accommodation due to its own circumstances, a natural disaster, facility malfunction, or other force majeure: the amount corresponding to the portion not provided will be refunded.
(2) Where cancellation results from the guest's violation of this Agreement, nuisance behavior, false statements, or similar cause: no refund will be given.

Article 5 (Cancellation or Change of Accommodation Contract by the Guest)
1. A guest may cancel or change an accommodation contract by notifying the Property. Reservation changes should be made through the reservation site. If a change cannot be made through the reservation site, please contact the Property via the inquiry form or by email (panipani.ikuchijima@gmail.com).
2. When a guest cancels all or part of the accommodation contract for reasons attributable to the guest, the Property will charge the following cancellation fees:
(1) Cancellation up to 4 days before the check-in date: no fee (free of charge)
(2) Cancellation 3 days before the check-in date: 50% of the accommodation fee
(3) Cancellation on or after the day before the check-in date: 100% of the accommodation fee
(4) Cancellation on the check-in date: 100% of the accommodation fee
(5) No-show without notice: 100% of the accommodation fee
3. If a guest has not arrived by the check-in date, the Property may treat the reservation as cancelled. In this case, the cancellation fees described in the preceding paragraph will still apply.
4. If the Property determines that a guest is unable to arrive due to a natural disaster, suspension or disruption of transportation services, or an evacuation order issued by a government authority, this will be treated as a reason not attributable to the guest, and no cancellation fee will be charged.
5. Dates under this article are determined based on Japan Standard Time, with the check-in date treated as starting at 0:00. Where an online travel agency (OTA) has its own separate terms, those terms shall take precedence.

Article 6 (Guest Registration)
1. On the day of check-in, guests are required to register the following information:
(1) The name, address, phone number, age, and gender of all guests, including the representative
(2) Check-in date and check-out date
(3) For guests of foreign nationality: nationality and passport number
(4) Any other information the Property deems necessary
2. For guests of foreign nationality who do not have an address in Japan, the Property may, in accordance with applicable law, request the guest to present their passport and will record the passport number (and may retain a copy if necessary).

Article 7 (Hours of Inquiry Response)
1. The Property responds to phone and email inquiries between 9:00 AM and 9:00 PM.
2. In principle, the Property is unable to respond to inquiries outside of these hours.
3. Except where the Property has acted with intent or gross negligence, the Property bears no responsibility, and will not refund any accommodation fees, if a guest is unable to arrive or check in because they could not reach the Property outside of the above response hours.

Article 8 (Hours of Use for Rooms and Facilities)
1. Guests may use the Property's rooms from the check-in time until the check-out time. Outside of these hours, guests may not use the room or any of the Property's other facilities. However, for consecutive-night stays, guests may use the facilities all day, except on the arrival day and departure day.
2. Check-in is available from 4:00 PM to 9:00 PM, and check-out is available from early morning until 10:00 AM. As the Property uses a self check-in system, guests may check in at any time from 4:00 PM onward, following the check-in instructions sent in advance to the contact information provided at the time of booking. Please be considerate of neighbors and other guests when checking in late at night.
3. If the Property has not received any contact from a guest by 9:00 PM, the Property will attempt to reach the guest using the registered contact information (email, messaging apps, etc.). Except where the Property has acted with intent or gross negligence, the Property bears no responsibility, and will not refund any accommodation fees, if contact cannot be made or if the guest fails to notice the contact attempt and is unable to stay.
4. Delays in arrival due to transportation delays or similar causes will be accommodated flexibly only if the Property is notified in advance.
5. Please contact the Property in advance if you wish to store luggage before check-in or arrive earlier than the standard check-in time.
6. Extensions to the check-out time may be granted depending on room availability on the day. The extension fee is 1,000 yen per hour per person (any fraction of an hour is rounded up to a full hour). The maximum extension time is determined at the Property's discretion, and requests may be declined depending on circumstances.
7. For consecutive-night stays, cleaning staff may be working inside the Property until around 4:00 PM. If you would like your sheets changed, please place the designated exchange card visibly on top of your bedding.

Article 9 (Payment of Fees)
1. Accommodation fees must be settled immediately by credit card at the time of booking. On-site payment (cash or otherwise) is not accepted. Any payment processing fees shall be borne by the guest.
2. Payment for additional on-site services such as amenities may be made in cash or via PayPay (cash payments should be placed in an envelope and deposited in the designated payment box).
3. Even if a guest chooses not to stay after the Property has made the room available for use, the accommodation fee will still be charged.
4. Accommodation fees include consumption tax. Any additional fees (such as extension fees or amenity charges) will be separately specified and displayed.
5. If you require a receipt, please let us know in advance. Receipts will be provided as electronic data.
6. Where a reservation is made through an online travel agency (OTA), the fee, payment, and refund conditions specified by that site shall take precedence, even where they differ from this Agreement.

Article 10 (Prohibition of Pets)
1. The Property does not accept guests accompanied by pets, out of consideration for guests with animal allergies and for other guests in general.
2. If it is discovered that a guest has brought a pet in violation of the preceding paragraph, the Property may terminate the accommodation contract and request the guest to vacate the premises. No refund will be given in this case.

Article 11 (Compliance with the Terms of Use)
1. Guests must comply with the Property's Terms of Use (see attached).
2. If a guest violates the Terms of Use, the Property may suspend use of the facility or terminate the contract and request the guest to vacate the premises.

Article 12 (Liability of the Property)
1. If a guest suffers damage due to the Property's intentional act or negligence in the performance of the accommodation contract, the Property will provide compensation in accordance with applicable law, to the extent of a reasonable causal relationship.
2. In the event of an earthquake, fire, typhoon, heavy rain, flood, tsunami, power outage, epidemic, or other force majeure event, or a resulting suspension or disruption of public transportation or government directive, the Property may suspend accommodation services or ask guests to evacuate in order to ensure guest safety. Except where the Property has acted with intent or gross negligence, the Property bears no responsibility for any resulting damage.
3. If performance of the accommodation contract becomes difficult due to the circumstances described in the preceding paragraph, the Property bears no responsibility and no obligation to pay damages. However, if accommodation fees have already been received but accommodation was not actually provided, the Property will refund the amount corresponding to the portion not provided.
4. If a guest is unable to arrive at the Property due to a disaster or other force majeure event, this will be treated as a reason not attributable to the guest, and no cancellation fee will be charged.
5. The Property bears no responsibility for damage caused by the guest's own actions or the actions of a third party.
6. Except where the Property has acted with intent or gross negligence, the Property bears no responsibility for accidents suffered by a guest while using their room or the shared facilities.

Article 13 (Responsibilities of the Guest)
1. If a guest causes damage to the Property's facilities or equipment through intent or negligence, the guest must compensate the Property for that damage.
2. If, after check-out, the room requires cleaning or deodorizing beyond the normal scope due to significant staining, abandoned trash, vomit, bodily waste, or similar issues, the guest will be charged the actual cost or a special cleaning fee set by the Property.
3. Guests must use the designated areas for bicycles and similar items and manage them appropriately.
4. As provided in Article 12, paragraph 2, guests must follow the Property's instructions and promptly cooperate with evacuation and other safety measures.
5. In the event of damage, loss of, or a change of code for the entry key or key box, the guest will be charged the actual cost or a fee set by the Property.

Article 14 (Handling of Deposited Items)
1. Guests are responsible for managing their own belongings, cash, and valuables. Except where the Property has acted with intent or gross negligence, the Property bears no responsibility for any loss or damage to such items.

Article 15 (Storage of Baggage and Personal Belongings)
1. As the Property is a self check-in facility with no staff permanently on site, it generally cannot accept baggage for storage either before or after check-in. Please consult the Property in advance; if it becomes unavoidably necessary to store items on the premises, the guest is responsible for managing them at their own risk.
2. Lost items left after check-out will be kept until 3:00 PM on the same day for food items, and for 7 days (including the day found) for other items, after which they will be discarded.
3. If you would like a lost item mailed to you, shipping and handling fees will be charged to the guest.

Article 16 (Use of the Parking Lot)
1. The Property provides free parking for guests (2 spaces). However, for stays of one consecutive month or longer, a parking fee of 5,000 yen per month will be charged.
2. Parking spaces cannot be reserved. As the number of spaces is limited, the Property is not obligated to guarantee a parking space if the lot is full; guests must arrange nearby paid parking themselves in that case, at their own expense.
3. The Property bears no responsibility for any vehicle trouble (such as collisions, theft, or damage) occurring within the Property's parking lot or premises.
4. If unauthorized parking on neighboring property or on the street is confirmed, the Property may report the matter to the police and terminate the accommodation contract.

Article 17 (Handling of Personal Information and Privacy)
1. The Property implements appropriate security management measures for personal data in accordance with the Act on the Protection of Personal Information.
2. The Property collects and uses guests' personal information only within the scope necessary for performing the accommodation contract, operating the facility, and preparing and retaining the guest register as required by law.
3. Except with the guest's consent or as required by law, the Property will not provide guests' personal information to any third party.
4. The Property may install surveillance cameras in shared areas for the safety and security of guests. Any video data obtained will be used only within this purpose, retained for a set period, and then deleted using an appropriate method.
5. The Property will make appropriate efforts to manage and protect any personal information and video data obtained, to prevent leakage, tampering, or similar incidents.

Article 18 (Governing Language)
1. The Japanese version of this Agreement is the official text. An English version may be provided for reference purposes; in the event of any discrepancy between the two versions, the Japanese text shall prevail.

Article 19 (Use of Internet Communication)
1. Guests use internet communication within the Property at their own responsibility. The Property bears no responsibility for any damage suffered by a guest due to a system failure or other interruption of service.
2. If the Property determines that a guest's use of internet communication is inappropriate and is likely to cause, or has caused, damage to the Property or a third party, the guest will be charged an amount equivalent to that damage.
3. Unauthorized access, copyright infringement, illegal downloading, and any other conduct that violates the law are prohibited.
4. Except where the Property has acted with intent or gross negligence, any dispute arising with a third party from use of this service shall be resolved at the responsibility and expense of the guest.

Article 20 (Amendment of this Agreement)
The Property may amend this Agreement without prior notice regarding matters not provided for herein or matters the Property deems necessary for business reasons. The amended Agreement will be posted on the Property's website and will apply to accommodation applications made on or after the date of posting.

Article 21 (Governing Law and Jurisdiction)
Disputes relating to this Agreement shall be governed by the laws of Japan, and the district or summary court having jurisdiction over the location of the Property shall be the exclusive court of first instance by agreement.

Supplementary Provision: This Agreement takes effect on October 1, 2026.


Terms of Use

To ensure that all guests can use the facility safely and comfortably, "Guesthouse panipani Ikuchijima" (the "Property") has established the following Terms of Use. We ask for your cooperation. If these terms are not observed, we may decline to allow further use of the Property; thank you for your understanding in advance.

1. Scope of Application
(1) These terms apply to all visitors using any of the Property's facilities (including the accommodation building and grounds, collectively "the Property's facilities"). Matters not covered by these terms are governed by the Accommodation Agreement.

2. Fire Prevention and Safety Management
(1) All of the Property's facilities are non-smoking, including the use of electronic cigarettes. If you wish to smoke, please do so outdoors only, and dispose of cigarette butts yourself.
(2) Please do not enter staff-only areas not intended for guest use.
(3) Please do not leave belongings in front of room doors, the entrance door, or in hallways.
(4) In the event of a disaster, fire, power outage, or other emergency, please follow the instructions of Property staff or government authorities and cooperate promptly with evacuation and other safety measures.

3. Storage of Deposited Items and Lost Property
In principle, deposited items and lost property will be stored for 7 days from the date received. Food items will be stored only until 3:00 PM on the day received. After these periods, the Property will dispose of the items.

4. Regarding the Property's Facilities
(1) Entry into guest-only areas by non-guests is not permitted.
(2) The washing machine is available for a fee. Please remove your laundry promptly after use so as not to inconvenience the next guest.
(3) Guests may use the Property's facilities from 4:00 PM on the check-in date until 10:00 AM on the check-out date. Facilities may not be used before check-in or after check-out.
(4) The bathroom, toilet, kitchen, and living room are shared spaces. As other guests will also be using them, please avoid occupying them exclusively or for extended periods.
(5) Guests who have consumed alcohol on the premises may not ride a bicycle or drive a car.
(6) Bicycles and vehicles must be parked only in the areas designated by the Property. Parking on neighboring property or on the street is prohibited. Violations may result in a request to vacate the premises.
(7) Please dispose of trash according to the Property's waste sorting rules.
(8) There is no designated lights-out time; however, please be considerate of noise and light so as not to disturb other guests.
(9) If a complaint is received from another guest or a neighboring resident, the Property may issue a warning to the guest concerned. If the situation does not improve after a warning, the guest may be asked to vacate the premises. No refund will be given in this case.

5. Regarding Conduct
(1) Guests must follow the instructions of Property staff at all times. Guests who do not comply may be asked to vacate the premises.
(2) Only guests who have a contract with the Property may enter or exit the Property.
(3) The Property may decline to provide service to a guest if it determines that the guest has a fever or is suspected of having an infectious disease.
(4) Guests may not bring dangerous items or any item whose possession is prohibited by law onto the premises.
(5) Any other conduct that endangers the safety of guests, neighboring residents, or the Property is strictly prohibited.

6. Regarding Liability
(1) The Property bears no responsibility for any trouble arising between guests, or between a guest and a third party. Such matters must be resolved directly between the parties concerned.
(2) The Property likewise bears no responsibility for theft, loss, or damage occurring on the premises.

7. Other Prohibited Acts
(1) Gambling or any act that disturbs public order within the Property's facilities.
(2) Loud voices, singing, or other disruptive behavior that causes a nuisance to other guests within the Property's facilities.
(3) Appearing in a significantly unclean physical state or attire that is likely to cause a nuisance to other guests.
(4) Using a room for any purpose other than accommodation (such as filming, exhibitions, or sales) without the Property's permission.
(5) If you wish to use the Property beyond ordinary accommodation use, such as for filming, live streaming, or events, please obtain the Property's prior consent. Unauthorized use will result in an additional charge and, depending on the circumstances, a request to vacate the premises.
(6) Removing, relocating, altering, modifying, soiling, or damaging the Property's facilities or equipment without permission.
(7) Distributing or posting advertisements or promotional materials, selling goods, soliciting, conducting business activities, distributing flyers, or collecting signatures within the Property's facilities without permission.
(8) Publicly using photographs taken within the Property for commercial purposes without the Property's permission.
(9) Using drones, or engaging in unauthorized photography, recording, or similar acts within the Property's facilities or grounds, in a manner that infringes on the privacy of other guests or neighboring residents.
(10) Posting photographs or videos that identify other guests to social media or the internet without their consent. If a photo or video capturing another guest's face or appearance is to be posted on social media or elsewhere, the consent of that person must always be obtained beforehand. If unauthorized photography or posting is confirmed, the Property may request its removal or ask the guest to vacate the premises.
(11) Any other conduct the Property deems inappropriate.

8. Regarding Information
(1) Use of the Property's trade name, "Guesthouse panipani Ikuchijima" (Japanese: ゲストハウス panipani 生口島), by any third party other than the Property is prohibited.
(2) The Property operates as a business under the Hotel Business Act or the Private Lodging Business Act. It does not provide a staffed front desk, daily room cleaning service, or room service.
(3) Personal information registered when using the Property is handled in accordance with the Property's Privacy Policy.
(4) Various notices will be sent to the registered email address or phone number only within the scope consented to by the guest.
(5) Photographs, text, and designs published on the Property's website or social media accounts belong to the Property. Unauthorized use is prohibited.
(6) These Terms of Use may be amended without prior notice, and the Property is not obligated to give advance notice of such amendments. Notice of any amendment will be posted on the website, and guests shall be bound by the amended terms.
(7) Where a matter is not covered by these Terms of Use, or where these terms conflict with the Accommodation Agreement, the Accommodation Agreement shall take precedence.

Supplementary Provision: These Terms of Use take effect on October 1, 2026.

Guesthouse panipani Ikuchijima
104-1 Setoda, Setoda-cho, Onomichi-shi, Hiroshima 722-2411, Japan
panipani.ikuchijima@gmail.com`,
};

/**
 * 補足として外部リンクも表示したい場合はここにURLを入れてください(不要なら空文字のまま)。
 * 下記はいただいたGoogleドキュメントのリンクです。共有設定が
 * 「リンクを知っている全員が閲覧可」になっていることを確認済みのため、
 * ゲストはサインインなしで開けます。
 */
const TERMS_URL =
  "https://docs.google.com/document/d/1VYVbGefzMmk_eIxdyXy8mwbKqeXPeYQV/view";

/**
 * 送信完了画面に表示する案内文です。
 * チェックイン方法・キーボックスの暗証番号・駐車場の案内など、
 * 宿泊者に必ず伝えたい内容をここにまとめて記載できます。
 *
 * sections は見出し(title)と本文(body)のペアを好きなだけ追加できます。
 * body内の改行はそのまま画面に反映されます。
 *
 * link は補足の外部リンク(Googleドキュメントなど)です。不要な場合は
 * linkUrl を空文字 "" にしてください。
 */
const COMPLETE_INFO = {
  ja: {
    notice:
      "この画面はチェックイン時に必要です。他のページに移動する前に、必ずスクリーンショットを撮っておいてください。",
    sections: [
      {
        title: "チェックイン",
        body: `16時から入室可能、セルフチェックイン方式です。
到着しましたらドア横のキーボックスにて以下の暗証番号を入力し鍵をご利用いただき、中にお入りください。

キーナンバー
玄関「0528」

尚、鍵の持ち出しは禁止です。`,
      },
      {
        title: "ご宿泊部屋",
        body: "ご登録のメールアドレスに記載しております。",
      },
    ],
    linkLabel: "",
    linkUrl: "",
  },
  en: {
    notice:
      "You will need this screen at check-in. Please take a screenshot before leaving this page.",
    sections: [
      {
        title: "Check-in",
        body: `Check-in is available from 4:00 PM. This is a self check-in property.
When you arrive, please enter the code below into the key box next to the door to get the key, then let yourself in.

Key number
Front door "0528"

Please do not take the key off the premises.`,
      },
      {
        title: "Your room",
        body: "Your room number has been sent to your registered email address.",
      },
    ],
    linkLabel: "",
    linkUrl: "",
  },
};

