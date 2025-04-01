import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Company } from './company';
import { Asset } from './asset';
import { Commodity } from './commodity';
import { Geolocation } from './geolocation';
import { Production } from './production';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  projectNameTitle!: string;

  @Column({ nullable: true })
  assetType?: string;

  @Column({ nullable: true })
  workType?: string;

  @Column({ nullable: true })
  developmentStatus?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  mineTechnology?: string;

  @Column({ nullable: true })
  processingTechnology?: string;

  @Column({ nullable: true })
  country?: string;

  @ManyToOne(() => Company, company => company.projects)
  @JoinColumn({ name: 'companyId' })
  company!: Company;

  @Column()
  companyId!: number;

  @OneToMany(() => Asset, asset => asset.project)
  assets!: Asset[];

  @OneToMany(() => Commodity, commodity => commodity.project)
  commodities!: Commodity[];

  @OneToOne(() => Geolocation, geolocation => geolocation.project)
  geolocation!: Geolocation;

  @OneToOne(() => Production, production => production.project)
  production!: Production;
} 