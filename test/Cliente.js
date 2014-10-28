
var jt = require('../lib/jt.js');

module.exports = jt.Structure('Cliente',{
    secondaDescrizione: jt.string.optional(),
    partitaIva: jt.string.optional().size(16).label('Partita IVA'),
    codiceFiscale: jt.string.optional().minlength(16),
    fornitore: jt.boolean.default(false),
    cliente: jt.boolean.default(true),
    indirizzo: jt.string.optional().maxlength(4),
    cap: jt.string.optional(),
    comune: jt.string.optional(),
    provincia: jt.string.optional(),
    description:  jt.string.maxlength(4),
    type: jt.string.default('cliente')
});

