/**
 * Skills routes
 * Handles user skills operations
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../auth/verify';
import { logger } from '../config/logger';
import { 
  skillCreateSchema, 
  skillResponseSchema 
} from '@skillex/types';

// Create Prisma client instance
const prisma = new PrismaClient();

/**
 * Register skills routes
 * @param fastify Fastify instance
 */
export default async function skillRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * GET /v1/skills/me
   * Get the current user's skills
   * Protected endpoint
   */
  fastify.get('/skills/me', {
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
        
        // Fetch user skills from database
        const skills = await prisma.skill.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });
        
        // Validate response with schema
        return { skills: skills.map((skill: any) => skillResponseSchema.parse(skill)) };
        
      } catch (error) {
        logger.error({ error }, 'Error fetching user skills');
        reply.status(500).send({
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching skills',
        });
      }
    },
  });
  
  /**
   * POST /v1/skills
   * Create a new skill for the current user
   * Protected endpoint
   */
  fastify.post('/skills', {
    preHandler: [authMiddleware],
    schema: {
      body: {
        type: 'object',
        required: ['kind', 'tags'],
        properties: {
          kind: { type: 'string', enum: ['teach', 'learn'] },
          tags: { type: 'array', items: { type: 'string' } },
          level: { type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
          notes: { type: 'string', maxLength: 500 },
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
        const skillData = skillCreateSchema.parse({
          ...(request.body as Record<string, unknown>),
          userId,
        });
        
        // Create skill in database
        const skill = await prisma.skill.create({
          data: skillData,
        });
        
        // Return created skill
        return skillResponseSchema.parse(skill);
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            code: 'VALIDATION_ERROR',
            message: 'Invalid skill data',
            details: error.format(),
          });
        }
        
        logger.error({ error }, 'Error creating skill');
        reply.status(500).send({
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating skill',
        });
      }
    },
  });
  
  /**
   * DELETE /v1/skills/:id
   * Delete a user skill
   * Protected endpoint
   */
  fastify.delete('/skills/:id', {
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
        
        // Find the skill
        const skill = await prisma.skill.findUnique({
          where: { id },
        });
        
        if (!skill) {
          return reply.status(404).send({
            code: 'NOT_FOUND',
            message: 'Skill not found',
          });
        }
        
        // Check if the user owns the skill
        if (skill.userId !== userId) {
          return reply.status(403).send({
            code: 'FORBIDDEN',
            message: 'You can only delete your own skills',
          });
        }
        
        // Delete the skill
        await prisma.skill.delete({
          where: { id },
        });
        
        return { success: true };
        
      } catch (error) {
        logger.error({ error }, 'Error deleting skill');
        reply.status(500).send({
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while deleting skill',
        });
      }
    },
  });
}
