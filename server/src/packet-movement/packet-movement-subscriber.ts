import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { PacketMovement } from './packet-movement.model';

@EventSubscriber()
export class PacketMovementSubscriber
  implements EntitySubscriberInterface<PacketMovement>
{
  listenTo() {
    return PacketMovement;
  }

  afterInsert(event: InsertEvent<PacketMovement>) {
    console.log(`AFTER ENTITY INSERTED: `, event.entity);
  }
}
