import { describe, it, expect } from 'vitest';
import { flavors } from '../../data/flavors';

describe('Symi Flavor Data', () => {
  it('contains all 4 signature yogurt flavors', () => {
    expect(flavors).toHaveLength(4);
  });

  it('verifies required fields on all flavor definitions', () => {
    const expectedIds = ['kiwi', 'mango', 'berry', 'choco'];
    expect(flavors.map((f) => f.id)).toEqual(expectedIds);

    flavors.forEach((flavor) => {
      expect(flavor.name).toBeTruthy();
      expect(flavor.number).toMatch(/^\d{2}$/);
      expect(flavor.title).toHaveLength(2);
      expect(flavor.notes.length).toBeGreaterThan(0);
      expect(flavor.description).toBeTruthy();
      expect(flavor.ingredient).toBeTruthy();
      expect(flavor.width).toBeGreaterThan(0);
      expect(flavor.height).toBeGreaterThan(0);
    });
  });
});
