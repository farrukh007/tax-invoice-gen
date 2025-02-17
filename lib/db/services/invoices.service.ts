import db from '../index';
import { Invoice } from '@/types/database';

export class InvoicesService {
  // Create a new invoice
  create(invoice: Omit<Invoice, 'id'>) {
    const stmt = db.prepare(`
      INSERT INTO invoices (
        invoiceNumber, date, clientId, importerId,
        particularsOfGoods, gdNumber, hsCode, fbrCode,
        qtyUnits, value, gst, valueAddedTax, unitPrice,
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        datetime('now'), datetime('now')
      )
    `);

    return db.transaction(() => {
      const result = stmt.run(
        invoice.invoiceNumber,
        invoice.date,
        invoice.clientId,
        invoice.importerId,
        invoice.particularsOfGoods,
        invoice.gdNumber,
        invoice.hsCode,
        invoice.fbrCode,
        invoice.qtyUnits,
        invoice.value,
        invoice.gst,
        invoice.valueAddedTax,
        invoice.unitPrice
      );
      return result.lastInsertRowid;
    })();
  }

  // Get all invoices with client and importer details
  getAll() {
    const stmt = db.prepare(`
      SELECT 
        i.*,
        c.businessName as clientName,
        c.ntn as clientNTN,
        im.businessName as importerName,
        im.ntn as importerNTN
      FROM invoices i
      JOIN clients c ON i.clientId = c.id
      JOIN importers im ON i.importerId = im.id
      ORDER BY i.created_at DESC
    `);
    return stmt.all();
  }

  // Get a single invoice by ID with related details
  getById(id: number) {
    const stmt = db.prepare(`
      SELECT 
        i.*,
        c.businessName as clientName,
        c.ntn as clientNTN,
        im.businessName as importerName,
        im.ntn as importerNTN
      FROM invoices i
      JOIN clients c ON i.clientId = c.id
      JOIN importers im ON i.importerId = im.id
      WHERE i.id = ?
    `);
    return stmt.get(id);
  }

  // Update an invoice
  update(id: number, invoice: Partial<Invoice>) {
    const fields = Object.keys(invoice)
      .map(key => `${key} = ?`)
      .join(', ');

    const stmt = db.prepare(`
      UPDATE invoices 
      SET ${fields}, updated_at = datetime('now')
      WHERE id = ?
    `);

    return db.transaction(() => {
      const result = stmt.run(...Object.values(invoice), id);
      return result.changes > 0;
    })();
  }

  // Delete an invoice
  delete(id: number) {
    const stmt = db.prepare('DELETE FROM invoices WHERE id = ?');
    return db.transaction(() => {
      const result = stmt.run(id);
      return result.changes > 0;
    })();
  }

  // Search invoices
  search(query: string) {
    const stmt = db.prepare(`
      SELECT 
        i.*,
        c.businessName as clientName,
        c.ntn as clientNTN,
        im.businessName as importerName,
        im.ntn as importerNTN
      FROM invoices i
      JOIN clients c ON i.clientId = c.id
      JOIN importers im ON i.importerId = im.id
      WHERE i.invoiceNumber LIKE ?
      OR i.fbrCode LIKE ?
      OR c.businessName LIKE ?
      OR im.businessName LIKE ?
      ORDER BY i.created_at DESC
    `);

    const searchPattern = `%${query}%`;
    return stmt.all(Array(4).fill(searchPattern));
  }

  // Get invoices by date range
  getByDateRange(startDate: string, endDate: string) {
    const stmt = db.prepare(`
      SELECT 
        i.*,
        c.businessName as clientName,
        c.ntn as clientNTN,
        im.businessName as importerName,
        im.ntn as importerNTN
      FROM invoices i
      JOIN clients c ON i.clientId = c.id
      JOIN importers im ON i.importerId = im.id
      WHERE i.date BETWEEN ? AND ?
      ORDER BY i.date DESC
    `);
    return stmt.all(startDate, endDate);
  }
}

export const invoicesService = new InvoicesService();