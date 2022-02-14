import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  bronze_badge_count: number;

  @Column()
  account_id: number;

  @Column()
  reputation: number;

  @Column()
  link: string;
}
