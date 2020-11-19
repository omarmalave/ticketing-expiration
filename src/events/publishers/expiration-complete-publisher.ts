import { ExpirationCompleteEvent, Publisher, Subjects } from '@om_tickets/common';

class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}

export default ExpirationCompletePublisher;
