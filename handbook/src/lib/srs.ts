/**
 * Spaced Repetition Engine (SM-2 Adapted for NeetCode 150)
 *
 * Chu kỳ ôn tập lặp lại ngắt quãng (Spaced Repetition):
 * - Hard: Lặp lại sau 1 ngày. Giảm Ease factor -0.15 (tối thiểu 1.3).
 * - Medium: Lặp lại sau 3 ngày.
 * - Easy: Lần đầu lặp lại sau 7 ngày. Lần sau nhân với Ease factor. Tăng +0.15 (tối đa 3.5).
 * - Again: Đặt lại chu kỳ (interval = 0, nextReview = hôm nay).
 */

export interface SrsProgressItem {
  id: string;
  status: 'mastered' | 'learning' | 'new';
  lastSolved?: string;
  lastRating?: 'easy' | 'medium' | 'hard' | 'again';
  nextReview?: string;
  interval?: number;
  easeFactor?: number;
  repetitions?: number;
  note?: string;
  updatedAt?: number;
}

export type SrsProgressMap = Record<string, SrsProgressItem>;

export const SRS = {
  DEFAULT_EASE_FACTOR: 2.5,
  MIN_EASE_FACTOR: 1.3,
  MAX_EASE_FACTOR: 3.5,

  /**
   * Lấy ngày hôm nay định dạng YYYY-MM-DD theo giờ địa phương
   */
  getTodayStr(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Cộng thêm số ngày vào một ngày định dạng YYYY-MM-DD
   */
  addDays(dateStr: string, days: number): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    const nextYear = date.getFullYear();
    const nextMonth = String(date.getMonth() + 1).padStart(2, '0');
    const nextDay = String(date.getDate()).padStart(2, '0');
    return `${nextYear}-${nextMonth}-${nextDay}`;
  },

  /**
   * Tính số ngày còn lại đến hạn ôn tập
   * <= 0: đã đến hạn (Due/Overdue)
   * > 0: còn X ngày nữa
   */
  getDaysUntilDue(targetDateStr?: string): number {
    if (!targetDateStr) return 0;
    const todayStr = this.getTodayStr();
    const [y1, m1, d1] = todayStr.split('-').map(Number);
    const [y2, m2, d2] = targetDateStr.split('-').map(Number);
    const dToday = new Date(y1, m1 - 1, d1);
    const dTarget = new Date(y2, m2 - 1, d2);
    const diffTime = dTarget.getTime() - dToday.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * Kiểm tra bài tập đã đến hạn ôn tập chưa
   */
  isDue(progress?: SrsProgressItem): boolean {
    if (!progress || progress.status !== 'mastered' || !progress.nextReview) return false;
    const todayStr = this.getTodayStr();
    return progress.nextReview <= todayStr;
  },

  /**
   * Tính toán chu kỳ Spaced Repetition kế tiếp khi người dùng tick hoàn thành
   */
  calculateNextReview(
    currentProgress: SrsProgressItem | undefined,
    rating: 'easy' | 'medium' | 'hard' | 'again',
    customNote?: string
  ): SrsProgressItem {
    const todayStr = this.getTodayStr();
    let easeFactor = currentProgress?.easeFactor || this.DEFAULT_EASE_FACTOR;
    let repetitions = (currentProgress?.repetitions || 0) + 1;
    const prevInterval = currentProgress?.interval || 0;
    let nextInterval = 1;

    if (rating === 'again') {
      nextInterval = 0;
      repetitions = 0;
      easeFactor = Math.max(this.MIN_EASE_FACTOR, easeFactor - 0.2);
    } else if (rating === 'hard') {
      nextInterval = 1; // 1 ngày
      easeFactor = Math.max(this.MIN_EASE_FACTOR, easeFactor - 0.15);
    } else if (rating === 'medium') {
      nextInterval = 3; // 3 ngày
    } else if (rating === 'easy') {
      if (prevInterval < 7) {
        nextInterval = 7; // Lần đầu chọn Easy: 7 ngày
      } else {
        nextInterval = Math.max(7, Math.round(prevInterval * easeFactor));
      }
      easeFactor = Math.min(this.MAX_EASE_FACTOR, easeFactor + 0.15);
    }

    const nextReviewDate = this.addDays(todayStr, nextInterval);

    return {
      id: currentProgress?.id || '',
      status: 'mastered',
      lastSolved: todayStr,
      lastRating: rating,
      nextReview: nextReviewDate,
      interval: nextInterval,
      easeFactor: Number(easeFactor.toFixed(2)),
      repetitions,
      note: customNote !== undefined ? customNote : currentProgress?.note || '',
      updatedAt: Date.now(),
    };
  },
};
