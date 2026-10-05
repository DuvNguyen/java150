/**
 * Spaced Repetition Engine (SM-2 + FSRS-inspired Modern Adjustments for LeetCode/DSA)
 *
 * Chu kỳ ôn tập lặp lại ngắt quãng (Spaced Repetition):
 * - Again: Đặt lại chu kỳ (interval = 0, nextReview = hôm nay). Giảm Ease factor -0.2 (tối thiểu 1.3).
 * - Hard: Lặp lại sau 1 ngày (hoặc 2 ngày nếu interval cũ lớn). Giảm nhẹ Ease factor -0.10 (tránh Ease Hell).
 * - Medium: Lần đầu lặp lại sau 3 ngày. Các lần sau nhân với Ease factor. Hỗ trợ phục hồi Ease factor nếu từng bị thấp.
 * - Easy: Lần đầu lặp lại sau 7 ngày. Các lần sau nhân với Ease factor. Tăng tốc độ phục hồi Ease factor (+0.25 khi < 2.2, +0.15 khi bình thường).
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

export const ANKI_DSA_TEMPLATE = `### 1. Pattern & Data Structure
- Kỹ thuật chính: 

### 2. Key Intuition (Ý tưởng cốt lõi)
- 

### 3. Edge Cases & Tricky Points
- 

### 4. Complexity
- Time: \`O(...)\`
- Space: \`O(...)\``;

export const SRS = {
  DEFAULT_EASE_FACTOR: 2.5,
  MIN_EASE_FACTOR: 1.3,
  MAX_EASE_FACTOR: 3.5,
  RECOMMENDED_DAILY_CAP: 5,

  /**
   * Lấy Ease factor mặc định theo độ khó bài toán
   */
  getDefaultEaseFactor(difficulty?: string): number {
    if (!difficulty) return this.DEFAULT_EASE_FACTOR;
    const d = difficulty.toLowerCase();
    if (d === 'easy') return 2.6;
    if (d === 'medium') return 2.4;
    if (d === 'hard') return 2.2;
    return this.DEFAULT_EASE_FACTOR;
  },

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
    customNote?: string,
    problemDifficulty?: string
  ): SrsProgressItem {
    const todayStr = this.getTodayStr();
    let easeFactor =
      currentProgress?.easeFactor || this.getDefaultEaseFactor(problemDifficulty);
    let repetitions = (currentProgress?.repetitions || 0) + 1;
    const prevInterval = currentProgress?.interval || 0;
    let nextInterval = 1;

    if (rating === 'again') {
      nextInterval = 0;
      repetitions = 0;
      easeFactor = Math.max(this.MIN_EASE_FACTOR, easeFactor - 0.2);
    } else if (rating === 'hard') {
      // Hard: ôn lại nhanh sau 1 ngày (hoặc 2 ngày nếu bài đã từng có interval dài > 14 ngày)
      nextInterval = prevInterval > 14 ? 2 : 1;
      // Tránh phạt quá nặng dẫn đến Ease Hell (-0.10 thay vì -0.15)
      easeFactor = Math.max(this.MIN_EASE_FACTOR, easeFactor - 0.1);
    } else if (rating === 'medium') {
      if (prevInterval < 3) {
        nextInterval = 3; // Lần đầu chọn Medium: 3 ngày
      } else {
        nextInterval = Math.max(4, Math.round(prevInterval * easeFactor));
      }
      // Cơ chế hồi phục Ease Hell: nếu Ease Factor đang thấp (< 2.2), tự động phục hồi nhẹ
      if (easeFactor < 2.2) {
        easeFactor = Math.min(this.DEFAULT_EASE_FACTOR, easeFactor + 0.1);
      }
    } else if (rating === 'easy') {
      if (prevInterval < 7) {
        nextInterval = 7; // Lần đầu chọn Easy: 7 ngày
      } else {
        nextInterval = Math.max(7, Math.round(prevInterval * easeFactor));
      }
      // Tăng Ease Factor (phục hồi nhanh hơn nếu đang ở mức thấp < 2.2)
      const boost = easeFactor < 2.2 ? 0.25 : 0.15;
      easeFactor = Math.min(this.MAX_EASE_FACTOR, easeFactor + boost);
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

/**
 * Trích xuất độ phức tạp thời gian và không gian từ ghi chú bài toán
 */
export function extractComplexityFromNote(note?: string): { time?: string; space?: string } | null {
  if (!note || !note.trim()) return null;

  const timeMatch = note.match(/(?:Time|Thời gian)\s*:\s*[`*]*([^\n\r,;`*]+)[`*]*/i);
  const spaceMatch = note.match(/(?:Space|Bộ nhớ|Không gian)\s*:\s*[`*]*([^\n\r,;`*]+)[`*]*/i);

  const cleanVal = (val?: string | null) => {
    if (!val) return undefined;
    const t = val.trim().replace(/[`*]/g, '');
    if (t === 'O()' || t === 'O(...)' || t === 'O(..)' || t === 'O' || t === '' || t === 'O(? )') {
      return undefined;
    }
    return t;
  };

  const time = cleanVal(timeMatch ? timeMatch[1] : null);
  const space = cleanVal(spaceMatch ? spaceMatch[1] : null);

  if (!time && !space) return null;
  return { time, space };
}

