// Copyright (c)2023 Quinn Michaels
// Story Deva test file

const {expect} = require('chai')
const StoryDeva = require('./index.js');

describe(StoryDeva.me.name, () => {
  beforeEach(() => {
    return StoryDeva.init()
  });
  it('Check the DEVA Object', () => {
    expect(StoryDeva).to.be.an('object');
    expect(StoryDeva).to.have.property('agent');
    expect(StoryDeva).to.have.property('vars');
    expect(StoryDeva).to.have.property('listeners');
    expect(StoryDeva).to.have.property('methods');
    expect(StoryDeva).to.have.property('modules');
  });
})
