import { TransactionHost } from '@nestjs-cls/transactional';
import type { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import type { PrismaService } from './prisma.service';

export type TxPrismaClient = TransactionHost<TransactionalAdapterPrisma<PrismaService>>;

export const TxPrismaClient = TransactionHost;
