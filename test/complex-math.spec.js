describe('complex arithmatic operations', function () {
    var mathy = require('../index.js');

    it('should handle complex order of operations', function () {
        var engine = new mathy.Engine({ name: 'a', derivation: '1 + 2 * 3 - 16 / 8' });

        var result = engine.process();

        expect(result[0]).toEqual(5);
    });

    it('should handle complex order of operations with powers', function () {
        var engine = new mathy.Engine({ name: 'a', derivation: '1 + 2 * 3 - 1 * 10 ^ 1 / 5' });

        var result = engine.process();

        expect(result[0]).toEqual(5);
    });
});