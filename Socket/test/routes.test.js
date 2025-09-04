// routes.test.js
const chai = require('chai');
const mongoose = require('mongoose');
const exerciseRoutes = require('../routes/exerciseRoutes');
const express = require('express');
const Exercise = require('../model/model');
const expect = chai.expect;

// Helper to test routes without chai-http
function mockRequest(body = {}, params = {}) {
  return { body, params };
}
function mockResponse() {
  const res = {};
  res.statusCode = 200;
  res.status = function(code) { this.statusCode = code; return this; };
  res.json = function(data) { this.data = data; return this; };
  return res;
}

describe('Exercise Routes', () => {
  before(async () => {
    await mongoose.connect('mongodb://localhost:27017/exercise-manager-db');
  });
  after(async () => {
    await mongoose.disconnect();
  });
  beforeEach(async () => {
    await Exercise.deleteMany({});
  });

  it('GET /api/exercises should return all exercises', async () => {
    await Exercise.create({ name: 'Test', type: 'Cardio', description: 'desc', duration: 10 });
    const req = mockRequest();
    const res = mockResponse();
    await exerciseRoutes.getExercises(req, res);
    expect(res.data).to.be.an('array');
    expect(res.data.length).to.equal(1);
    expect(res.data[0].name).to.equal('Test');
  });

  it('POST /api/exercises should create an exercise', async () => {
    const req = mockRequest({ name: 'RouteTest', type: 'Strength', description: 'desc', duration: 20 });
    const res = mockResponse();
    await exerciseRoutes.createExercise(req, res);
    expect(res.statusCode).to.equal(201);
    expect(res.data).to.have.property('name', 'RouteTest');
  });

  it('DELETE /api/exercises/:id should delete an exercise', async () => {
    const ex = await Exercise.create({ name: 'ToDelete', type: 'Mobility', description: 'desc', duration: 15 });
    const req = mockRequest({}, { id: ex._id });
    const res = mockResponse();
    await exerciseRoutes.deleteExercise(req, res);
    expect(res.data).to.have.property('message', 'Exercise deleted successfully');
    expect(res.statusCode).to.equal(200);
    const found = await Exercise.findById(ex._id);
    expect(found).to.be.null;
  });
});
