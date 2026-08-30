/**
 * Borrowing Power Calculator Test Suite
 */
const TEST_PORT = 3101;
process.env.API_BASE_URL = `http://localhost:${TEST_PORT}`;

const assert = require('assert');
const { createBorrowingCalculator } = require('./borrowing');
const api = require('./api');
const services = require('./services');
const server = require('./server');

describe('Borrowing Power Calculator', () => {

  const calculator = createBorrowingCalculator(services);

  before((done) => {
    server.listen(TEST_PORT, done); 
  });

  after((done) => {
    server.close(done); 
  });

  it('should refuse a request with no token', async () => {
    const response = await fetch(`http://localhost:${TEST_PORT}/api/tax?income=125000`); //calling api directly, bypass api.js
    assert.strictEqual(response.status, 401);
  });

  it('getApiData should return null when server rejects request', async () => {
    const data = await api.getApiData('api/ferocia');
    assert.strictEqual(data, null);
  });

  //checking services.js with server.md examples
  it('getTax should get the correct figure from server', async () => {
    const tax = await services.getTax(125000);
    assert.strictEqual(tax, 25750);
  });

  it('getHem should get the correct figure from server', async () => {
    const hem = await services.getHem(125000, 2);
    assert.strictEqual(hem, 3100);
  });

  it('should calculate borrowing power end to end', async () => {
    const result = await calculator.calculate({
      income: 125000,
      dependents: 2,
      expenses: 2000,
      creditLimits: 10000
    });
    assert.strictEqual(result.monthlyRepayment, 4870.83);
    assert.ok(result.maxLoanAmount > 0, 'Should return a positive borrowing power amount');
  });

  it('should return 0 when expenses leave nothing to repay a loan with', async () => {
    const result = await calculator.calculate({
      income: 30000,
      dependents: 3,
      expenses: 4000,
      creditLimits: 5000
    });

    assert.strictEqual(result.maxLoanAmount, 0);
    assert.strictEqual(result.monthlyRepayment, 0);
  });

  it('should return 0 for invalid negative inputs', async () => {
    const result = await calculator.calculate({
      income: -120000,
      dependents: 2,
      expenses: 3000,
      creditLimits: 10000
    });

    assert.strictEqual(result.maxLoanAmount, 0);
    assert.strictEqual(result.monthlyRepayment, 0);
  });

  describe('when the server is not running', () => {

    // Stop the server for the tests, then start again after
    before((done) => {
      server.close(done);
    });

    after((done) => {
      server.listen(TEST_PORT, done);
    });

    it('getApiData should return null when server cannot be reached', async () => {
      const data = await api.getApiData('api/tax?income=125000');
      assert.strictEqual(data, null);
    });

    it('getTax should return error when server cannot be reached', async () => {
      let error = null;
      try {
        await services.getTax(120000);
      } catch (rej) {
        error = rej;
      }
      assert.ok(error, 'Expected getTax to return error');
      assert.strictEqual(error.message, 'Could not get tax from the API');
    });
  });
});
