const { exec } = require('child_process');
const { readFileSync } = require('fs');

const TEST_COMMAND = 'npm run exec';
const error = (msg) => console.error('Failed executing tests - ' + msg);

const path = process.argv[2];

if (!path) {
    error('You need pass a score map file');
    process.exit(1);
}

let scoreMap;
try {
    scoreMap = JSON.parse(readFileSync(path));
} catch (e) {
    error('Cannot load score map file');
    process.exit(1);
}

const execCallback = (_, stdout) => {
    let testResults;
    try {
        stdout = stdout.toString().replace(/\\n /gi, '').replace(/\\u001b/gi, '').replace(/\\\\/gi, '/')
        testResults = JSON.parse(stdout).testResults;
    } catch (e) {
        error('Cannot execute Jest tests');
        process.exit(1);
    }

    const filterInTestMap = ({name}) => scoreMap.tests
        .filter(({ path }) => name.indexOf(path) >= 0);
    const submissionTests = testResults
        .reduce((result, test) => {
            const scores = filterInTestMap(test)[0];
            if (!scores) return result;

            return result.concat({
                ...test,
                scores
            });
        }, []);

    const reduceAssertionResults = (results, { scores, totalScore }) => results
        .reduce((score, { status }, index) => {
            if (status !== 'passed') return score;
            
            return score += scores[index] * totalScore / 100;
        }, 0);
    const reduceTest = (scoreSum, { assertionResults, scores }) => 
        scoreSum += reduceAssertionResults(assertionResults, scores)
    const score = submissionTests
        .reduce(reduceTest, 0);

    console.log(JSON.stringify({ score }))    
}

module.exports = () => exec(TEST_COMMAND, execCallback);


