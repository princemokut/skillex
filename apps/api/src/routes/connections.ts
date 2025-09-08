/**
 * Connection routes
 * Handles user connection operations
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../auth/verify';
import { logger } from '../config/logger';
import { 
  ConnectionStatus,
  connectionCreateSchema, 
  connectionUpdateSchema,
  connectionResponseSchema 
} from '@skillex/types';

// Create Prisma client instance
const prisma = new PrismaClient();

/**
 * Register connection routes
 * @param fastify Fastify instance
 */
export default async function connectionRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * POST /v1/connections/requests
   * Send a connection request to another user
   * Protected endpoint
   */
  fastify.post('/connections/requests', {
    preHandler: [authMiddleware],
    schema: {
      body: {
        type: 'object',
        required: ['addresseeId'],
        properties: {
          addresseeId: { type: 'string', format: 'uuid' },
        },
      },
    },
    handler: async (request, reply) => {
      try {
        const userId = request.user?.id;
        if (!userId) {
          return reply.status(401).send({
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          });
        }

        const { addresseeId } = request.body as { addresseeId: string };

        // Check if the addressee exists
        const addressee = await prisma.user.findUnique({
          where: { id: addresseeId },
        });

        if (!addressee) {
          return reply.status(404).send({
            code: 'NOT_FOUND',
            message: 'Addressee user not found',
          });
        }

        // Check if the user is trying to connect with themselves
        if (userId === addresseeId) {
          return reply.status(400).send({
            code: 'BAD_REQUEST',
            message: 'Cannot send a connection request to yourself',
          });
        }

        // Check if connection already exists
        const existingConnection = await prisma.connection.findFirst({
          where: {
            OR: [
              { requesterId: userId, addresseeId },
              { requesterId: addresseeId, addresseeId: userId },
            ],
          },
        });

        if (existingConnection) {
          return reply.status(400).send({
            code: 'BAD_REQUEST',
            message: 'Connection already exists',
            details: { status: existingConnection.status },
          });
        }

        // Create connection request
        const connection = await prisma.connection.create({
          data: {
            requesterId: userId,
            addresseeId,
            status: 'pending',
          },
        });

        // Create notification for the addressee
        await prisma.notification.create({
          data: {
            userId: addresseeId,
            kind: 'connection_request',
            payload: {
              connectionId: connection.id,
              requesterId: userId,
            },
          },
        });

        return connectionResponseSchema.parse(connection);
      } catch (error) {
        logger.error({ error }, 'Error creating connection request');
        reply.status(500).send({
          code: 'INTERNAL_ERROR',
          message: 'Failed to create connection request',
        });
      }
    },
  });

  /**
   * POST /v1/connections/:id/accept
   * Accept a connection request
   * Protected endpoint
   */
  fastify.post('/connections/:id/accept', {
    preHandler: [authMiddleware],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
    handler: async (request, reply) => {
      try {
        const userId = request.user?.id;
        if (!userId) {
          return reply.status(401).send({
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          });
        }

        const { id } = request.params as { id: string };

        // Find the connection
        const connection = await prisma.connection.findUnique({
          where: { id },
        });

        if (!connection) {
          return reply.status(404).send({
            code: 'NOT_FOUND',
            message: 'Connection not found',
          });
        }

        // Check if the user is the addressee
        if (connection.addresseeId !== userId) {
          return reply.status(403).send({
            code: 'FORBIDDEN',
            message: 'Only the addressee can accept this connection request',
          });
        }

        // Check if the connection is already accepted or blocked
        if (connection.status !== 'pending') {
          return reply.status(400).send({
            code: 'BAD_REQUEST',
            message: `Connection is already ${connection.status}`,
          });
        }

        // Update connection status
        const updatedConnection = await prisma.connection.update({
          where: { id },
          data: { status: 'accepted' },
        });

        // Create notification for the requester
        await prisma.notification.create({
          data: {
            userId: connection.requesterId,
            kind: 'connection_accepted',
            payload: {
              connectionId: connection.id,
              addresseeId: userId,
            },
          },
        });

        return connectionResponseSchema.parse(updatedConnection);
      } catch (error) {
        logger.error({ error }, 'Error accepting connection request');
        reply.status(500).send({
          code: 'INTERNAL_ERROR',
          message: 'Failed to accept connection request',
        });
      }
    },
  });

  /**
   * POST /v1/connections/:id/decline
   * Decline a connection request
   * Protected endpoint
   */
  fastify.post('/connections/:id/decline', {
    preHandler: [authMiddleware],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
    handler: async (request, reply) => {
      try {
        const userId = request.user?.id;
        if (!userId) {
          return reply.status(401).send({
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          });
        }

        const { id } = request.params as { id: string };

        // Find the connection
        const connection = await prisma.connection.findUnique({
          where: { id },
        });

        if (!connection) {
          return reply.status(404).send({
            code: 'NOT_FOUND',
            message: 'Connection not found',
          });
        }

        // Check if the user is the addressee
        if (connection.addresseeId !== userId) {
          return reply.status(403).send({
            code: 'FORBIDDEN',
            message: 'Only the addressee can decline this connection request',
          });
        }

        // Check if the connection is already accepted or blocked
        if (connection.status !== 'pending') {
          return reply.status(400).send({
            code: 'BAD_REQUEST',
            message: `Connection is already ${connection.status}`,
          });
        }

        // Delete the connection
        await prisma.connection.delete({
          where: { id },
        });

        return { success: true };
      } catch (error) {
        logger.error({ error }, 'Error declining connection request');
        reply.status(500).send({
          code: 'INTERNAL_ERROR',
          message: 'Failed to decline connection request',
        });
      }
    },
  });

  /**
   * GET /v1/connections
   * List user connections with optional status filter
   * Protected endpoint
   */
  fastify.get('/connections', {
    preHandler: [authMiddleware],
    schema: {
      querystring: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['pending', 'accepted', 'blocked'] },
        },
      },
    },
    handler: async (request, reply) => {
      try {
        const userId = request.user?.id;
        if (!userId) {
          return reply.status(401).send({
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          });
        }

        const query = request.query as { status?: ConnectionStatus };
        const statusFilter = query.status;

        // Build the filter conditions
        const whereCondition: any = {
          OR: [
            { requesterId: userId },
            { addresseeId: userId },
          ],
        };

        if (statusFilter) {
          whereCondition.status = statusFilter;
        }

        // Fetch connections
        const connections = await prisma.connection.findMany({
          where: whereCondition,
          include: {
            requester: {
              select: {
                id: true,
                handle: true,
                fullName: true,
                avatarUrl: true,
              },
            },
            addressee: {
              select: {
                id: true,
                handle: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        // Format the response
        const formattedConnections = connections.map((connection) => {
          const isRequester = connection.requesterId === userId;
          const otherUser = isRequester ? connection.addressee : connection.requester;
          
          return {
            ...connection,
            otherUser,
          };
        });

        return { connections: formattedConnections };
      } catch (error) {
        logger.error({ error }, 'Error fetching connections');
        reply.status(500).send({
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch connections',
        });
      }
    },
  });
}
