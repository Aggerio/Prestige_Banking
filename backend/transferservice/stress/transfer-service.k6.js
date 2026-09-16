import http from 'k6/http';
import { check, fail, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

const baseUrl = __ENV.BASE_URL || 'http://localhost:8080';
const sourceAccount = __ENV.SOURCE_ACCOUNT || 'PBS1000001';
const destinationAccount = __ENV.DESTINATION_ACCOUNT || 'PBS1000002';
const destinationName = __ENV.DESTINATION_NAME || 'Diya Patel';
const destinationIfsc = __ENV.DESTINATION_IFSC || 'PBS0001002';
const password = __ENV.TRANSACTION_PASSWORD || 'password';
const amount = __ENV.AMOUNT || '100.00';
const mode = __ENV.RUN_MODE || 'parallel';
const runId = __ENV.RUN_ID || `${Date.now()}`;

const transferLatency = new Trend('transfer_latency_ms', true);
const acceptedTransfers = new Counter('accepted_transfers');
const rejectedTransfers = new Counter('rejected_transfers');

function scenarioOptions() {
  if (mode === 'replay') return { replay: { executor: 'per-vu-iterations', vus: Number(__ENV.VUS || 20), iterations: 1, maxDuration: '30s' } };
  if (['limit', 'minimum-balance', 'max-success'].includes(mode)) return { rule: { executor: 'shared-iterations', vus: 1, iterations: 1, maxDuration: '30s' } };
  return { parallel: { executor: 'per-vu-iterations', vus: Number(__ENV.VUS || 10), iterations: Number(__ENV.ITERATIONS || 10), maxDuration: __ENV.MAX_DURATION || '2m' } };
}

const thresholds = { transfer_latency_ms: ['p(95)<5000'] };
if (!['limit', 'minimum-balance'].includes(mode)) thresholds.http_req_failed = ['rate<0.01'];
export const options = { scenarios: scenarioOptions(), thresholds };

function payload(value) {
  return JSON.stringify({ sourceAccountNumber: sourceAccount, destinationAccountNumber: destinationAccount, destinationAccountHolderName: destinationName, destinationIfscCode: destinationIfsc, amount: Number(value), transactionPassword: password });
}

function post(key, value) {
  const response = http.post(`${baseUrl}/api/v1/transfers`, payload(value), { headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key }, tags: { operation: 'transfer', mode } });
  transferLatency.add(response.timings.duration);
  return response;
}

function body(response) { try { return response.json(); } catch (_) { return {}; } }
function assertAccepted(response, name) {
  const ok = check(response, { [`${name}: created or replayed`]: (r) => r.status === 201 || r.status === 200 });
  if (ok) acceptedTransfers.add(1); else rejectedTransfers.add(1);
  return ok;
}

export default function () {
  if (mode === 'replay') {
    const response = post(`k6-replay-${runId}`, amount);
    assertAccepted(response, 'idempotent replay');
    check(body(response), { 'idempotent replay: reference returned': (b) => typeof b.referenceNumber === 'string' && b.referenceNumber.length > 0 });
    return;
  }
  if (mode === 'limit') {
    const response = post(`k6-limit-${runId}`, __ENV.LIMIT_AMOUNT || '50000.01');
    check(response, { 'over-limit transfer is rejected': (r) => r.status === 422 });
    check(body(response), { 'over-limit error code is stable': (b) => b.code === 'TRANSFER_LIMIT_EXCEEDED' });
    return;
  }
  if (mode === 'minimum-balance') {
    const response = post(`k6-minimum-balance-${runId}`, __ENV.MIN_BALANCE_AMOUNT || '0');
    check(response, { 'minimum-balance transfer is rejected': (r) => r.status === 422 });
    check(body(response), { 'minimum-balance error code is stable': (b) => b.code === 'MINIMUM_BALANCE_VIOLATION' });
    return;
  }
  if (mode === 'max-success') {
    const response = post(`k6-max-success-${runId}`, __ENV.MAX_AMOUNT || '50000.00');
    if (!assertAccepted(response, 'maximum allowed transfer')) fail(`maximum allowed transfer failed: ${response.status} ${response.body}`);
    return;
  }
  const response = post(`k6-parallel-${runId}-${__VU}-${__ITER}`, amount);
  assertAccepted(response, 'parallel unique transfer');
  sleep(Number(__ENV.THINK_TIME_SECONDS || 0));
}
