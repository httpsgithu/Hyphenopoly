/* eslint-env node */
/* eslint global-require: 0, func-names: 0, no-shadow: 0 */
/* eslint-disable prefer-arrow-callback */

import t from "tap";

/**
 * Imports and returns the defaults of the hyphenopoly module.
 * Circumvents module caching by appending a query to the URL
 * LEAKS MEMORY!
 */
async function freshImport() {
    const {"default": H9Y} = await import(`../hyphenopoly.module.js?update=${Date.now()}`);
    return H9Y;
}

t.test("set options: compound", function (t) {
    t.test("compound: all", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "compound": "all",
            "hyphen": "•",
            "require": ["de"]
        });
        t.equal(hyphenator("Silbentrennungs-Algorithmus"), "Sil•ben•tren•nungs-\u200BAl•go•rith•mus");
        t.end();
    });
    t.test("compound: auto", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "compound": "auto",
            "hyphen": "•",
            "require": ["de"]
        });
        t.equal(hyphenator("Silbentrennungs-Algorithmus"), "Sil•ben•tren•nungs-Al•go•rith•mus");
        t.end();
    });
    t.test("compound: hyphen", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "compound": "hyphen",
            "hyphen": "•",
            "require": ["de"]
        });
        t.equal(hyphenator("Silbentrennungs-Algorithmus"), "Silbentrennungs-\u200BAlgorithmus");
        t.end();
    });
    t.test("compound: auto, one part too small", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "compound": "auto",
            "hyphen": "•",
            "require": ["de"]
        });
        t.equal(hyphenator("Test-Algorithmus"), "Test-Al•go•rith•mus");
        t.end();
    });
    t.test("compound: all, one part too small", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "compound": "all",
            "hyphen": "•",
            "require": ["de"]
        });
        t.equal(hyphenator("Test-Algorithmus"), "Test-\u200BAl•go•rith•mus");
        t.end();
    });
    t.end();
});

t.test("set options: exceptions", function (t) {
    t.test("exceptions: global (only)", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "exceptions": {"global": "Silben-trennung"},
            "hyphen": "•",
            "require": ["de"]
        });
        t.equal(hyphenator("Silbentrennung"), "Silben•trennung");
        t.end();
    });
    t.test("exceptions: global and lang", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "exceptions": {
                "de": "Algo-rithmus",
                "global": "Silben-trennung"
            },
            "hyphen": "•",
            "require": ["de"]
        });
        t.equal(hyphenator("Silbentrennung Algorithmus"), "Silben•trennung Algo•rithmus");
        t.end();
    });
    t.test("exceptions: double entry", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "exceptions": {"de": "Algo-rithmus, Algo-rithmus"},
            "hyphen": "•",
            "require": ["de"]
        });
        t.equal(hyphenator("Algorithmus"), "Algo•rithmus");
        t.end();
    });
    t.test("exceptions: double entry", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "hyphen": "•",
            "require": ["en-us"]
        });
        t.equal(hyphenator("reformation"), "ref•or•ma•tion");
        t.end();
    });
    t.end();
});

t.test("set options: hyphen", function (t) {
    t.test("hyphen: •", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "hyphen": "•",
            "require": ["de"]
        });
        t.equal(hyphenator("Silbentrennung"), "Sil•ben•tren•nung");
        t.end();
    });
    t.test("hyphen: |", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "hyphen": "|",
            "require": ["de"]
        });
        t.equal(hyphenator("Silbentrennung"), "Sil|ben|tren|nung");
        t.end();
    });
    t.end();
});

t.test("set options: left-/rightmin (patterns: 2/2)", function (t) {
    t.test("left-/rightmin: 4, 5", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "hyphen": "•",
            "leftmin": 4,
            "require": ["de"],
            "rightmin": 5
        });
        t.equal(hyphenator("Silbentrennung"), "Silben•trennung");
        t.end();
    });

    t.test("left-/rightminPerLang: 4, 5", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "hyphen": "•",
            "leftminPerLang": {
                "de": 4
            },
            "require": ["de"],
            "rightminPerLang": {
                "de": 5
            }
        });
        t.equal(hyphenator("Silbentrennung"), "Silben•trennung");
        t.end();
    });
    t.end();
});

t.test("set options: left-/rightmin (patterns: 2/3)", function (t) {
    t.test("left-/rightmin: 2, 2", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "hyphen": "•",
            "leftmin": 2,
            "require": ["pt"],
            "rightmin": 2
        });
        t.equal(hyphenator("relativo"), "re•la•tivo");
        t.end();
    });

    t.test("left-/rightmin: def, def", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "hyphen": "•",
            "require": ["pt"]
        });
        t.equal(hyphenator("relativo"), "re•la•tivo");
        t.end();
    });
    t.end();
});

t.test("set options: minWordLength", function (t) {
    t.test("minWordLength: 7", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "hyphen": "•",
            "minWordLength": 7,
            "require": ["de"]
        });
        t.equal(hyphenator("Die Asse essen lieber gesunde Esswaren"), "Die Asse essen lieber ge•sun•de Ess•wa•ren");
        t.end();
    });
    t.end();
});

t.test("set options: mixedCase", function (t) {
    t.test("mixedCase: false", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "hyphen": "•",
            "mixedCase": false,
            "require": ["de"]
        });
        t.equal(hyphenator("silbentrennen Silbentrennung camelCase"), "sil•ben•tren•nen Silbentrennung camelCase");
        t.end();
    });
    t.end();
});

t.test("set options: normalize", function (t) {
    t.test("normalize: true", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "hyphen": "•",
            "normalize": true,
            "require": ["de"]
        });
        t.equal(hyphenator("Ba\u0308rento\u0308ter"), "Bä•ren•tö•ter");
        t.end();
    });
    t.end();
});

t.test("set options: orphanControl", function (t) {
    t.test("orphanControl: 1 (default)", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "hyphen": "•",
            "require": ["de"]
        });
        t.equal(hyphenator("Die Asse essen lieber gesunde Esswaren"), "Die Asse essen lie•ber ge•sun•de Ess•wa•ren");
        t.end();
    });
    t.test("orphanControl: 2", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "hyphen": "•",
            "orphanControl": 2,
            "require": ["de"]
        });
        t.equal(hyphenator("Die Asse essen lieber gesunde Esswaren"), "Die Asse essen lie•ber ge•sun•de Esswaren");
        t.end();
    });
    t.test("orphanControl: 2, hyphen: |", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "hyphen": "|",
            "orphanControl": 2,
            "require": ["de"]
        });
        t.equal(hyphenator("Die Asse essen lieber gesunde Esswaren"), "Die Asse essen lie|ber ge|sun|de Esswaren");
        t.end();
    });
    t.test("orphanControl: 3", async function (t) {
        const H9Y = await freshImport();
        const hyphenator = await H9Y.config({
            "hyphen": "•",
            "orphanControl": 3,
            "require": ["de"]
        });
        t.equal(hyphenator("Die Asse essen lieber gesunde Esswaren"), "Die Asse essen lie•ber ge•sun•de\u00A0Esswaren");
        t.end();
    });
    t.end();
});
