/**
 * Connections API client for the skillex application
 * Provides methods for user connection operations
 */

import { apiGet, apiPost, apiPut, apiDelete } from './fetcher';
import { apiConfig } from '../lib/env';

/**
 * Connection interface
 */
export interface Connection {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: string;
  requester: {
    id: string;
    handle: string;
    fullName: string;
    avatarUrl?: string;
  };
  addressee: {
    id: string;
    handle: string;
    fullName: string;
    avatarUrl?: string;
  };
}

/**
 * Get all connections for the current user
 * 
 * @returns Promise resolving to user's connections
 */
export async function getUserConnections(): Promise<{
  sent: Connection[];
  received: Connection[];
  accepted: Connection[];
}> {
  return apiGet<{
    sent: Connection[];
    received: Connection[];
    accepted: Connection[];
  }>(apiConfig.endpoints.connections);
}

/**
 * Send a connection request
 * 
 * @param userId - User ID to send connection request to
 * @returns Promise resolving to created connection
 */
export async function sendConnectionRequest(userId: string): Promise<Connection> {
  return apiPost<Connection>(apiConfig.endpoints.connections, { addresseeId: userId });
}

/**
 * Accept a connection request
 * 
 * @param connectionId - Connection ID to accept
 * @returns Promise resolving to updated connection
 */
export async function acceptConnection(connectionId: string): Promise<Connection> {
  return apiPut<Connection>(`${apiConfig.endpoints.connections}/${connectionId}/accept`);
}

/**
 * Decline a connection request
 * 
 * @param connectionId - Connection ID to decline
 * @returns Promise resolving to success status
 */
export async function declineConnection(connectionId: string): Promise<{ success: boolean }> {
  return apiPut<{ success: boolean }>(`${apiConfig.endpoints.connections}/${connectionId}/decline`);
}

/**
 * Block a user
 * 
 * @param connectionId - Connection ID to block
 * @returns Promise resolving to updated connection
 */
export async function blockUser(connectionId: string): Promise<Connection> {
  return apiPut<Connection>(`${apiConfig.endpoints.connections}/${connectionId}/block`);
}

/**
 * Remove a connection
 * 
 * @param connectionId - Connection ID to remove
 * @returns Promise resolving to success status
 */
export async function removeConnection(connectionId: string): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`${apiConfig.endpoints.connections}/${connectionId}`);
}

/**
 * Get connection status with a specific user
 * 
 * @param userId - User ID to check connection status with
 * @returns Promise resolving to connection status
 */
export async function getConnectionStatus(userId: string): Promise<{
  status: 'none' | 'pending' | 'accepted' | 'blocked';
  connection?: Connection;
}> {
  return apiGet<{
    status: 'none' | 'pending' | 'accepted' | 'blocked';
    connection?: Connection;
  }>(`${apiConfig.endpoints.connections}/status/${userId}`);
}
