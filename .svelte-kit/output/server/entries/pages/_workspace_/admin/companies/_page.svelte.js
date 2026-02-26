import { a1 as sanitize_props, a7 as rest_props, a8 as attributes, a6 as bind_props, a4 as ensure_array_like, Z as store_get, $ as unsubscribe_stores, a0 as attr_class, a5 as stringify } from "../../../../../chunks/index2.js";
import { t as tick, c as createEventDispatcher } from "../../../../../chunks/index-server.js";
import { getExampleNumber, AsYouType, getCountryCallingCode, Metadata, parsePhoneNumberWithError, ParseError } from "libphonenumber-js/max";
import { w as fallback } from "../../../../../chunks/context.js";
import { c as clsx, a as attr } from "../../../../../chunks/attributes.js";
import { e as escape_html } from "../../../../../chunks/escaping.js";
import { p as page } from "../../../../../chunks/stores.js";
import * as devalue from "devalue";
import "clsx";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/state.svelte.js";
import { a as app } from "../../../../../chunks/app.js";
import { i as invalidateAll, a as applyAction } from "../../../../../chunks/client.js";
import { P as Plus } from "../../../../../chunks/plus.js";
import { S as Search } from "../../../../../chunks/search.js";
import { F as Filter } from "../../../../../chunks/filter.js";
import { C as Credit_card } from "../../../../../chunks/credit-card.js";
import { B as Building_2 } from "../../../../../chunks/building-2.js";
import { U as Users } from "../../../../../chunks/users.js";
import { L as Loader_circle } from "../../../../../chunks/loader-circle.js";
import { U as Upload } from "../../../../../chunks/upload.js";
import { T as Trash_2 } from "../../../../../chunks/trash-2.js";
import { M as Map_pin } from "../../../../../chunks/map-pin.js";
import { P as Pencil } from "../../../../../chunks/pencil.js";
import { L as Link } from "../../../../../chunks/link.js";
import { F as File_text } from "../../../../../chunks/file-text.js";
function deserialize(result) {
  const parsed = JSON.parse(result);
  if (parsed.data) {
    parsed.data = devalue.parse(parsed.data, app.decoders);
  }
  return parsed;
}
const allCountries = [
  ["Afghanistan (‫افغانستان‬‎)", "af", "93"],
  ["Albania (Shqipëri)", "al", "355"],
  ["Algeria (‫الجزائر‬‎)", "dz", "213"],
  ["American Samoa", "as", "1", 5, ["684"]],
  ["Andorra", "ad", "376"],
  ["Angola", "ao", "244"],
  ["Anguilla", "ai", "1", 6, ["264"]],
  ["Antigua and Barbuda", "ag", "1", 7, ["268"]],
  ["Argentina", "ar", "54"],
  ["Armenia (Հայաստան)", "am", "374"],
  ["Aruba", "aw", "297"],
  ["Ascension Island", "ac", "247"],
  ["Australia", "au", "61", 0],
  ["Austria (Österreich)", "at", "43"],
  ["Azerbaijan (Azərbaycan)", "az", "994"],
  ["Bahamas", "bs", "1", 8, ["242"]],
  ["Bahrain (‫البحرين‬‎)", "bh", "973"],
  ["Bangladesh (বাংলাদেশ)", "bd", "880"],
  ["Barbados", "bb", "1", 9, ["246"]],
  ["Belarus (Беларусь)", "by", "375"],
  ["Belgium (België)", "be", "32"],
  ["Belize", "bz", "501"],
  ["Benin (Bénin)", "bj", "229"],
  ["Bermuda", "bm", "1", 10, ["441"]],
  ["Bhutan (འབྲུག)", "bt", "975"],
  ["Bolivia", "bo", "591"],
  ["Bosnia and Herzegovina (Босна и Херцеговина)", "ba", "387"],
  ["Botswana", "bw", "267"],
  ["Brazil (Brasil)", "br", "55"],
  ["British Indian Ocean Territory", "io", "246"],
  ["British Virgin Islands", "vg", "1", 11, ["284"]],
  ["Brunei", "bn", "673"],
  ["Bulgaria (България)", "bg", "359"],
  ["Burkina Faso", "bf", "226"],
  ["Burundi (Uburundi)", "bi", "257"],
  ["Cambodia (កម្ពុជា)", "kh", "855"],
  ["Cameroon (Cameroun)", "cm", "237"],
  [
    "Canada",
    "ca",
    "1",
    1,
    [
      "204",
      "226",
      "236",
      "249",
      "250",
      "289",
      "306",
      "343",
      "365",
      "387",
      "403",
      "416",
      "418",
      "431",
      "437",
      "438",
      "450",
      "506",
      "514",
      "519",
      "548",
      "579",
      "581",
      "587",
      "604",
      "613",
      "639",
      "647",
      "672",
      "705",
      "709",
      "742",
      "778",
      "780",
      "782",
      "807",
      "819",
      "825",
      "867",
      "873",
      "902",
      "905"
    ]
  ],
  ["Cape Verde (Kabu Verdi)", "cv", "238"],
  ["Caribbean Netherlands", "bq", "599", 1, ["3", "4", "7"]],
  ["Cayman Islands", "ky", "1", 12, ["345"]],
  ["Central African Republic (République centrafricaine)", "cf", "236"],
  ["Chad (Tchad)", "td", "235"],
  ["Chile", "cl", "56"],
  ["China (中国)", "cn", "86"],
  ["Christmas Island", "cx", "61", 2, ["89164"]],
  ["Cocos (Keeling) Islands", "cc", "61", 1, ["89162"]],
  ["Colombia", "co", "57"],
  ["Comoros (‫جزر القمر‬‎)", "km", "269"],
  ["Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)", "cd", "243"],
  ["Congo (Republic) (Congo-Brazzaville)", "cg", "242"],
  ["Cook Islands", "ck", "682"],
  ["Costa Rica", "cr", "506"],
  ["Côte d’Ivoire", "ci", "225"],
  ["Croatia (Hrvatska)", "hr", "385"],
  ["Cuba", "cu", "53"],
  ["Curaçao", "cw", "599", 0],
  ["Cyprus (Κύπρος)", "cy", "357"],
  ["Czech Republic (Česká republika)", "cz", "420"],
  ["Denmark (Danmark)", "dk", "45"],
  ["Djibouti", "dj", "253"],
  ["Dominica", "dm", "1", 13, ["767"]],
  ["Dominican Republic (República Dominicana)", "do", "1", 2, ["809", "829", "849"]],
  ["Ecuador", "ec", "593"],
  ["Egypt (‫مصر‬‎)", "eg", "20"],
  ["El Salvador", "sv", "503"],
  ["Equatorial Guinea (Guinea Ecuatorial)", "gq", "240"],
  ["Eritrea", "er", "291"],
  ["Estonia (Eesti)", "ee", "372"],
  ["Eswatini", "sz", "268"],
  ["Ethiopia", "et", "251"],
  ["Falkland Islands (Islas Malvinas)", "fk", "500"],
  ["Faroe Islands (Føroyar)", "fo", "298"],
  ["Fiji", "fj", "679"],
  ["Finland (Suomi)", "fi", "358", 0],
  ["France", "fr", "33"],
  ["French Guiana (Guyane française)", "gf", "594"],
  ["French Polynesia (Polynésie française)", "pf", "689"],
  ["Gabon", "ga", "241"],
  ["Gambia", "gm", "220"],
  ["Georgia (საქართველო)", "ge", "995"],
  ["Germany (Deutschland)", "de", "49"],
  ["Ghana (Gaana)", "gh", "233"],
  ["Gibraltar", "gi", "350"],
  ["Greece (Ελλάδα)", "gr", "30"],
  ["Greenland (Kalaallit Nunaat)", "gl", "299"],
  ["Grenada", "gd", "1", 14, ["473"]],
  ["Guadeloupe", "gp", "590", 0],
  ["Guam", "gu", "1", 15, ["671"]],
  ["Guatemala", "gt", "502"],
  ["Guernsey", "gg", "44", 1, ["1481", "7781", "7839", "7911"]],
  ["Guinea (Guinée)", "gn", "224"],
  ["Guinea-Bissau (Guiné Bissau)", "gw", "245"],
  ["Guyana", "gy", "592"],
  ["Haiti", "ht", "509"],
  ["Honduras", "hn", "504"],
  ["Hong Kong (香港)", "hk", "852"],
  ["Hungary (Magyarország)", "hu", "36"],
  ["Iceland (Ísland)", "is", "354"],
  ["India (भारत)", "in", "91"],
  ["Indonesia", "id", "62"],
  ["Iran (‫ایران‬‎)", "ir", "98"],
  ["Iraq (‫العراق‬‎)", "iq", "964"],
  ["Ireland", "ie", "353"],
  ["Isle of Man", "im", "44", 2, ["1624", "74576", "7524", "7924", "7624"]],
  ["Israel (‫ישראל‬‎)", "il", "972"],
  ["Italy (Italia)", "it", "39", 0],
  ["Jamaica", "jm", "1", 4, ["876", "658"]],
  ["Japan (日本)", "jp", "81"],
  ["Jersey", "je", "44", 3, ["1534", "7509", "7700", "7797", "7829", "7937"]],
  ["Jordan (‫الأردن‬‎)", "jo", "962"],
  ["Kazakhstan (Казахстан)", "kz", "7", 1, ["33", "7"]],
  ["Kenya", "ke", "254"],
  ["Kiribati", "ki", "686"],
  ["Kosovo", "xk", "383"],
  ["Kuwait (‫الكويت‬‎)", "kw", "965"],
  ["Kyrgyzstan (Кыргызстан)", "kg", "996"],
  ["Laos (ລາວ)", "la", "856"],
  ["Latvia (Latvija)", "lv", "371"],
  ["Lebanon (‫لبنان‬‎)", "lb", "961"],
  ["Lesotho", "ls", "266"],
  ["Liberia", "lr", "231"],
  ["Libya (‫ليبيا‬‎)", "ly", "218"],
  ["Liechtenstein", "li", "423"],
  ["Lithuania (Lietuva)", "lt", "370"],
  ["Luxembourg", "lu", "352"],
  ["Macau (澳門)", "mo", "853"],
  ["North Macedonia (Македонија)", "mk", "389"],
  ["Madagascar (Madagasikara)", "mg", "261"],
  ["Malawi", "mw", "265"],
  ["Malaysia", "my", "60"],
  ["Maldives", "mv", "960"],
  ["Mali", "ml", "223"],
  ["Malta", "mt", "356"],
  ["Marshall Islands", "mh", "692"],
  ["Martinique", "mq", "596"],
  ["Mauritania (‫موريتانيا‬‎)", "mr", "222"],
  ["Mauritius (Moris)", "mu", "230"],
  ["Mayotte", "yt", "262", 1, ["269", "639"]],
  ["Mexico (México)", "mx", "52"],
  ["Micronesia", "fm", "691"],
  ["Moldova (Republica Moldova)", "md", "373"],
  ["Monaco", "mc", "377"],
  ["Mongolia (Монгол)", "mn", "976"],
  ["Montenegro (Crna Gora)", "me", "382"],
  ["Montserrat", "ms", "1", 16, ["664"]],
  ["Morocco (‫المغرب‬‎)", "ma", "212", 0],
  ["Mozambique (Moçambique)", "mz", "258"],
  ["Myanmar (Burma) (မြန်မာ)", "mm", "95"],
  ["Namibia (Namibië)", "na", "264"],
  ["Nauru", "nr", "674"],
  ["Nepal (नेपाल)", "np", "977"],
  ["Netherlands (Nederland)", "nl", "31"],
  ["New Caledonia (Nouvelle-Calédonie)", "nc", "687"],
  ["New Zealand", "nz", "64"],
  ["Nicaragua", "ni", "505"],
  ["Niger (Nijar)", "ne", "227"],
  ["Nigeria", "ng", "234"],
  ["Niue", "nu", "683"],
  ["Norfolk Island", "nf", "672"],
  ["North Korea (조선 민주주의 인민 공화국)", "kp", "850"],
  ["Northern Mariana Islands", "mp", "1", 17, ["670"]],
  ["Norway (Norge)", "no", "47", 0],
  ["Oman (‫عُمان‬‎)", "om", "968"],
  ["Pakistan (‫پاکستان‬‎)", "pk", "92"],
  ["Palau", "pw", "680"],
  ["Palestine (‫فلسطين‬‎)", "ps", "970"],
  ["Panama (Panamá)", "pa", "507"],
  ["Papua New Guinea", "pg", "675"],
  ["Paraguay", "py", "595"],
  ["Peru (Perú)", "pe", "51"],
  ["Philippines", "ph", "63"],
  ["Poland (Polska)", "pl", "48"],
  ["Portugal", "pt", "351"],
  ["Puerto Rico", "pr", "1", 3, ["787", "939"]],
  ["Qatar (‫قطر‬‎)", "qa", "974"],
  ["Réunion (La Réunion)", "re", "262", 0],
  ["Romania (România)", "ro", "40"],
  ["Russia (Россия)", "ru", "7", 0],
  ["Rwanda", "rw", "250"],
  ["Saint Barthélemy", "bl", "590", 1],
  ["Saint Helena", "sh", "290"],
  ["Saint Kitts and Nevis", "kn", "1", 18, ["869"]],
  ["Saint Lucia", "lc", "1", 19, ["758"]],
  ["Saint Martin (Saint-Martin (partie française))", "mf", "590", 2],
  ["Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)", "pm", "508"],
  ["Saint Vincent and the Grenadines", "vc", "1", 20, ["784"]],
  ["Samoa", "ws", "685"],
  ["San Marino", "sm", "378"],
  ["São Tomé and Príncipe (São Tomé e Príncipe)", "st", "239"],
  ["Saudi Arabia (‫المملكة العربية السعودية‬‎)", "sa", "966"],
  ["Senegal (Sénégal)", "sn", "221"],
  ["Serbia (Србија)", "rs", "381"],
  ["Seychelles", "sc", "248"],
  ["Sierra Leone", "sl", "232"],
  ["Singapore", "sg", "65"],
  ["Sint Maarten", "sx", "1", 21, ["721"]],
  ["Slovakia (Slovensko)", "sk", "421"],
  ["Slovenia (Slovenija)", "si", "386"],
  ["Solomon Islands", "sb", "677"],
  ["Somalia (Soomaaliya)", "so", "252"],
  ["South Africa", "za", "27"],
  ["South Korea (대한민국)", "kr", "82"],
  ["South Sudan (‫جنوب السودان‬‎)", "ss", "211"],
  ["Spain (España)", "es", "34"],
  ["Sri Lanka (ශ්‍රී ලංකාව)", "lk", "94"],
  ["Sudan (‫السودان‬‎)", "sd", "249"],
  ["Suriname", "sr", "597"],
  ["Svalbard and Jan Mayen", "sj", "47", 1, ["79"]],
  ["Sweden (Sverige)", "se", "46"],
  ["Switzerland (Schweiz)", "ch", "41"],
  ["Syria (‫سوريا‬‎)", "sy", "963"],
  ["Taiwan (台灣)", "tw", "886"],
  ["Tajikistan", "tj", "992"],
  ["Tanzania", "tz", "255"],
  ["Thailand (ไทย)", "th", "66"],
  ["Timor-Leste", "tl", "670"],
  ["Togo", "tg", "228"],
  ["Tokelau", "tk", "690"],
  ["Tonga", "to", "676"],
  ["Trinidad and Tobago", "tt", "1", 22, ["868"]],
  ["Tristan da Cunha", "ta", "290"],
  ["Tunisia (‫تونس‬‎)", "tn", "216"],
  ["Turkey (Türkiye)", "tr", "90"],
  ["Turkmenistan", "tm", "993"],
  ["Turks and Caicos Islands", "tc", "1", 23, ["649"]],
  ["Tuvalu", "tv", "688"],
  ["U.S. Virgin Islands", "vi", "1", 24, ["340"]],
  ["Uganda", "ug", "256"],
  ["Ukraine (Україна)", "ua", "380"],
  ["United Arab Emirates (‫الإمارات العربية المتحدة‬‎)", "ae", "971"],
  ["United Kingdom", "gb", "44", 0],
  ["United States", "us", "1", 0],
  ["Uruguay", "uy", "598"],
  ["Uzbekistan (Oʻzbekiston)", "uz", "998"],
  ["Vanuatu", "vu", "678"],
  ["Vatican City (Città del Vaticano)", "va", "39", 1, ["06698"]],
  ["Venezuela", "ve", "58"],
  ["Vietnam (Việt Nam)", "vn", "84"],
  ["Wallis and Futuna (Wallis-et-Futuna)", "wf", "681"],
  ["Western Sahara (‫الصحراء الغربية‬‎)", "eh", "212", 1, ["5288", "5289"]],
  ["Yemen (‫اليمن‬‎)", "ye", "967"],
  ["Zambia", "zm", "260"],
  ["Zimbabwe", "zw", "263"],
  ["Åland Islands", "ax", "358", 1, ["18"]]
];
const normalizedCountries = allCountries.map((country) => {
  return {
    id: country[1].toUpperCase(),
    label: `${country[0]} +${country[2]}`,
    name: country[0],
    iso2: country[1].toUpperCase(),
    dialCode: country[2],
    priority: country[3] || 0,
    areaCodes: country[4] || null
  };
});
const examplePhoneNumbers = { "AC": "40123", "AD": "312345", "AE": "501234567", "AF": "701234567", "AG": "2684641234", "AI": "2642351234", "AL": "672123456", "AM": "77123456", "AO": "923123456", "AR": "91123456789", "AS": "6847331234", "AT": "664123456", "AU": "412345678", "AW": "5601234", "AX": "412345678", "AZ": "401234567", "BA": "61123456", "BB": "2462501234", "BD": "1812345678", "BE": "470123456", "BF": "70123456", "BG": "43012345", "BH": "36001234", "BI": "79561234", "BJ": "90011234", "BL": "690001234", "BM": "4413701234", "BN": "7123456", "BO": "71234567", "BQ": "3181234", "BR": "11961234567", "BS": "2423591234", "BT": "17123456", "BW": "71123456", "BY": "294911911", "BZ": "6221234", "CA": "5062345678", "CC": "412345678", "CD": "991234567", "CF": "70012345", "CG": "061234567", "CH": "781234567", "CI": "0123456789", "CK": "71234", "CL": "221234567", "CM": "671234567", "CN": "13123456789", "CO": "3211234567", "CR": "83123456", "CU": "51234567", "CV": "9911234", "CW": "95181234", "CX": "412345678", "CY": "96123456", "CZ": "601123456", "DE": "15123456789", "DJ": "77831001", "DK": "32123456", "DM": "7672251234", "DO": "8092345678", "DZ": "551234567", "EC": "991234567", "EE": "51234567", "EG": "1001234567", "EH": "650123456", "ER": "7123456", "ES": "612345678", "ET": "911234567", "FI": "412345678", "FJ": "7012345", "FK": "51234", "FM": "3501234", "FO": "211234", "FR": "612345678", "GA": "06031234", "GB": "7400123456", "GD": "4734031234", "GE": "555123456", "GF": "694201234", "GG": "7781123456", "GH": "231234567", "GI": "57123456", "GL": "221234", "GM": "3012345", "GN": "601123456", "GP": "690001234", "GQ": "222123456", "GR": "6912345678", "GT": "51234567", "GU": "6713001234", "GW": "955012345", "GY": "6091234", "HK": "51234567", "HN": "91234567", "HR": "921234567", "HT": "34101234", "HU": "201234567", "ID": "812345678", "IE": "850123456", "IL": "502345678", "IM": "7924123456", "IN": "8123456789", "IO": "3801234", "IQ": "7912345678", "IR": "9123456789", "IS": "6111234", "IT": "3123456789", "JE": "7797712345", "JM": "8762101234", "JO": "790123456", "JP": "9012345678", "KE": "712123456", "KG": "700123456", "KH": "91234567", "KI": "72001234", "KM": "3212345", "KN": "8697652917", "KP": "1921234567", "KR": "1020000000", "KW": "50012345", "KY": "3453231234", "KZ": "7710009998", "LA": "2023123456", "LB": "71123456", "LC": "7582845678", "LI": "660234567", "LK": "712345678", "LR": "770123456", "LS": "50123456", "LT": "61234567", "LU": "628123456", "LV": "21234567", "LY": "912345678", "MA": "650123456", "MC": "612345678", "MD": "62112345", "ME": "67622901", "MF": "690001234", "MG": "321234567", "MH": "2351234", "MK": "72345678", "ML": "65012345", "MM": "92123456", "MN": "88123456", "MO": "66123456", "MP": "6702345678", "MQ": "696201234", "MR": "22123456", "MS": "6644923456", "MT": "96961234", "MU": "52512345", "MV": "7712345", "MW": "991234567", "MX": "12221234567", "MY": "123456789", "MZ": "821234567", "NA": "811234567", "NC": "751234", "NE": "93123456", "NF": "381234", "NG": "8021234567", "NI": "81234567", "NL": "612345678", "NO": "40612345", "NP": "9841234567", "NR": "5551234", "NU": "8884012", "NZ": "211234567", "OM": "92123456", "PA": "61234567", "PE": "912345678", "PF": "87123456", "PG": "70123456", "PH": "9051234567", "PK": "3012345678", "PL": "512345678", "PM": "551234", "PR": "7872345678", "PS": "599123456", "PT": "912345678", "PW": "6201234", "PY": "961456789", "QA": "33123456", "RE": "692123456", "RO": "712034567", "RS": "601234567", "RU": "9123456789", "RW": "720123456", "SA": "512345678", "SB": "7421234", "SC": "2510123", "SD": "911231234", "SE": "701234567", "SG": "81234567", "SH": "51234", "SI": "31234567", "SJ": "41234567", "SK": "912123456", "SL": "25123456", "SM": "66661212", "SN": "701234567", "SO": "71123456", "SR": "7412345", "SS": "977123456", "ST": "9812345", "SV": "70123456", "SX": "7215205678", "SY": "944567890", "SZ": "76123456", "TA": "8999", "TC": "6492311234", "TD": "63012345", "TG": "90112345", "TH": "812345678", "TJ": "917123456", "TK": "7290", "TL": "77212345", "TM": "66123456", "TN": "20123456", "TO": "7715123", "TR": "5012345678", "TT": "8682911234", "TV": "901234", "TW": "912345678", "TZ": "621234567", "UA": "501234567", "UG": "712345678", "US": "2015550123", "UY": "94231234", "UZ": "912345678", "VA": "3123456789", "VC": "7844301234", "VE": "4121234567", "VG": "2843001234", "VI": "3406421234", "VN": "912345678", "VU": "5912345", "WF": "821234", "WS": "7212345", "XK": "43201234", "YE": "712345678", "YT": "639012345", "ZA": "711234567", "ZM": "955123456", "ZW": "712345678" };
const normalizeTelInput = (input) => {
  const filteredResult = Object.fromEntries(Object.entries({
    countryCode: input ? input.country : null,
    isValid: input ? input.isValid() : false,
    isPossible: input ? input.isPossible() : false,
    phoneNumber: input ? input.number : null,
    countryCallingCode: input ? input.countryCallingCode : null,
    formattedNumber: input ? new AsYouType().input(input.number) : null,
    nationalNumber: input ? input.nationalNumber : null,
    formatInternational: input ? new AsYouType().input(input.number) : null,
    formatOriginal: input ? new AsYouType().input(input.number).slice(input.countryCallingCode.length + 1).trim() : null,
    formatNational: input ? new AsYouType(input.country).input(input.number) : null,
    uri: input ? input.getURI() : null,
    e164: input ? input.number : null
  }).filter(([, value]) => value !== null));
  return filteredResult;
};
const generatePlaceholder = (country, { format, spaces } = {
  format: "national",
  spaces: true
}) => {
  const examplePhoneNumber = getExampleNumber(country, examplePhoneNumbers);
  if (examplePhoneNumber) {
    switch (format) {
      case "international":
        return spaces ? examplePhoneNumber.formatInternational() : examplePhoneNumber.number;
      default:
        return spaces ? examplePhoneNumber.formatInternational().slice(examplePhoneNumber.countryCallingCode.length + 1).trim() : examplePhoneNumber.nationalNumber;
    }
  } else {
    throw new Error(`No country found with this country code: ${country}`);
  }
};
const getInternationalPhoneNumberPrefix = (country) => {
  const ONLY_DIGITS_REGEXP = /^\d+$/;
  let prefix = "+" + getCountryCallingCode(country);
  const newMetadata = new Metadata();
  const leadingDigits = newMetadata.numberingPlan?.leadingDigits();
  if (leadingDigits && ONLY_DIGITS_REGEXP.test(leadingDigits)) {
    prefix += leadingDigits;
  }
  return prefix;
};
const getCountryForPartialE164Number = (partialE164Number, { country, countries, required } = {}) => {
  if (partialE164Number === "+") {
    return country;
  }
  const derived_country = getCountryFromPossiblyIncompleteInternationalPhoneNumber(partialE164Number);
  if (derived_country && (!countries || countries.indexOf(derived_country) >= 0)) {
    return derived_country;
  } else if (country && !required && !couldNumberBelongToCountry(partialE164Number, country)) {
    return void 0;
  }
  return country;
};
const getCountryFromPossiblyIncompleteInternationalPhoneNumber = (number) => {
  const formatter = new AsYouType();
  formatter.input(number);
  return formatter.getCountry();
};
const couldNumberBelongToCountry = (number, country) => {
  const intlPhoneNumberPrefix = getInternationalPhoneNumberPrefix(country);
  let i = 0;
  while (i < number.length && i < intlPhoneNumberPrefix.length) {
    if (number[i] !== intlPhoneNumberPrefix[i]) {
      return false;
    }
    i++;
  }
  return true;
};
const allowedCharacters = (character, { spaces } = {
  spaces: true
}) => {
  const DIGITS = {
    "0": "0",
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "０": "0",
    // Fullwidth digit 0
    "１": "1",
    // Fullwidth digit 1
    "２": "2",
    // Fullwidth digit 2
    "３": "3",
    // Fullwidth digit 3
    "４": "4",
    // Fullwidth digit 4
    "５": "5",
    // Fullwidth digit 5
    "６": "6",
    // Fullwidth digit 6
    "７": "7",
    // Fullwidth digit 7
    "８": "8",
    // Fullwidth digit 8
    "９": "9",
    // Fullwidth digit 9
    "٠": "0",
    // Arabic-indic digit 0
    "١": "1",
    // Arabic-indic digit 1
    "٢": "2",
    // Arabic-indic digit 2
    "٣": "3",
    // Arabic-indic digit 3
    "٤": "4",
    // Arabic-indic digit 4
    "٥": "5",
    // Arabic-indic digit 5
    "٦": "6",
    // Arabic-indic digit 6
    "٧": "7",
    // Arabic-indic digit 7
    "٨": "8",
    // Arabic-indic digit 8
    "٩": "9",
    // Arabic-indic digit 9
    "۰": "0",
    // Eastern-Arabic digit 0
    "۱": "1",
    // Eastern-Arabic digit 1
    "۲": "2",
    // Eastern-Arabic digit 2
    "۳": "3",
    // Eastern-Arabic digit 3
    "۴": "4",
    // Eastern-Arabic digit 4
    "۵": "5",
    // Eastern-Arabic digit 5
    "۶": "6",
    // Eastern-Arabic digit 6
    "۷": "7",
    // Eastern-Arabic digit 7
    "۸": "8",
    // Eastern-Arabic digit 8
    "۹": "9"
    // Eastern-Arabic digit 9,
  };
  if (spaces) {
    const regex = new RegExp("[\\t\\n\\v\\f\\r \\u00a0\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u200b\\u2028\\u2029\\u3000]", "g");
    if (regex.test(character)) {
      return character;
    }
  }
  return DIGITS[character];
};
function TelInput($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "updateValue",
    "autocomplete",
    "class",
    "disabled",
    "id",
    "name",
    "placeholder",
    "readonly",
    "required",
    "size",
    "value",
    "country",
    "detailedValue",
    "valid",
    "options",
    "el"
  ]);
  $$renderer.component(($$renderer2) => {
    let getPlaceholder;
    const dispatch = createEventDispatcher();
    const defaultOptions = {
      autoPlaceholder: true,
      spaces: true,
      invalidateOnCountryChange: false,
      format: "national",
      strictCountry: false
    };
    let autocomplete = fallback($$props["autocomplete"], null);
    let classes = fallback($$props["class"], "");
    let disabled = fallback($$props["disabled"], false);
    let id = fallback($$props["id"], () => "phone-input-" + (/* @__PURE__ */ new Date()).getTime().toString(36) + Math.random().toString(36).slice(2), true);
    let name = fallback($$props["name"], null);
    let placeholder = fallback($$props["placeholder"], null);
    let readonly = fallback($$props["readonly"], null);
    let required = fallback($$props["required"], null);
    let size = fallback($$props["size"], null);
    let value = $$props["value"];
    let country = fallback($$props["country"], () => void 0, true);
    let detailedValue = fallback($$props["detailedValue"], null);
    let valid = fallback($$props["valid"], true);
    let options = fallback($$props["options"], defaultOptions);
    let el = fallback($$props["el"], () => void 0, true);
    let inputValue = value;
    let prevCountry = country;
    const combinedOptions = { ...defaultOptions, ...options };
    const updateCountry = (countryCode) => {
      if (countryCode !== country) {
        country = countryCode;
        prevCountry = country;
      }
      return country;
    };
    const findNewCursorPosition = (newValue, formattedValue, initialCursorPosition) => {
      if (initialCursorPosition >= newValue.length) {
        return formattedValue.length;
      }
      let fvIndex = 0;
      for (let nvIndex = 0; nvIndex < initialCursorPosition; nvIndex++) {
        const nvChar = allowedCharacters(newValue[nvIndex], { spaces: false });
        if (nvChar >= "0" && nvChar <= "9") {
          while (!(formattedValue[fvIndex] >= "0" && formattedValue[fvIndex] <= "9") && fvIndex < formattedValue.length) {
            fvIndex++;
          }
          fvIndex++;
        }
      }
      return fvIndex;
    };
    const handleParsePhoneNumber = async (rawInput, currCountry = null) => {
      const input = rawInput;
      if (input !== null) {
        const detectedCountry = getCountryForPartialE164Number(input);
        const useCountry = options?.strictCountry ? currCountry : detectedCountry ?? currCountry;
        if (!options?.strictCountry && detectedCountry && detectedCountry !== prevCountry) {
          updateCountry(detectedCountry);
        }
        try {
          detailedValue = normalizeTelInput(parsePhoneNumberWithError(input, useCountry ?? void 0));
        } catch (err) {
          if (err instanceof ParseError) {
            detailedValue = { isValid: false, error: err.message };
            dispatch("parseError", err.message);
          } else {
            throw err;
          }
        }
        const formatOption = combinedOptions.format === "national" ? "nationalNumber" : "e164";
        const formattedValue = combinedOptions.format === "national" ? "formatOriginal" : "formatInternational";
        const initialCursorPosition = el?.selectionStart || 0;
        if (combinedOptions.spaces && detailedValue?.[formattedValue]) {
          inputValue = detailedValue[formattedValue] ?? null;
          await tick();
          if (el) {
            const newCursorPosition = findNewCursorPosition(input, inputValue, initialCursorPosition);
            el.selectionStart = newCursorPosition;
            el.selectionEnd = newCursorPosition;
          }
        } else if (detailedValue?.[formatOption]) {
          inputValue = detailedValue[formatOption] ?? null;
          await tick();
          if (el) {
            const newCursorPosition = findNewCursorPosition(input, inputValue, initialCursorPosition);
            el.selectionStart = newCursorPosition;
            el.selectionEnd = newCursorPosition;
          }
        }
        value = detailedValue?.e164 ?? input ?? null;
        valid = detailedValue?.isValid ?? false;
      } else if (input === null && currCountry !== null) {
        if (currCountry !== prevCountry) {
          prevCountry = currCountry;
          valid = !options.invalidateOnCountryChange;
          value = null;
          inputValue = null;
          detailedValue = null;
        }
      } else {
        valid = true;
        value = null;
        detailedValue = null;
        prevCountry = currCountry;
        inputValue = null;
      }
    };
    let countryWatchInitRun = true;
    const countryChangeWatchFunction = (current) => {
      if (!countryWatchInitRun) {
        handleParsePhoneNumber(null, current);
      }
      countryWatchInitRun = false;
    };
    const updateValue = (newValue, newCountry) => {
      const castedValue = newValue;
      if (castedValue) {
        handleParsePhoneNumber(castedValue, options?.strictCountry ? country : getCountryForPartialE164Number(castedValue) || newCountry);
      }
    };
    countryChangeWatchFunction(country);
    getPlaceholder = combinedOptions.autoPlaceholder && country ? generatePlaceholder(country, {
      format: combinedOptions.format,
      spaces: combinedOptions.spaces
    }) : placeholder;
    if (value === null && inputValue !== null && detailedValue !== null) {
      inputValue = null;
      detailedValue = null;
    }
    $$renderer2.push(`<input${attributes(
      {
        ...$$restProps,
        autocomplete,
        class: clsx(classes),
        disabled,
        id,
        name,
        readonly,
        required,
        size,
        placeholder: getPlaceholder,
        type: "tel",
        value: inputValue
      },
      void 0,
      void 0,
      void 0,
      4
    )}/>`);
    bind_props($$props, {
      autocomplete,
      class: classes,
      disabled,
      id,
      name,
      placeholder,
      readonly,
      required,
      size,
      value,
      country,
      detailedValue,
      valid,
      options,
      el,
      updateValue
    });
  });
}
function PhoneInput($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let value = fallback($$props["value"], null);
    let name = fallback($$props["name"], null);
    let id = fallback($$props["id"], null);
    let placeholder = fallback($$props["placeholder"], null);
    let disabled = fallback($$props["disabled"], false);
    let required = fallback($$props["required"], false);
    let defaultCountry = fallback($$props["defaultCountry"], "AR");
    let onblur = fallback($$props["onblur"], null);
    let selectedCountry = defaultCountry;
    let valid = true;
    let internalValue = value && value !== "" ? value : defaultCountry ? `+${getDialCode(defaultCountry)}` : null;
    function getDialCode(countryCode) {
      if (!countryCode) return "";
      const c = normalizedCountries.find((x) => x.iso2 === countryCode);
      return c ? String(c.dialCode) : "";
    }
    function flagEmoji(iso2) {
      if (!iso2 || iso2.length !== 2) return "";
      return iso2.toUpperCase().split("").map((c) => String.fromCodePoint(127462 - 65 + c.charCodeAt(0))).join("");
    }
    if (value !== void 0 && value !== null && value !== "" && String(value).trim() !== String(internalValue ?? "").trim()) {
      internalValue = value;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="phone-input-wrapper flex rounded-md border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background svelte-xx3wyc" role="group">`);
      $$renderer3.select(
        {
          class: "country-select flex items-center gap-1.5 h-10 pl-3 pr-2 border-0 bg-muted/50 text-sm font-medium text-foreground cursor-pointer focus:outline-none focus:ring-0 min-w-[100px]",
          "aria-label": "Código de país",
          value: selectedCountry
        },
        ($$renderer4) => {
          $$renderer4.push(`<!--[-->`);
          const each_array = ensure_array_like(normalizedCountries);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let country = each_array[$$index];
            $$renderer4.option({ value: country.iso2 }, ($$renderer5) => {
              $$renderer5.push(`${escape_html(flagEmoji(country.iso2))} +${escape_html(country.dialCode)}`);
            });
          }
          $$renderer4.push(`<!--]-->`);
        },
        "svelte-xx3wyc"
      );
      $$renderer3.push(` <div class="tel-input-cell flex-1 min-w-0">`);
      TelInput($$renderer3, {
        id: id ?? void 0,
        class: "tel-input h-10 w-full border-0 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0",
        placeholder,
        disabled,
        required,
        options: { autoPlaceholder: true, spaces: true, format: "international" },
        get country() {
          return selectedCountry;
        },
        set country($$value) {
          selectedCountry = $$value;
          $$settled = false;
        },
        get value() {
          return internalValue;
        },
        set value($$value) {
          internalValue = $$value;
          $$settled = false;
        },
        get valid() {
          return valid;
        },
        set valid($$value) {
          valid = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div></div> `);
      if (name) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<input type="hidden"${attr("name", name)}${attr("value", internalValue ?? "")}/>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, {
      value,
      name,
      id,
      placeholder,
      disabled,
      required,
      defaultCountry,
      onblur
    });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let countriesSorted, companies, usersList, detailRequested, selectedCompanyDetail, detailCompanyProjects, companiesListUrl, detailAddresses, detailLinks, detailDocuments;
    let data = $$props["data"];
    let form = $$props["form"];
    let adminSearch = "";
    let detailSaving = {};
    let detailSaveMessage = null;
    let detailLogoPreview = null;
    async function saveDetailField(name, value) {
      if (!selectedCompanyDetail) return;
      detailSaving[name] = true;
      detailSaving = detailSaving;
      const formData = new FormData();
      formData.append("company_id", String(selectedCompanyDetail.id));
      if (value instanceof File) {
        formData.append(name, value);
      } else {
        formData.append(name, String(value));
      }
      try {
        const response = await fetch("?/updateCompanyDetail", { method: "POST", body: formData });
        const result = deserialize(await response.text());
        if (result.type === "success") {
          detailSaveMessage = "Guardado";
          setTimeout(() => detailSaveMessage = null, 2e3);
          await invalidateAll();
        }
        applyAction(result);
      } catch (e) {
        console.error(e);
      } finally {
        detailSaving[name] = false;
        detailSaving = detailSaving;
      }
    }
    let detailUserForm = {
      email: "",
      projectPermissions: []
    };
    countriesSorted = [...normalizedCountries].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    companies = data.companies ?? [];
    usersList = data.usersList ?? [];
    data.ownerByCompanyId ?? {};
    detailRequested = data.detailRequested ?? false;
    selectedCompanyDetail = data.selectedCompanyDetail ?? null;
    data.detailCompanyUsers ?? [];
    detailCompanyProjects = data.detailCompanyProjects ?? [];
    adminSearch.trim() ? usersList.filter((u) => u.email.toLowerCase().includes(adminSearch.toLowerCase()) || u.firstName?.toLowerCase().includes(adminSearch.toLowerCase()) || u.lastName?.toLowerCase().includes(adminSearch.toLowerCase()) || `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase().trim().includes(adminSearch.toLowerCase())) : usersList;
    companiesListUrl = `/${store_get($$store_subs ??= {}, "$page", page).params.workspace}/admin/companies`;
    detailAddresses = selectedCompanyDetail ? selectedCompanyDetail.addresses || [] : [];
    detailLinks = selectedCompanyDetail ? selectedCompanyDetail.links || [] : [];
    detailDocuments = selectedCompanyDetail ? selectedCompanyDetail.documents || [] : [];
    if (selectedCompanyDetail) {
      detailLogoPreview = selectedCompanyDetail.logo || null;
    }
    (() => {
      if (!detailUserForm.email?.trim()) return false;
      const enabled = detailUserForm.projectPermissions.filter((p) => p.enabled);
      if (enabled.length === 0) return detailCompanyProjects.length === 0;
      return enabled.every((p) => p.permissions.requirements || p.permissions.requests || p.permissions.process || p.permissions.payments || p.permissions.support || p.permissions.proposals);
    })();
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="space-y-6">`);
      if (!detailRequested) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="flex items-center justify-between"><div><h2 class="text-3xl font-bold tracking-tight">Empresas</h2> <p class="text-muted-foreground">Listado de empresas registradas en la plataforma.</p></div> <button type="button" class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 flex items-center gap-2">`);
        Plus($$renderer3, { class: "w-4 h-4" });
        $$renderer3.push(`<!----> Agregar empresa</button></div> <div class="flex items-center gap-4"><div class="relative flex-1 max-w-sm">`);
        Search($$renderer3, {
          class: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
        });
        $$renderer3.push(`<!----> <input type="text" placeholder="Buscar empresas..." class="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"/></div> <button class="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-accent hover:text-accent-foreground">`);
        Filter($$renderer3, { class: "w-4 h-4" });
        $$renderer3.push(`<!----> Filtrar</button></div> <div class="rounded-md border bg-card"><table class="w-full text-sm text-left"><thead class="text-muted-foreground bg-muted/50 font-medium"><tr><th class="p-4">Nombre</th><th class="p-4">Email</th><th class="p-4">Web</th><th class="p-4">Región</th><th class="p-4">Usuarios</th><th class="p-4 text-right">Acciones</th></tr></thead><tbody><!--[-->`);
        const each_array = ensure_array_like(companies);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let company = each_array[$$index];
          const detailUrl = `${companiesListUrl}?detail=${company.id}`;
          const billingUrl = `/${store_get($$store_subs ??= {}, "$page", page).params.workspace}/admin/billing/${company.id}`;
          $$renderer3.push(`<tr class="border-t hover:bg-muted/50 transition-colors cursor-pointer"><td class="p-4 font-medium"><a${attr("href", detailUrl)} class="block text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded">${escape_html(company.name)}</a></td><td class="p-4 text-muted-foreground"><a${attr("href", detailUrl)} class="block">`);
          if (company.email) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<span class="hover:underline text-primary">${escape_html(company.email)}</span>`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`—`);
          }
          $$renderer3.push(`<!--]--></a></td><td class="p-4 text-muted-foreground"><a${attr("href", detailUrl)} class="block">`);
          if (company.website) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<span class="hover:underline text-primary truncate max-w-[180px] block">${escape_html(company.website)}</span>`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`—`);
          }
          $$renderer3.push(`<!--]--></a></td><td class="p-4 text-muted-foreground"><a${attr("href", detailUrl)} class="block">${escape_html(company.region ?? "—")}</a></td><td class="p-4"><a${attr("href", detailUrl)} class="block"><span class="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">${escape_html(company.usersCount)}</span></a></td><td class="p-4 text-right"><a${attr("href", billingUrl)} class="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">`);
          Credit_card($$renderer3, { class: "w-4 h-4" });
          $$renderer3.push(`<!----> Ver facturación</a></td></tr>`);
        }
        $$renderer3.push(`<!--]--></tbody></table></div> `);
        if (companies.length === 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="rounded-md border border-dashed bg-muted/30 p-12 text-center text-muted-foreground">`);
          Building_2($$renderer3, { class: "w-12 h-12 mx-auto mb-4 opacity-50" });
          $$renderer3.push(`<!----> <p class="font-medium">No hay empresas registradas</p> <p class="text-sm mt-1">Agregá una empresa con el botón superior.</p></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]-->`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (detailRequested) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="space-y-6"><div class="flex items-center justify-between"><div><button type="button" class="text-sm text-muted-foreground hover:text-foreground mb-1 block">← Volver al listado de empresas</button> <h2 class="text-2xl font-bold tracking-tight">Configuraciones</h2> <p class="text-muted-foreground">Gestiona tu cuenta y preferencias.</p></div> <div class="flex items-center gap-2">`);
        if (detailSaveMessage) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<span class="text-sm text-green-600">${escape_html(detailSaveMessage)}</span>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (selectedCompanyDetail) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<span class="text-sm text-muted-foreground">${escape_html(selectedCompanyDetail.name)}</span>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div></div> <div class="flex border-b overflow-x-auto"><button${attr_class(`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${stringify(
          "border-primary text-primary"
        )}`)}>`);
        Building_2($$renderer3, { class: "w-4 h-4" });
        $$renderer3.push(`<!----> Negocio</button> <button${attr_class(`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${stringify("border-transparent text-muted-foreground hover:text-foreground")}`)}>`);
        Users($$renderer3, { class: "w-4 h-4" });
        $$renderer3.push(`<!----> Usuarios y Permisos</button></div> `);
        if (!selectedCompanyDetail) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="rounded-xl border bg-card p-12 text-center text-muted-foreground">`);
          Building_2($$renderer3, { class: "w-12 h-12 mx-auto mb-4 opacity-50" });
          $$renderer3.push(`<!----> <p class="font-medium">Empresa no encontrada</p> <p class="text-sm mt-1">El ID solicitado no existe o no tienes acceso.</p> <button type="button" class="mt-4 text-sm font-medium text-primary hover:underline">← Volver al listado de empresas</button></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
          {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="space-y-6"><div class="rounded-xl border bg-card text-card-foreground shadow-sm"><div class="p-6 border-b"><h3 class="text-lg font-semibold flex items-center gap-2">`);
            Building_2($$renderer3, { class: "w-5 h-5 text-primary" });
            $$renderer3.push(`<!----> Detalles del Negocio</h3></div> <div class="p-6 space-y-8"><div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"><div class="relative group"><div class="w-24 h-24 rounded-lg overflow-hidden bg-muted border-2 border-border flex items-center justify-center">`);
            if (detailLogoPreview || selectedCompanyDetail.logo) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<img${attr("src", detailLogoPreview || selectedCompanyDetail.logo)} alt="Logo" class="w-full h-full object-cover"/>`);
            } else {
              $$renderer3.push("<!--[!-->");
              Building_2($$renderer3, { class: "w-10 h-10 text-muted-foreground" });
            }
            $$renderer3.push(`<!--]--> `);
            if (detailSaving["logo"]) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<div class="absolute inset-0 bg-background/50 flex items-center justify-center">`);
              Loader_circle($$renderer3, { class: "w-6 h-6 animate-spin text-primary" });
              $$renderer3.push(`<!----></div>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--></div> <button type="button" class="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full hover:opacity-90"${attr("disabled", !!detailSaving["logo"], true)}>`);
            Upload($$renderer3, { class: "w-4 h-4" });
            $$renderer3.push(`<!----></button> `);
            if ((detailLogoPreview || selectedCompanyDetail.logo) && !detailSaving["logo"]) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<button type="button" class="absolute top-0 right-0 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90">`);
              Trash_2($$renderer3, { class: "w-4 h-4" });
              $$renderer3.push(`<!----></button>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> <input type="file" accept="image/*" class="hidden"/></div> <div class="flex-1"><h4 class="font-medium">Logo de la Empresa</h4> <p class="text-sm text-muted-foreground">Sube el logo de tu empresa. Tamaño recomendado 400x400px.</p></div></div> <div class="grid grid-cols-1 gap-6"><div class="space-y-2"><label class="text-sm font-medium">Nombre de la Empresa</label> <input type="text"${attr("value", selectedCompanyDetail.name ?? "")} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"/></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label class="text-sm font-medium">Correo Electrónico</label> <input type="email"${attr("value", selectedCompanyDetail.email ?? "")} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"/></div> <div class="space-y-2"><label class="text-sm font-medium">Número de Teléfono</label> `);
            PhoneInput($$renderer3, {
              id: "detail-company-phone",
              name: null,
              value: selectedCompanyDetail.phone ?? "",
              placeholder: "Ej. 9 11 1234-5678",
              defaultCountry: "AR",
              onblur: (v) => saveDetailField("phone", v)
            });
            $$renderer3.push(`<!----></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label class="text-sm font-medium">Página web</label> <input type="url"${attr("value", selectedCompanyDetail.website ?? "")} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" placeholder="https://"/></div> <div class="space-y-2"><label class="text-sm font-medium">País / Región</label> `);
            $$renderer3.select(
              {
                value: selectedCompanyDetail.region ?? "",
                class: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              },
              ($$renderer4) => {
                $$renderer4.option({ value: "" }, ($$renderer5) => {
                  $$renderer5.push(`Seleccionar país`);
                });
                if (selectedCompanyDetail.region && !countriesSorted.find((c) => c.name === selectedCompanyDetail.region)) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.option({ value: selectedCompanyDetail.region }, ($$renderer5) => {
                    $$renderer5.push(`${escape_html(selectedCompanyDetail.region)}`);
                  });
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--><!--[-->`);
                const each_array_1 = ensure_array_like(countriesSorted);
                for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                  let country = each_array_1[$$index_1];
                  $$renderer4.option({ value: country.name }, ($$renderer5) => {
                    $$renderer5.push(`${escape_html(country.name)}`);
                  });
                }
                $$renderer4.push(`<!--]-->`);
              }
            );
            $$renderer3.push(`</div></div> <div class="space-y-2"><label class="text-sm font-medium">Descripción</label> <textarea class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Breve descripción">`);
            const $$body = escape_html(selectedCompanyDetail.description ?? "");
            if ($$body) {
              $$renderer3.push(`${$$body}`);
            }
            $$renderer3.push(`</textarea></div> <div class="space-y-2"><label class="text-sm font-medium">Límite de miembros</label> <input type="number" min="1" placeholder="Sin límite"${attr("value", selectedCompanyDetail.memberLimit ?? "")} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"/> <p class="text-xs text-muted-foreground">Incluye dueño, administradores y miembros. Vacío = sin límite.</p></div></div></div></div></div> <div class="space-y-6"><div class="rounded-xl border bg-card shadow-sm"><div class="p-6 border-b"><h3 class="text-lg font-semibold flex items-center gap-2">`);
            Map_pin($$renderer3, { class: "w-5 h-5 text-primary" });
            $$renderer3.push(`<!----> Direcciones</h3></div> <div class="p-6 space-y-4"><!--[-->`);
            const each_array_2 = ensure_array_like(detailAddresses);
            for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
              let addr = each_array_2[i];
              $$renderer3.push(`<div class="flex justify-between items-start p-3 rounded-lg border bg-muted/30"><div><div class="font-medium text-sm">${escape_html(addr.label)}</div> <div class="text-xs text-muted-foreground">${escape_html(addr.address)} `);
              if (addr.city) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`${escape_html(addr.city)}`);
              } else {
                $$renderer3.push("<!--[!-->");
              }
              $$renderer3.push(`<!--]--></div></div> <div class="flex items-center gap-1"><button type="button" class="text-muted-foreground hover:text-foreground p-1" title="Editar">`);
              Pencil($$renderer3, { class: "w-4 h-4" });
              $$renderer3.push(`<!----></button> <button type="button" class="text-muted-foreground hover:text-destructive p-1">`);
              Trash_2($$renderer3, { class: "w-4 h-4" });
              $$renderer3.push(`<!----></button></div></div>`);
            }
            $$renderer3.push(`<!--]--> `);
            {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push(`<button type="button" class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80">`);
              Plus($$renderer3, { class: "w-4 h-4" });
              $$renderer3.push(`<!----> Agregar Dirección</button>`);
            }
            $$renderer3.push(`<!--]--></div></div> <div class="rounded-xl border bg-card shadow-sm"><div class="p-6 border-b"><h3 class="text-lg font-semibold flex items-center gap-2">`);
            Link($$renderer3, { class: "w-5 h-5 text-primary" });
            $$renderer3.push(`<!----> Enlaces Importantes</h3></div> <div class="p-6 space-y-4"><!--[-->`);
            const each_array_3 = ensure_array_like(detailLinks);
            for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
              let link = each_array_3[i];
              $$renderer3.push(`<div class="flex justify-between items-center p-3 rounded-lg border bg-muted/30"><div><div class="font-medium text-sm">${escape_html(link.title)}</div> <a${attr("href", link.url)} target="_blank" rel="noopener noreferrer" class="text-xs text-primary truncate block">${escape_html(link.url)}</a></div> <button type="button" class="text-muted-foreground hover:text-destructive p-1">`);
              Trash_2($$renderer3, { class: "w-4 h-4" });
              $$renderer3.push(`<!----></button></div>`);
            }
            $$renderer3.push(`<!--]--> `);
            {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push(`<button type="button" class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80">`);
              Plus($$renderer3, { class: "w-4 h-4" });
              $$renderer3.push(`<!----> Agregar Enlace</button>`);
            }
            $$renderer3.push(`<!--]--></div></div> <div class="rounded-xl border bg-card shadow-sm"><div class="p-6 border-b"><h3 class="text-lg font-semibold flex items-center gap-2">`);
            File_text($$renderer3, { class: "w-5 h-5 text-primary" });
            $$renderer3.push(`<!----> Documentos e IDs</h3></div> <div class="p-6 space-y-4"><!--[-->`);
            const each_array_4 = ensure_array_like(detailDocuments);
            for (let i = 0, $$length = each_array_4.length; i < $$length; i++) {
              let doc = each_array_4[i];
              $$renderer3.push(`<div class="flex justify-between items-center p-3 rounded-lg border bg-muted/30"><div class="flex gap-2 items-center"><span class="text-xs font-medium px-2 py-0.5 bg-muted rounded">${escape_html(doc.type)}</span> <span class="text-sm font-mono">${escape_html(doc.value)}</span></div> <button type="button" class="text-muted-foreground hover:text-destructive p-1">`);
              Trash_2($$renderer3, { class: "w-4 h-4" });
              $$renderer3.push(`<!----></button></div>`);
            }
            $$renderer3.push(`<!--]--> `);
            {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push(`<button type="button" class="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80">`);
              Plus($$renderer3, { class: "w-4 h-4" });
              $$renderer3.push(`<!----> Agregar Documento</button>`);
            }
            $$renderer3.push(`<!--]--></div></div></div></div>`);
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]--></div>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--></div> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
