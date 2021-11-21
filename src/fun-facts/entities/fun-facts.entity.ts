import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class FunFact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'text',
  })
  text: string;

  @Column({
    type: 'varchar',
    name: 'image_filename',
    nullable: true,
  })
  imageFilename: string;

  @Column({
    type: 'varchar',
    name: 'image_path',
    nullable: true,
  })
  imagePath: string;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: string;
}
