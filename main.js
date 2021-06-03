/**
 * 処理を実行する.
 */
function execute() {
    var inputText = getHtmlInputElementById("inputTextarea").value;
    var inputRows = inputText.split("\n");
    var alphabets = new Alphabets();
    var shiftingDate = new ShiftingDate();
    var outputRows = new Array(inputRows.length);
    for (var i = 0; i < inputRows.length; i++) {
        var splitedRows = split(inputRows[i]);
        var englishName = splitedRows[0].trim();
        var typeName = splitedRows[1].trim();
        // dbkeyは自動採番のため不要
        if (englishName.toLowerCase() == "dbkey") {
            outputRows[i] = "";
            continue;
        }
        if (typeName == "datetime") {
            outputRows[i] = shiftingDate.getOne();
            continue;
        }
        // 日付には長さが定義されていないため数値変換できない
        // そのためここで初めて長さと精度を数値化する
        var length_1 = Number(splitedRows[2].trim());
        var precision = isNullToZero(splitedRows[3].trim());
        //データ定義が数値型の場合は1〜9の数字を指定の長さになるまで繰り返してデータとする
        if (["int", "numeric", "bigint"].includes(typeName.toLowerCase())) {
            var nums = "123456789";
            var q = length_1 / nums.length;
            var r = length_1 % nums.length;
            var numberData = nums.repeat(q) + nums.substring(0, r);
            if (precision != 0) {
                numberData = numberData.substring(0, length_1 - precision);
                numberData = numberData + "." + nums.substring(0, precision);
            }
            outputRows[i] = numberData;
            continue;
        }
        //データ定義が文字列の場合
        if (["char", "varchar"].includes(typeName.toLowerCase())) {
            if (length_1 == 1) {
                outputRows[i] = alphabets.getOne();
            }
            else if (length_1 <= englishName.length) {
                outputRows[i] = englishName.substring(0, length_1);
            }
            else {
                outputRows[i] = addHyphen(englishName, length_1);
            }
        }
    }
    var outputTextarea = document.getElementById("outputTextarea");
    outputTextarea.value = outputRows.join("\t");
}
/**
 * 指定したIDを持つエレメントを返す.
 * @param id エレメントID
 */
function getHtmlInputElementById(id) {
    return document.getElementById(id);
}
/**
 * 行データを特定の文字で分割する.
 * @param inputRow 行データ
 * @returns 分割済みデータ
 */
function split(inputRow) {
    if (inputRow.split("\t").length >= 2) {
        return inputRow.split("\t");
    }
    else {
        return inputRow.split(" ");
    }
}
/**
 * 精度を数値化する. 精度が未入力なら0を返す.
 * @param precision 精度
 * @returns 精度を数値化したもの
 */
function isNullToZero(precision) {
    if (precision == "") {
        return 0;
    }
    return Number(precision);
}
function addHyphen(englishName, columnLength) {
    var output = englishName;
    for (var i = englishName.length + 1; i <= columnLength; i++) {
        if (i % 10 == 0) {
            // 先頭1桁にしないと桁数があふれる
            output = output + i.toString().substring(0, 1);
        }
        else if (i == columnLength) {
            output = output + columnLength % 10;
        }
        else {
            output = output + "-";
        }
    }
    return output;
}
var Alphabets = /** @class */ (function () {
    /**
     * コンストラクタ
     * アルファベットの初期化
     * カウンタの初期化
     */
    function Alphabets() {
        this.alphabets = this.getAlphabets();
        this.count = 0;
    }
    /**
     * アルファベット26文字をA, B, ..., Zの順で取得する.
     * @returns アルファベット
     */
    Alphabets.prototype.getAlphabets = function () {
        var c = 'a'.charCodeAt(0);
        var alphabets = Array.apply(null, new Array(26)).map(function (v, i) {
            return String.fromCharCode(c + i);
        });
        return alphabets;
    };
    /**
     * カウンタのインデックスに対応するアルファベット1文字を取得する
     * @returns
     */
    Alphabets.prototype.getOne = function () {
        var ret = this.alphabets[this.count];
        this.upCount();
        return ret;
    };
    /**
 * カウントアップ.
     */
    Alphabets.prototype.upCount = function () {
        this.count++;
        if (this.count >= 26) {
            this.count = 0;
        }
    };
    return Alphabets;
}());
var ShiftingDate = /** @class */ (function () {
    /**
     * コンストラクタ
     */
    function ShiftingDate() {
        this.date = new Date();
        this.count = 0;
    }
    /**
     * カウンタのインデックス分日付を前にずらした日付を取得する
     * @returns
     */
    ShiftingDate.prototype.getOne = function () {
        this.date.setDate(this.date.getDate() - this.count);
        this.upCount();
        return this.toString(this.date);
    };
    /**
     * 日付を文字列に変換する.
     * @param dt 日付
     * @returns 日付の文字列
     */
    ShiftingDate.prototype.toString = function (dt) {
        var y = dt.getFullYear();
        var m = ("00" + (dt.getMonth() + 1)).slice(-2);
        var d = ("00" + dt.getDate()).slice(-2);
        var result = y + "-" + m + "-" + d;
        return result;
    };
    /**
 * カウントアップ.
     */
    ShiftingDate.prototype.upCount = function () {
        this.count++;
    };
    return ShiftingDate;
}());
