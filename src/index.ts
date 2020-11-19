import pino from 'pino';
import natsWrapper from './nats-wrapper';
import OrderCreatedListener from './events/listeners/order-created-listener';

const log = pino();

const connectToNats = async () => {
  const { NATS_CLUSTER_ID, NATS_URL, NATS_CLIENT_ID } = process.env;

  if (!NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);
  natsWrapper.client.on('close', () => {
    log.info('nats connection closed');
    process.exit();
  });
  process.on('SIGINT', () => natsWrapper.client.close());
  process.on('SIGTERM', () => natsWrapper.client.close());
  log.info('Connected to NATS');
};

const start = async () => {
  try {
    await connectToNats();
    log.info(process.env.REDIS_HOST!);
    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    log.error(err);
  }
};

start();
