var expect = require('chai').expect;

describe('rule list handling', function () {
    var mathy = require('../index.js');

    it('should all you to add new rules to an existing engine', function () {
        var engine = new mathy.Engine();

        engine.add({ name: 'a', derivation: '1' });

        var result = engine.process();

        expect(result[0]).to.equal(1);
    });
});