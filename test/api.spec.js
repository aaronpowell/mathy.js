var expect = require('chai').expect;

describe('rule list handling', function () {
    var mathy = require('../index.js');

    it('should all you to add new rules to an existing engine', function () {
        var engine = new mathy.Engine();

        engine.add({ name: 'a', derivation: '1' });

        var result = engine.process();

        expect(result[0]).to.equal(1);
    });

    it('should allow you to add new parameters to an existing rule', function () {
        var engine = new mathy.Engine(
            { name: 'a', derivation: 'b * c / d ', result: true },
            { name: 'b', derivation: 'e + f' },
            { name: 'c', derivation: '30' }
        );

        engine.add({ name: 'd', derivation: '2' });
        engine.add({ name: 'e', derivation: '10' });
        engine.add({ name: 'f', derivation: 'e * 2' });

        var result = engine.process();

        expect(result[0]).to.equal(450);
    });

    it('should allow you to add multiple parameters at the one time', function () {
        var engine = new mathy.Engine(
            { name: 'a', derivation: 'b * c / d ', result: true },
            { name: 'b', derivation: 'e + f' },
            { name: 'c', derivation: '30' }
        );

        engine.add(
            { name: 'd', derivation: '2' },
            { name: 'e', derivation: '10' },
            { name: 'f', derivation: 'e * 2' }
        );

        var result = engine.process();

        expect(result[0]).to.equal(450);
        });
});