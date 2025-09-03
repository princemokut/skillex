/**
 * Availability routes
 * Handles user availability operations
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { authMiddleware } from '../auth/verify';
import { prisma } from '../lib/prisma';
import { 
  availabilityUpdateSchema, 
  availabilityResponseSchema 
} from '@skillex/types';

/**
 * Register availability routes
 * @param fastify Fastify instance
 */
export default async function availabilityRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * GET /v1/availability
   * Get the current user's availability
   * Protected endpoint
   */
  fastify.get('/availability', {
    preHandler: [authMiddleware],
    handler: async (request, reply) => {
      try {
        const userId = request.user?.id;
        
        if (!userId) {
          return reply.status(401).send({
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          });
        }
        
        // Fetch user availability from database
        const availability = await prisma.availability.findUnique({
          where: { userId },
        });
        
        if (!availability) {
          // Return default availability if not set yet
          return {
            userId,
            weekMask: Array(168).fill(false),
          };
        }
        
        // Validate response with schema
        return availabilityResponseSchema.parse(availability);
        
      } catch (error: any) {
        console.error('Error fetching user availability:', error);
        reply.status(500).send({
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching availability',
        });
      }
    },
  });
  
  /**
   * PUT /v1/availability
   * Update or create the current user's availability
   * Protected endpoint
   */
  fastify.put('/availability', {
    preHandler: [authMiddleware],
    schema: {
      body: {
        type: 'object',
        required: ['weekMask'],
        properties: {
          weekMask: {
            type: 'array',
            items: { type: 'boolean' },
            minItems: 168,
            maxItems: 168,
          },
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
        
        // Validate with schema
        const availabilityData = availabilityUpdateSchema.parse(request.body);
        
        // Upsert availability in database (update if exists, create if not)
        const availability = await prisma.availability.upsert({
          where: { userId },
          create: {
            userId,
            weekMask: availabilityData.weekMask,
          },
          update: {
            weekMask: availabilityData.weekMask,
          },
        });
        
        // Return updated availability
        return availabilityResponseSchema.parse(availability);
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            code: 'VALIDATION_ERROR',
            message: 'Invalid availability data',
            details: error.format(),
          });
        }
        
        console.error('Error updating availability:', error);
        reply.status(500).send({
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while updating availability',
        });
      }
    },
  });
}
