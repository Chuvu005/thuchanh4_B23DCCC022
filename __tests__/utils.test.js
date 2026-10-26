import { toScale4, calcGpa } from '../src/utils/gpa';
import { validateAssignmentForm, validateStudentProfile } from '../src/utils/validators';
import { formatDate, isOverdue } from '../src/utils/date';

describe('GPA Utilities', () => {
  test('toScale4 converts correctly according to regulation', () => {
    expect(toScale4(9.0)).toEqual({ letter: 'A', scale4: 4.0 });
    expect(toScale4(8.2)).toEqual({ letter: 'B+', scale4: 3.5 });
    expect(toScale4(7.5)).toEqual({ letter: 'B', scale4: 3.0 });
    expect(toScale4(6.7)).toEqual({ letter: 'C+', scale4: 2.5 });
    expect(toScale4(5.8)).toEqual({ letter: 'C', scale4: 2.0 });
    expect(toScale4(5.2)).toEqual({ letter: 'D+', scale4: 1.5 });
    expect(toScale4(4.5)).toEqual({ letter: 'D', scale4: 1.0 });
    expect(toScale4(3.5)).toEqual({ letter: 'F', scale4: 0.0 });
  });

  test('calcGpa calculates credit-weighted GPA', () => {
    const grades = [
      { total: 8.5, course: { credits: 3 } }, // A -> 4.0 * 3 = 12
      { total: 7.5, course: { credits: 2 } }, // B -> 3.0 * 2 = 6
    ];
    // totalPoints = 18, totalCredits = 5 -> GPA = 3.6
    const result = calcGpa(grades);
    expect(result.gpa).toBe(3.6);
    expect(result.totalCredits).toBe(5);
  });
});

describe('Validation Utilities', () => {
  test('validateAssignmentForm fails with empty title', () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const res = validateAssignmentForm({ title: '', courseId: 1, dueDate: future });
    expect(res.isValid).toBe(false);
    expect(res.errors.title).toBeDefined();
  });

  test('validateAssignmentForm fails with past due date', () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const res = validateAssignmentForm({ title: 'Test', courseId: 1, dueDate: past });
    expect(res.isValid).toBe(false);
    expect(res.errors.dueDate).toBeDefined();
  });

  test('validateAssignmentForm passes with valid data', () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const res = validateAssignmentForm({ title: 'Bài tập 1', courseId: 1, dueDate: future });
    expect(res.isValid).toBe(true);
  });
});
