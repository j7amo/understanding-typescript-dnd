function add(n1: number, n2: number, printResult: boolean, phrase: string): number {
    if (printResult) {
        console.log(`${phrase}${n1 + n2}`);
    } else {
        return n1 + n2;
    }
}

const number1 = 5;
const number2 = 2.8;
const showResult = true;
const resultPhrase = 'Result is: ';

add(number1, number2, showResult, resultPhrase);
