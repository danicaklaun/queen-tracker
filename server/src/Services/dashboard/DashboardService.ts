import { DashboardRepository } from "../../Database/repositories/dashboard/DashboardRepository";
export class DashboardService {
  private dashboardRepository = new DashboardRepository();

  async getDashboard(userId: number) {
    const [
      stats,
      oldQueens,
      lowRatedQueens,
      latestChecks,
      topQueens,
    ] = await Promise.all([
      this.dashboardRepository.getStats(userId),
      this.dashboardRepository.getOldQueens(userId),
      this.dashboardRepository.getLowRatedQueens(userId),
      this.dashboardRepository.getLatestChecks(userId),
      this.dashboardRepository.getTopQueens(userId),
    ]);

    return {
      stats,
      alerts: {
        oldQueens,
        lowRatedQueens,
      },
      latestChecks,
      topQueens,
    };
  }
}