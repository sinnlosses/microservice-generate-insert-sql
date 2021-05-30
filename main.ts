/**
 * 処理を実行する.
 */
 function execute():void{
    const inputText:string = getHtmlInputElementById("inputTextarea").value.trim();
    const inputRows:string[] = inputText.split("\n");
    const tableName:string = getHtmlInputElementById("tableName").value;
    const now:string = new Date().toDateString();
    let outputRows:string[] = new Array(inputRows.length);

    for (let i = 0; i < inputRows.length; i++){
        const splitedRows:string[] = identifySplitCharacter(inputRows[i]);
        const englishName:string = splitedRows[0].trim();
        const typeName:string = splitedRows[1].trim();
        const length:number = Number(splitedRows[2].trim());
        const keyColumnValue:String = splitedRows[3].trim();

        //データ項目がDBKEYの場合
        if(englishName == "DBKEY"){
            continue
        }
        //データ定義が数値型の場合は1〜9の数字をしての長さになるまで繰り返してデータとする
        //小数点ありのデータまた今度
        else if(["int" , "numeric"].includes(typeName)){
            let numberData:string = "";
            for(let j = 1; j = length; j++){
                numberData = numberData + j.toString()
            }
            outputRows[i] = numberData;
            continue
        }
        //データ定義が日付型の場合は現在時刻をデータとする
        else if(typeName == "datetime"){
            outputRows[i] = now;
            continue
        }
        //データ定義が文字列の場合
        //長さの定義が1の場合
        //長さの定義が2以上かつ10より短い場合
        
        else if(length >= 8){
            continue
        }
        //長さの定義が8より小さい場合、タブの制御コードを入れたデータをSETするUPDATE文を作成する
        else if (length > 2 && length < 8){
            continue
        }
        else if(length == 2){
        }
    }
    
    outputRows = outputRows.filter(function(value){
        return value != "";
    });

    let outputTextarea:HTMLInputElement = <HTMLInputElement>document.getElementById("outputTextarea");
    outputTextarea.value = outputRows.join("\n\n");
}

/**
 * 指定したIDを持つエレメントを返す.
 * @param id エレメントID
 */
function getHtmlInputElementById(id:string):HTMLInputElement{
    return <HTMLInputElement>document.getElementById(id);
}

function identifySplitCharacter(inputRow:string):string[]{
    if (inputRow.split("\t").length >= 2){
        return inputRow.split("\t");
    } else {
        return inputRow.split(" ");
    }
}