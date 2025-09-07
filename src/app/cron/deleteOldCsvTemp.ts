/* eslint-disable no-console */
import cron from 'node-cron';
import { CsvTemp } from '../modules/CsvTemp/CsvTemp.model';

cron.schedule('0 */12 * * *', async () => {
  try {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

    const result = await CsvTemp.deleteMany({
      createdAt: { $lt: twelveHoursAgo },
    });

    console.log(`Cron job: Deleted ${result.deletedCount} old csv_temp rows`);
  } catch (err) {
    console.error('Cron job error:', err);
  }
});
