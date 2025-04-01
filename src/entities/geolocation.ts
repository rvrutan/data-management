import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Project } from './project';

@Entity('geolocations')
export class Geolocation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'float', nullable: true })
  lat?: number;

  @Column({ type: 'float', nullable: true })
  long?: number;

  @Column({ nullable: true })
  nearestLandmark?: string;

  @OneToOne(() => Project, project => project.geolocation)
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  @Column()
  projectId!: number;
} 