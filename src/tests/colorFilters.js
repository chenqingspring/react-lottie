import { expect } from 'chai';
import pinjump from '../stories/pinjump.json';
import {
  applyColorFilters,
  colorFiltersAreEqual,
  parseColor,
} from '../colorFilters';

const { describe, it } = global;

const getFill = (data, layerName, groupName, itemName) => data.layers
  .find(layer => layer.nm === layerName)
  .shapes.find(shape => shape.nm === groupName)
  .it.find(item => item.nm === itemName)
  .c.k;

describe('colorFilters', () => {
  describe('parseColor', () => {
    it('parses hex, rgb, hsl and named colors', () => {
      expect(parseColor('#ff0000')).to.deep.equal([1, 0, 0]);
      expect(parseColor('#0f0')).to.deep.equal([0, 1, 0]);
      expect(parseColor('rgb(0, 0, 255)')).to.deep.equal([0, 0, 1]);
      expect(parseColor('rgba(255, 255, 255, 0.5)')).to.deep.equal([1, 1, 1]);
      expect(parseColor('hsl(120, 100%, 50%)')).to.deep.equal([0, 1, 0]);
      expect(parseColor('red')).to.deep.equal([1, 0, 0]);
    });

    it('ignores values it cannot parse', () => {
      expect(parseColor('var(--brand-color)')).to.equal(null);
      expect(parseColor('not-a-color')).to.equal(null);
      expect(parseColor(undefined)).to.equal(null);
    });
  });

  describe('applyColorFilters', () => {
    it('recolors a static fill without mutating the input', () => {
      const original = getFill(pinjump, 'Pin 1', 'Shape 2', 'Fill 1');

      const result = applyColorFilters(pinjump, [{
        keypath: 'Pin 1.Shape 2.Fill 1',
        color: '#00ff00',
      }]);

      expect(getFill(result, 'Pin 1', 'Shape 2', 'Fill 1')).to.deep.equal([0, 1, 0, 1]);
      expect(getFill(pinjump, 'Pin 1', 'Shape 2', 'Fill 1')).to.deep.equal(original);
      expect(result).to.not.equal(pinjump);
    });

    it('recolors every keyframe of an animated fill', () => {
      const original = getFill(pinjump, 'C1', 'Ellipse 1', 'Fill 1');

      const result = applyColorFilters(pinjump, [{
        keypath: 'C1.Ellipse 1.Fill 1',
        color: 'rgb(0, 0, 255)',
      }]);
      const keyframes = getFill(result, 'C1', 'Ellipse 1', 'Fill 1');

      keyframes.forEach((keyframe) => {
        if (keyframe.s) expect(keyframe.s.slice(0, 3)).to.deep.equal([0, 0, 1]);
        if (keyframe.e) expect(keyframe.e.slice(0, 3)).to.deep.equal([0, 0, 1]);
      });
      expect(getFill(pinjump, 'C1', 'Ellipse 1', 'Fill 1')).to.deep.equal(original);
    });

    it('supports wildcards in the keypath', () => {
      const result = applyColorFilters(pinjump, [{
        keypath: '*.Shape 2.Fill 1',
        color: '#0000ff',
      }]);

      expect(getFill(result, 'Pin 1', 'Shape 2', 'Fill 1')).to.deep.equal([0, 0, 1, 1]);
      expect(getFill(result, 'Pin 2', 'Shape 2', 'Fill 1')).to.deep.equal([0, 0, 1, 1]);
    });

    it('matches any depth with **', () => {
      const result = applyColorFilters(pinjump, [{
        keypath: '**.Fill 1',
        color: '#0000ff',
      }]);

      expect(getFill(result, 'Pin 1', 'Shape 2', 'Fill 1')).to.deep.equal([0, 0, 1, 1]);
      expect(getFill(result, 'Pin 2', 'Shape 2', 'Fill 1')).to.deep.equal([0, 0, 1, 1]);
    });

    it('matches keypaths inside a precomposition', () => {
      const data = {
        layers: [{ ty: 0, nm: 'Icon', refId: 'comp_0' }],
        assets: [{
          id: 'comp_0',
          layers: [{
            ty: 4,
            nm: 'Inner',
            shapes: [{
              ty: 'gr',
              nm: 'Shape 1',
              it: [{ ty: 'fl', nm: 'Fill 1', c: { a: 0, k: [1, 1, 1, 1] } }],
            }],
          }],
        }],
      };

      const prefixed = applyColorFilters(data, [{
        keypath: 'Icon.Inner.Shape 1.Fill 1',
        color: '#0000ff',
      }]);
      const unprefixed = applyColorFilters(data, [{
        keypath: 'Inner.Shape 1.Fill 1',
        color: '#0000ff',
      }]);

      const fillColor = result => result.assets[0].layers[0].shapes[0].it[0].c.k;
      expect(fillColor(prefixed)).to.deep.equal([0, 0, 1, 1]);
      expect(fillColor(unprefixed)).to.deep.equal([0, 0, 1, 1]);
    });

    it('recolors a solid layer stored as a hex string', () => {
      const data = { layers: [{ ty: 1, nm: 'Background', sc: '#ffffff' }] };

      const result = applyColorFilters(data, [{
        keypath: 'Background',
        color: 'red',
      }]);

      expect(result.layers[0].sc).to.equal('#ff0000');
      expect(data.layers[0].sc).to.equal('#ffffff');
    });

    it('returns the original data when nothing matches', () => {
      expect(applyColorFilters(pinjump, [{
        keypath: 'Missing.Fill 1',
        color: '#000000',
      }])).to.equal(pinjump);
    });

    it('ignores invalid filters', () => {
      expect(applyColorFilters(pinjump, [{
        keypath: 'Pin 1.Shape 2.Fill 1',
        color: 'var(--brand)',
      }])).to.equal(pinjump);
      expect(applyColorFilters(pinjump, [])).to.equal(pinjump);
    });
  });

  describe('colorFiltersAreEqual', () => {
    it('compares filters by value', () => {
      const filters = [{ keypath: 'Pin 1.Shape 2.Fill 1', color: '#ff0000' }];

      expect(colorFiltersAreEqual(filters, [...filters])).to.equal(true);
      expect(colorFiltersAreEqual(filters, [{
        keypath: 'Pin 1.Shape 2.Fill 1',
        color: '#00ff00',
      }])).to.equal(false);
      expect(colorFiltersAreEqual(filters, [])).to.equal(false);
      expect(colorFiltersAreEqual([], [])).to.equal(true);
    });
  });
});
