import { Pool } from 'pg';
import crypto from 'crypto';

// Configuration for Guacamole Database
const guacDb = new Pool({
    user: 'guacamole_user',
    host: 'localhost',
    database: 'guacamole_db',
    password: 'guacamole_password',
    port: 5432,
});

export class GuacamoleService {

    /**
     * Creates a temporary VNC connection in Guacamole DB
     * @param name Display name for the connection
     * @param hostname Agent IP
     * @param port VNC Port
     * @param password VNC Password
     * @returns connectionId
     */
    async createConnection(name: string, hostname: string, port: number, password: string): Promise<string> {
        const client = await guacDb.connect();
        try {
            await client.query('BEGIN');

            // 1. Create Connection Record
            const resConn = await client.query(
                `INSERT INTO guacamole_connection (connection_name, protocol) VALUES ($1, 'vnc') RETURNING connection_id`,
                [name]
            );
            const connectionId = resConn.rows[0].connection_id;

            // 2. Add Parameters
            const params = [
                { name: 'hostname', value: hostname },
                { name: 'port', value: port.toString() },
                { name: 'password', value: password },
                { name: 'cursor', value: 'local' }, // Handle local cursor
                { name: 'color-depth', value: '24' }
            ];

            for (const param of params) {
                await client.query(
                    `INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value) VALUES ($1, $2, $3)`,
                    [connectionId, param.name, param.value]
                );
            }

            // 3. (Optional) Assign to a default user or group if needed
            // For now, we assume we might use the 'guacadmin' or a clean token auth mechanism
            // But usually, you need to assign permission to a user to access this connection.
            // Let's assign to 'guacadmin' for testing, or a specific technical user.

            // Find guacadmin user id (usually 1, but let's query)
            const resUser = await client.query(`SELECT user_id FROM guacamole_user WHERE username = 'guacadmin'`);
            if (resUser.rows.length > 0) {
                const userId = resUser.rows[0].user_id;
                await client.query(
                    `INSERT INTO guacamole_connection_permission (user_id, connection_id, permission) VALUES ($1, $2, 'READ')`,
                    [userId, connectionId]
                );
            }

            await client.query('COMMIT');
            return connectionId.toString();

        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    /**
     * Deletes a connection from Guacamole DB
     * @param connectionId 
     */
    async deleteConnection(connectionId: string): Promise<void> {
        try {
            await guacDb.query(`DELETE FROM guacamole_connection WHERE connection_id = $1`, [connectionId]);
        } catch (e) {
            console.error('[Guacamole] Error deleting connection:', e);
        }
    }

    /**
     * Generates a token for client-side access (If using shared key auth)
     * Note: This requires 'guacamole-auth-hmac' extension which is simpler for API integration
     * than DB manipulation. But since we chose DB manual setup, we might rely on
     * standard auth or just DB manipulation + pre-created users.
     * 
     * For this implementation, we will assume we are logging in as 'guacadmin' or 
     * a specific user via the standard login for the iframe, OR we implement the 
     * HMAC auth later. 
     * 
     * Let's stick to DB manipulation + standard auth for now (user logs in once).
     */
}
