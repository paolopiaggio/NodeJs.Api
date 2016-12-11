const simpleService = require('./../api/services/simpleService');
const assert = require('chai').assert

describe('Simple Service - getMyName', () => {
  it('should return my Name', () => {
    const result = simpleService.getMyName();
    assert.equal('Paolo', result);
  });
});
