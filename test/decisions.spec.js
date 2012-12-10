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
    })
})