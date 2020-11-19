import { Queue, QueueScheduler, Worker } from 'bullmq';
import IORedis from 'ioredis';
import ExpirationCompletePublisher from '../events/publishers/expiration-complete-publisher';
import natsWrapper from '../nats-wrapper';

interface Payload {
  orderId: string;
}

const queueName = 'order:expiration';

const connection = new IORedis({
  host: process.env.REDIS_HOST,
});

const queueScheduler = new QueueScheduler(queueName, { connection });
const expirationQueue = new Queue<Payload>(queueName, { connection });

const worker = new Worker(
  queueName,
  async (job) => {
    new ExpirationCompletePublisher(natsWrapper.client).publish({
      orderId: job.data.orderId,
    });
  },
  { connection },
);

export default expirationQueue;
export { queueScheduler, worker };
