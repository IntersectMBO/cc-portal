import { CreateDateColumn, Timestamp, UpdateDateColumn } from "typeorm";

export class CommonEntity {
  @CreateDateColumn({ name: "created_at", type: "timestamp", nullable: false })
  createdAt: Timestamp;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", nullable: true })
  updatedAt: Timestamp;
}
