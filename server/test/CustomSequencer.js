const TestSequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends TestSequencer {
    sort(tests) {
        // console.log(tests);
        return tests.sort((testA, testB) => {
            const indexA = testA.path.split('_')[0];
            const indexB = testB.path.split('_')[0];

            if (indexA === indexB) return 0;

            return indexA < indexB ? -1 : 1;
        });
    }
}

module.exports = CustomSequencer;
