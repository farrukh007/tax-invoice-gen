import db from '../index';
import { Client } from '@/types/database';

export class ClientsService {
  // Create a new client
  create(client: Omit<Client, 'id'>) {
    const stmt = db.prepare(`
      INSERT INTO clients (
        serialNumber, ntn, strn, cnic, customerName, 
        businessName, address, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now')
      )
    `);

    return db.transaction(() => {
      const result = stmt.run(
        client.serialNumber,
        client.ntn,
        client.strn,
        client.cnic,
        client.customerName,
        client.businessName,
        client.address
      );
      return result.lastInsertRowid;
    })();
  }

  // Get all clients
  getAll() {
    const stmt = db.prepare(`
      SELECT * FROM clients ORDER BY created_at DESC
    `);
    return stmt.all();
  }

  // Get a single client by ID
  getById(id: number) {
    const stmt = db.prepare('SELECT * FROM clients WHERE id = ?');
    return stmt.get(id);
  }

  // Update a client
  update(id: number, client: Partial<Client>) {
    const fields = Object.keys(client)
      .map(key => `${key} = ?`)
      .join(', ');

    const stmt = db.prepare(`
      UPDATE clients 
      SET ${fields}, updated_at = datetime('now')
      WHERE id = ?
    `);

    return db.transaction(() => {
      const result = stmt.run(...Object.values(client), id);
      return result.changes > 0;
    })();
  }

  // Delete a client
  delete(id: number) {
    const stmt = db.prepare('DELETE FROM clients WHERE id = ?');
    return db.transaction(() => {
      const result = stmt.run(id);
      return result.changes > 0;
    })();
  }

  // Check for duplicate NTN or CNIC
  checkDuplicate(ntn: string, cnic: string, excludeId?: number) {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count 
      FROM clients 
      WHERE (ntn = ? OR cnic = ?)
      ${excludeId ? 'AND id != ?' : ''}
    `);

    const params = [ntn, cnic];
    if (excludeId) params.push(excludeId);

    const result = stmt.get(...params) as { count: number };
    return result.count > 0;
  }

  // Search clients
  search(query: string) {
    const stmt = db.prepare(`
      SELECT * FROM clients 
      WHERE ntn LIKE ?
      OR strn LIKE ?
      OR cnic LIKE ?
      OR customerName LIKE ?
      OR businessName LIKE ?
      OR address LIKE ?
      ORDER BY created_at DESC
    `);

    const searchPattern = `%${query}%`;
    return stmt.all(Array(6).fill(searchPattern));
  }
}

export const clientsService = new ClientsService();