import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project';

@Entity('commodities')
export class Commodity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  primaryCommodity?: boolean;

  @ManyToOne(() => Project, project => project.commodities)
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  @Column()
  projectId!: number;
} 