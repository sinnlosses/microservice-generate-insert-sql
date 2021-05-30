/**
 * 処理を実行する.
 */
function execute() {
    var inputText = getHtmlInputElementById("inputTextarea").value.trim();
    var inputRows = inputText.split("\n");
    var tableName = getHtmlInputElementById("tableName").value;
    var keyColumn = getHtmlInputElementById("keyColumn").value;
    var outputRows = new Array(inputRows.length);
    for (var i = 0; i < inputRows.length; i++) {
        var splitedRows = identifySplitCharacter(inputRows[i]);
        var englishName = splitedRows[0].trim();
        var typeName = splitedRows[1].trim();
        var length_1 = Number(splitedRows[2].trim());
        var keyColumnValue = splitedRows[3].trim();
        //データ定義が数値型、日付型の場合は処理しない
        if (["int", "numeric", "datetime"].includes(typeName)) {
            continue;
        }
        //長さの定義がない場合と1の場合は飛ばす
        else if ([" ", "", "1"].includes(length_1.toString())) {
            continue;
        }
        //長さの定義が8以上の場合、改行の制御コードを入れたデータをSETするUPDATE文を作成する
        else if (length_1 >= 8) {
            outputRows[i] = "UPDATE " + tableName + "\nSET " + englishName + " = 'sei' + CHAR(13) + CHAR(10) + 'gyo' " + "\nWHERE " + keyColumn + " = " + keyColumnValue;
            continue;
        }
        //長さの定義が8より小さい場合、タブの制御コードを入れたデータをSETするUPDATE文を作成する
        else if (length_1 > 2 && length_1 < 8) {
            outputRows[i] = "UPDATE " + tableName + "\nSET " + englishName + " = 's' + CHAR(9) + 'g' " + "\nWHERE " + keyColumn + " = " + keyColumnValue;
            continue;
        }
        else if (length_1 == 2) {
            outputRows[i] = "UPDATE " + tableName + "\nSET " + englishName + " = CHAR(9) + 's' " + "\nWHERE " + keyColumn + " = " + keyColumnValue;
        }
    }
    outputRows = outputRows.filter(function (value) {
        return value != "";
    });
    var outputTextarea = document.getElementById("outputTextarea");
    outputTextarea.value = outputRows.join("\n\n");
}
/**
 * 指定したIDを持つエレメントを返す.
 * @param id エレメントID
 */
function getHtmlInputElementById(id) {
    return document.getElementById(id);
}
function identifySplitCharacter(inputRow) {
    if (inputRow.split("\t").length >= 2) {
        return inputRow.split("\t");
    }
    else {
        return inputRow.split(" ");
    }
}
