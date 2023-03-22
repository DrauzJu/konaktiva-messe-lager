import { PacketMovementType } from 'messe-lager-dto';
import { Packet } from 'src/packet/packet.model';
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

  async afterInsert(event: InsertEvent<PacketMovement>) {
    const packetRepository = event.manager.getRepository(Packet);

    const packet = event.entity.packet;
    packet.location = event.entity.newLocation;

    if (event.entity.type === PacketMovementType.DESTROY) {
      packet.isDestroyed = true;
      packet.location = '';
    }

    await packetRepository.save(packet);
  }
}
