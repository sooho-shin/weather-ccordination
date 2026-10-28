import test from 'node:test';
import assert from 'node:assert/strict';
import { matchesLookbookContext } from '../../src/utils/lookbookContext';
import { OutfitLookbook } from '../../src/types/outfit';
import { WeatherData } from '../../src/types/weather';

test('AI recommendations disappear when weather or temperature band changes', () => {
  const lookbook = { gender: 'female', tpo: 'office', tempBand: '12to16', weatherState: 'Clear' } as OutfitLookbook;
  const weather = { temperature: 13, weatherState: 'Clear' } as WeatherData;
  assert.equal(matchesLookbookContext(lookbook, weather, 'female', 'office'), true);
  assert.equal(matchesLookbookContext(lookbook, { ...weather, temperature: -2 }, 'female', 'office'), false);
  assert.equal(matchesLookbookContext(lookbook, { ...weather, weatherState: 'Rain' }, 'female', 'office'), false);
  assert.equal(matchesLookbookContext(lookbook, weather, 'male', 'office'), false);
  assert.equal(matchesLookbookContext(lookbook, weather, 'female', 'daily'), false);
});
