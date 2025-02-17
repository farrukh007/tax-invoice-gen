import db from '../index';
import { Importer } from '@/types/database';

export class ImportersService {
  // Create a new importer
  create(importer: Omit<Importer, 'id'>) {
    const stmt = db.prepare(`
      INSERT INTO importers (
        serialNumber, businessName, name, cnic, ntn,
        address, phone, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now')
      )
    `);

    return db.transaction(() => {
      const result = stmt.run(
        importer.serialNumber,
        importer.businessName,
        importer.name,
        importer.cnic,
        importer.ntn,
        importer.address,
        importer.phone
      );
      return result.lastInsertRowid;
    })();
  }

  // Get all importers
  getAll() {
    const stmt = db.prepare(`
      SELECT * FROM importers ORDER BY created_at DESC
    `);
    return stmt.all();
  }

  // Get a single importer by ID
  getById(id: number) {
    const stmt = db.prepare('SELECT * FROM importers WHERE id = ?');
    return stmt.get(id);
  }

  // Update an importer
  update(id: number, importer: Partial<Importer>) {
    const fields = Object.keys(importer)
      .map(key => `${key} = ?`)
      .join(', ');

    const stmt = db.prepare(`
      UPDATE importers 
      SET ${fields}, updated_at = datetime('now')
      WHERE id = ?
    `);

    return db.transaction(() => {
      const result = stmt.run(...Object.values(importer), id);
      return result.changes > 0;
    })();
  }

  // Delete an importer
  delete(id: number) {
    const stmt = db.prepare('DELETE FROM importers WHERE id = ?');
    return db.transaction(() => {
      const result = stmt.run(id);
      return result.changes > 0;
    })();
  }

  // Check for duplicate NTN or CNIC
  checkDuplicate(ntn: string, cnic: string, excludeId?: number) {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count 
      FROM importers 
      WHERE (ntn = ? OR cnic = ?)
      ${excludeId ? 'AND id != ?' : ''}
    `);

    const params = [ntn, cnic];
    if (excludeId) params.push(excludeId);

    const result = stmt.get(...params) as { count: number };
    return result.count > 0;
  }

  // Search importers
  search(query: string) {
    const stmt = db.prepare(`
      SELECT * FROM importers 
      WHERE ntn LIKE ?
      OR name LIKE ?
      OR cnic LIKE ?
      OR businessName LIKE ?
      OR address LIKE ?
      OR phone LIKE ?
      ORDER BY created_at DESC
    `);

    const searchPattern = `%${query}%`;
    return stmt.all(Array(6).fill(searchPattern));
  }
}

export const importersService = new ImportersService();