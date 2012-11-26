describe('basic arithmatic operations', function () {
    var mathy = require('../src/index.js');

    describe('addition', function () {
        it('should add two numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '1 + 2' });

            var result = engine.process();

            expect(result[0]).toEqual(3);
        });

        it('should add three numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '1 + 2 + 3' });

            var result = engine.process();

            expect(result[0]).toEqual(6);
        });

        it('should add heaps numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '1 + 2 + 3 + 4 + 5 + 6 + 7' });

            var result = engine.process();

            expect(result[0]).toEqual(28);
        });
    });

    describe('subtraction', function () {
        it('should subtract two numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '2 - 1' });

            var result = engine.process();

            expect(result[0]).toEqual(1);
        });

        it('should subtract three numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '3 - 2 - 1' });

            var result = engine.process();

            expect(result[0]).toEqual(0);
        });

        it('should subtract heaps numbers', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '3 - 2 - 1 - 4 - 6 - 8 - 10' });

            var result = engine.process();

            expect(result[0]).toEqual(-28);
        });
    });
});