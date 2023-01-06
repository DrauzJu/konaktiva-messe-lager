import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  day: string;
}
