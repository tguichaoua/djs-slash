import { describe } from 'mocha';
import { expect } from 'chai';
import { ChoicesUtils } from './ChoicesUtils';

describe('Choice Utils', () => {
    it('nameValueRecord (string)', () => {
        const res = ChoicesUtils.nameValueRecord({
            foo: 'Foo',
            goo: 'Goo',
            bar: 'Bar',
        });

        expect(res).to.be.deep.equals([
            { name: 'foo', value: 'Foo' },
            { name: 'goo', value: 'Goo' },
            { name: 'bar', value: 'Bar' },
        ]);
    });
    it('nameValueRecord (number)', () => {
        const res = ChoicesUtils.nameValueRecord({
            foo: 3,
            goo: 9,
            bar: 42,
        });

        expect(res).to.be.deep.equals([
            { name: 'foo', value: 3 },
            { name: 'goo', value: 9 },
            { name: 'bar', value: 42 },
        ]);
    });

    it('valueNameRecord (string)', () => {
        const res = ChoicesUtils.valueNameRecord({
            foo: 'Foo',
            goo: 'Goo',
            bar: 'Bar',
        });

        expect(res).to.be.deep.equals([
            { name: 'Foo', value: 'foo' },
            { name: 'Goo', value: 'goo' },
            { name: 'Bar', value: 'bar' },
        ]);
    });
});
