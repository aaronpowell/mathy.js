Mathy.js
---

Mathy.js is a simple arithmetic calculation engine for node.js and the browser.

It allows you to easily produce parameterized formulas and then get out the results based on what is passed in. It can also be used to execute a string as a formula.

Usage
---

    var mathy = require('mathy');
    
    var engine = new mathy.Engine({
        name: 'a',
        derivation: '1 + 2'
    });
    
    var result = engine.process();
    
    expect(result[0]).toEqual(3);
    
License
---

MIT

Author
---

Aaron Powell