/**
 * 処理を実行する.
 */
 function execute():void{
    const inputText:string = getHtmlInputElementById("inputTextarea").value;
    const inputRows:string[] = inputText.split("\n");
    const alphabets = new Alphabets();
    const shiftingDate = new ShiftingDate();
    let outputRows:string[] = new Array(inputRows.length);

    for (let i = 0; i < inputRows.length; i++){
        const splitedRows:string[] = split(inputRows[i]);
        const englishName:string = splitedRows[0].trim();
        const typeName:string = splitedRows[1].trim();

        // dbkeyは自動採番のため不要
        if(englishName.toLowerCase() == "dbkey"){
            outputRows[i] = "";
            continue
        }
        if(typeName == "datetime"){
            outputRows[i] = shiftingDate.getOne();
            continue
        }

        // 日付には長さが定義されていないため数値変換できない
        // そのためここで初めて長さと精度を数値化する
        const length:number = Number(splitedRows[2].trim());
        const precision:number = isNullToZero(splitedRows[3].trim());

        //データ定義が数値型の場合は1〜9の数字を指定の長さになるまで繰り返してデータとする
        if(["int" , "numeric", "bigint"].includes(typeName.toLowerCase())){
            const nums: string = "123456789";
            const q = length/nums.length;
            const r = length%nums.length;
            let numberData:string = nums.repeat(q) + nums.substring(0, r);
            if (precision != 0){
                numberData = numberData + "." + nums.substring(0, precision)
            }
            outputRows[i] = numberData;
            continue
        }
        //データ定義が文字列の場合
        if(["char" , "varchar"].includes(typeName.toLowerCase())){
            if(length == 1){
                outputRows[i] = alphabets.getOne();
            }
            else if(length <= englishName.length){
                outputRows[i] = englishName.substring(0, length);
            }
            else{
                outputRows[i] = addHyphen(englishName, length);
            }
        }
    }

    let outputTextarea:HTMLInputElement = <HTMLInputElement>document.getElementById("outputTextarea");
    outputTextarea.value = outputRows.join("\t");
}

/**
 * 指定したIDを持つエレメントを返す.
 * @param id エレメントID
 */
function getHtmlInputElementById(id:string):HTMLInputElement{
    return <HTMLInputElement>document.getElementById(id);
}

/**
 * 行データを特定の文字で分割する.
 * @param inputRow 行データ
 * @returns 分割済みデータ
 */
function split(inputRow:string):string[]{
    if (inputRow.split("\t").length >= 2){
        return inputRow.split("\t");
    } else {
        return inputRow.split(" ");
    }
}

/**
 * 精度を数値化する. 精度が未入力なら0を返す.
 * @param precision 精度
 * @returns 精度を数値化したもの
 */
function isNullToZero(precision:string):number{
    if (precision == ""){
        return 0;
    }
    return Number(precision);
}

function addHyphen(englishName: string, columnLength: number):string{
    let output:string = englishName;
    for(let i:number=englishName.length+1; i <= columnLength; i++){
        if (i % 10 == 0){
            output = output + i/10;
        } else if (i == columnLength){
            output = output + columnLength%10;
        } else {
            output = output + "-";
        }
    }
    return output;
}

class Alphabets {
    alphabets: string[];
    count: number;

    /**
     * コンストラクタ
     * アルファベットの初期化
     * カウンタの初期化
     */
    constructor() {
        this.alphabets = this.getAlphabets();
        this.count = 0;
    }

    /**
     * アルファベット26文字をA, B, ..., Zの順で取得する.
     * @returns アルファベット
     */
    getAlphabets():string[]{
        const c = 'a'.charCodeAt(0);
        const alphabets = Array.apply(null, new Array(26)).map((v: any, i: number) => {
        return String.fromCharCode(c + i);
        });
        return alphabets;
    }

    /**
     * カウンタのインデックスに対応するアルファベット1文字を取得する
     * @returns 
     */
    getOne(): string{
        const ret:string = this.alphabets[this.count];
        this.upCount();
        return ret;
    }

    /**
 * カウントアップ.
     */
    upCount():void{
        this.count++;
        if (this.count >= 26){
            this.count = 0;
        }
    }
}

class ShiftingDate {
    date: Date;
    count: number;

    /**
     * コンストラクタ
     */
    constructor() {
        this.date = new Date();
        this.count = 0;
    }

    /**
     * カウンタのインデックス分日付を前にずらした日付を取得する
     * @returns 
     */
    getOne(): string{
        this.date.setDate(this.date.getDate() - this.count);
        this.upCount();
        return this.toString(this.date);
    }

    /**
     * 日付を文字列に変換する.
     * @param dt 日付
     * @returns 日付の文字列
     */
    toString(dt:Date){
        var y = dt.getFullYear();
        var m = ("00" + (dt.getMonth()+1)).slice(-2);
        var d = ("00" + dt.getDate()).slice(-2);
        var result = y + "-" + m + "-" + d;
        return result;
    }

    /**
 * カウントアップ.
     */
    upCount():void{
        this.count++;
    }
}