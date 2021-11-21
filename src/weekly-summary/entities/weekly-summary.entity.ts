import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'weekly_summary',
})
export class WeeklySummary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'date',
    unique: true,
  })
  date: string;

  @Column({
    type: 'int',
    name: 'released_products',
    nullable: true,
  })
  releasedProducts: number;

  @Column({
    type: 'int',
    name: 'pct_products_available',
    nullable: true,
  })
  pctProductsAvailable: number;

  @Column({
    type: 'int',
    name: 'pct_products_sold',
    nullable: true,
  })
  pctProductsSold: number;

  @Column({
    type: 'int',
    name: 'total_followers_fb',
    nullable: true,
  })
  totalFollowersFb: number;

  @Column({
    type: 'int',
    name: 'total_followers_insta',
    nullable: true,
  })
  totalFollowersInsta: number;

  @Column({
    type: 'int',
    name: 'engagement_fb',
    nullable: true,
  })
  engagementFb: number;

  @Column({
    type: 'int',
    name: 'engagement_insta',
    nullable: true,
  })
  engagementInsta: number;

  @Column({
    type: 'int',
    name: 'reach_fb',
    nullable: true,
  })
  reachFb: number;

  @Column({
    type: 'int',
    name: 'reach_insta',
    nullable: true,
  })
  reachInsta: number;

  @Column({
    type: 'int',
    name: 'ga_clicks',
    nullable: true,
  })
  gaClicks: number;

  @Column({
    type: 'int',
    name: 'ga_impressions',
    nullable: true,
  })
  gaImpressions: number;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: string;
}
