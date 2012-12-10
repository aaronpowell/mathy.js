var expect = require('chai').expect;

describe('parameter decisions', function () {
    var mathy = require('../index.js');

    describe('single depth decision', function () {
        it('should be able to evaulate the first argument to true', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: 'true ? 1 : -1' });

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });

        it('should be able to evaulate the first argument to false', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: 'false ? 1 : -1' });

            var result = engine.process();

            expect(result[0]).to.equal(-1);
        });

        it('should allow a dynamic decision to false', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: 'foo === bar ? 1 : -1' });

            var result = engine.process();

            expect(result[0]).to.equal(-1);
        });

        it('should allow a dynamic decision to true', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: 'foo === foo ? 1 : -1' });

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });

        it('should allow a less-than decision to true', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '2 < 3 ? 1 : -1' });

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });

        it('should allow a greater-than decision to true', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '3 > 2 ? 1 : -1' });

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });

        it('should allow a not equal decision to true', function () {
            var engine = new mathy.Engine({ name: 'a', derivation: '3 !== 2 ? 1 : -1' });

            var result = engine.process();

            expect(result[0]).to.equal(1);
        });

        it('should allow an additional parameter to be a decision', function () {
            var engine = new mathy.Engine(
                { name: 'a', derivation: 'b + 1', result: true },
                { name: 'b', derivation: 'true ? 1 : 0' }
            );
debugger;
            var result = engine.process();

            expect(result[0]).to.equal(2);
        });
    });
});