import { models } from 'elemental-orm';

class Invoice extends models.Model {
  id = models.AutoField({ primary_key: true });
  uuid = models.TextField();
  name = models.TextField();
  email = models.TextField();

  Meta = {
    db_table: 'invoices',
  }
}

export default Invoice;
