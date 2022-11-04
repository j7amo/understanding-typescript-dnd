function add(n1, n2, printResult, phrase) {
    if (printResult) {
        console.log("".concat(phrase).concat(n1 + n2));
    }
    else {
        return n1 + n2;
    }
}
var number1 = 5;
var number2 = 2.8;
var showResult = true;
var resultPhrase = 'Result is: ';
add(number1, number2, showResult, resultPhrase);
