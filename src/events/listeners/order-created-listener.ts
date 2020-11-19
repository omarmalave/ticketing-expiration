import { Listener, OrderCreatedEvent, Subjects } from '@om_tickets/common';
import { Message } from 'node-nats-streaming';
import queueGroupName from './queue-group-name';
import expirationQueue from '../../queue/expiration-queue';

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add(
      'orderCreated',
      { orderId: data.id },
      {
        delay,
      },
    );
    msg.ack();
  }
}
