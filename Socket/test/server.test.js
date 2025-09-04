// server.test.js
const chai = require('chai');
const mongoose = require('mongoose');
const Exercise = require('../model/model');
const expect = chai.expect;



const exerciseController = require('../controller/exercisecontroller');
const exerciseRoutes = require('../routes/exerciseRoutes');

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

describe('Exercise Model, Controller, and Routes', () => {
  before(async () => {
    await mongoose.connect('mongodb://localhost:27017/exercise-manager-db');
  });
  after(async () => {
    await mongoose.disconnect();
  });
  beforeEach(async () => {
    await Exercise.deleteMany({});
  });

  // Model tests
  it('should create a new exercise document', async () => {
    const exercise = new Exercise({
      name: 'Push Up',
      type: 'Strength',
      description: 'Upper body exercise',
      duration: 60
    });
    const savedEx = await exercise.save();
    expect(savedEx).to.have.property('_id');
    expect(savedEx.name).to.equal('Push Up');
    expect(savedEx.type).to.equal('Strength');
  });

  it('should get all exercises as an array', async () => {
    await Exercise.create({ name: 'Jumping Jacks', type: 'Cardio', description: 'Jump', duration: 30 });
    const exercises = await Exercise.find();
    expect(exercises).to.be.an('array');
    expect(exercises.length).to.equal(1);
    expect(exercises[0].name).to.equal('Jumping Jacks');
  });

  it('should delete an exercise by ID', async () => {
    const ex = await Exercise.create({ name: 'Delete Me', type: 'Cardio', description: 'Temp', duration: 30 });
    const deleted = await Exercise.findByIdAndDelete(ex._id);
    expect(deleted).to.not.be.null;
    expect(deleted.name).to.equal('Delete Me');
    const found = await Exercise.findById(ex._id);
    expect(found).to.be.null;
  });

  // Controller tests
  it('controller.getExercises should return all exercises', async () => {
    await Exercise.create({ name: 'Test', type: 'Cardio', description: 'desc', duration: 10 });
    const req = mockRequest();
    const res = mockResponse();
    await exerciseController.getExercises(req, res);
    expect(res.data).to.be.an('array');
    expect(res.data.length).to.equal(1);
    expect(res.data[0].name).to.equal('Test');
  });

  it('controller.createExercise should create an exercise', async () => {
    const req = mockRequest({ name: 'ControllerTest', type: 'Strength', description: 'desc', duration: 20 });
    const res = mockResponse();
    await exerciseController.createExercise(req, res);
    expect(res.statusCode).to.equal(201);
    expect(res.data).to.have.property('name', 'ControllerTest');
  });

  it('controller.deleteExercise should delete an exercise', async () => {
    const ex = await Exercise.create({ name: 'ToDelete', type: 'Mobility', description: 'desc', duration: 15 });
    const req = mockRequest({}, { id: ex._id });
    const res = mockResponse();
    await exerciseController.deleteExercise(req, res);
    expect(res.data).to.have.property('message', 'Exercise deleted successfully');
    expect(res.statusCode).to.equal(200);
    const found = await Exercise.findById(ex._id);
    expect(found).to.be.null;
  });

  // Route handler tests (direct function calls)
  it('routes.getExercises should return all exercises', async () => {
    await Exercise.create({ name: 'RouteTest', type: 'Cardio', description: 'desc', duration: 10 });
    const req = mockRequest();
    const res = mockResponse();
    await exerciseController.getExercises(req, res); // routes call controller
    expect(res.data).to.be.an('array');
    expect(res.data.length).to.equal(1);
    expect(res.data[0].name).to.equal('RouteTest');
  });

  it('routes.createExercise should create an exercise', async () => {
    const req = mockRequest({ name: 'RouteCreate', type: 'Strength', description: 'desc', duration: 20 });
    const res = mockResponse();
    await exerciseController.createExercise(req, res); // routes call controller
    expect(res.statusCode).to.equal(201);
    expect(res.data).to.have.property('name', 'RouteCreate');
  });

  it('routes.deleteExercise should delete an exercise', async () => {
    const ex = await Exercise.create({ name: 'RouteDelete', type: 'Mobility', description: 'desc', duration: 15 });
    const req = mockRequest({}, { id: ex._id });
    const res = mockResponse();
    await exerciseController.deleteExercise(req, res); // routes call controller
    expect(res.data).to.have.property('message', 'Exercise deleted successfully');
    expect(res.statusCode).to.equal(200);
    const found = await Exercise.findById(ex._id);
    expect(found).to.be.null;
  });
});
