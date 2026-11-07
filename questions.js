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
    type: "cards",
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
const KEY_TURN_PHOTO =
  "data:image/jpeg;base64,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";

const COMPLETE_INFO = {
  ja: {
    notice:
      "⚠️ この画面は元に戻せません。\n他のページに移動する前に、必ず全てスクリーンショットで保存してください。\n(チェックイン時に必要です)",
    sections: [
      {
        title: "チェックイン",
        body: `16時から入室可能、セルフチェックイン方式です。
到着しましたら、下記のキーボックスに暗証番号を入力して鍵をご利用いただき、中にお入りください。
尚、鍵の持ち出しは禁止です。`,
      },
      {
        title: "キーボックス",
        body: "入口ドアの取っ手のすぐ横にある、黒い小さな箱です。",
        warning: "⚠️ 赤い箱は郵便ポストです。キーボックスではありません。",
        image: "IMG_1759.jpeg",
        imageAlt: "キーボックスの場所 / Where is the key box?",
        highlight: "キーナンバー：玄関「0528」",
      },
      {
        title: "鍵の開け方",
        image: KEY_TURN_PHOTO,
        imageAlt: "鍵を奥までしっかり差し込む / Insert the key all the way in",
        steps: [
          "写真のように、鍵を奥までしっかり差し込みます。",
          "左に回します。",
          "鍵を抜いて、扉を開けます。",
        ],
      },
      {
        title: "ご宿泊部屋",
        body: "チェックイン2日前にメールにてご連絡いたします。",
      },
    ],
    linkLabel: "",
    linkUrl: "",
  },
  en: {
    notice:
      "⚠️ You cannot come back to this screen.\nBefore leaving this page, please save EVERYTHING as screenshots.\n(You will need it at check-in.)",
    sections: [
      {
        title: "Check-in",
        body: `Check-in is available from 4:00 PM. This is a self check-in property.
When you arrive, please enter the code into the key box shown below to get the key, then let yourself in.
Please do not take the key off the premises.`,
      },
      {
        title: "Key box",
        body: "It is a small black box right next to the handle of the entrance door.",
        warning: "⚠️ The red box is the mailbox. It is NOT the key box.",
        image: "IMG_1759.jpeg",
        imageAlt: "キーボックスの場所 / Where is the key box?",
        highlight: "Key number: Front door \"0528\"",
      },
      {
        title: "How to unlock the door",
        image: KEY_TURN_PHOTO,
        imageAlt: "鍵を奥までしっかり差し込む / Insert the key all the way in",
        steps: [
          "Insert the key all the way in, as shown in the photo.",
          "Turn it to the left (counter-clockwise).",
          "Pull the key out and open the door.",
        ],
      },
      {
        title: "Your room",
        body: "We will contact you by email 2 days before your check-in date.",
      },
    ],
    linkLabel: "",
    linkUrl: "",
  },
};

