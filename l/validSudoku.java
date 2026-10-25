package l;

import java.util.HashSet;
import java.util.Set;

/*
    Problem: Valid Sudoku (NeetCode / LeetCode 36)
    Difficulty: Medium

    Rules:
    A 9 x 9 Sudoku board is valid if:
    1. Each row must contain the digits 1-9 without duplicates.
    2. Each column must contain the digits 1-9 without duplicates.
    3. Each of the nine 3 x 3 sub-boxes must contain the digits 1-9 without duplicates.

    Note:
    - A board does not need to be full or solvable to be valid.
    - Only check filled cells ('1'-'9'), ignore empty cells ('.').

    Constraints:
    - board.length == 9
    - board[i].length == 9
    - board[i][j] is a digit '1'-'9' or '.'

    Recommended Complexity:
    - Time Complexity: O(n^2) where n = 9 -> O(1)
    - Space Complexity: O(n^2) where n = 9 -> O(1)
    
    hint 3:
    We can find the index of each square by the equation (row / 3) * 3 + (col / 3). 
                                                            3 - 6 -> 3 + 2 = 5
    Then we use hash set for O(1) lookups while inserting the number into its row, column and square it belongs to. We use separate hash maps for rows, columns, and squares.


*/

public class validSudoku {
    public boolean isValidSudoku(char[][] board) {
     
        Set<Character>[] rows = new HashSet[9];
        Set<Character>[] cols = new HashSet[9];
        Set<Character>[] boxes = new HashSet[9];


        // init
        for (int k = 0; k < 9; k++) {
            rows[k] = new HashSet<>();
            cols[k] = new HashSet<>();
            boxes[k] = new HashSet<>();
        }


        for(int i = 0; i < 9; i++) {
            for(int j = 0; j < 9; j++) {
                if(board[i][j] != '.') {
                    char val = board[i][j];
                    int boxIndex = (i / 3) * 3 + (j / 3);

                    if(!rows[i].add(val) || ! cols[j].add(val) || !boxes[boxIndex].add(val)) return false; 
                    // 1st: check if it exists on row i
                    // 2nd: chekc if it exists on 
                    // 3rd. so imagine each box has an index so we dont care the exact ij of the elements
                }
            }
        }




        return true;
    }


    
    public static void main(String[] args) {
        validSudoku solver = new validSudoku();

        // Example 1: Bảng Sudoku hợp lệ
        char[][] board1 = {
            {'1', '2', '.', '.', '3', '.', '.', '.', '.'},
            {'4', '.', '.', '5', '.', '.', '.', '.', '.'},
            {'.', '9', '8', '.', '.', '.', '.', '.', '3'},
            {'5', '.', '.', '.', '6', '.', '.', '.', '4'},
            {'.', '.', '.', '8', '.', '3', '.', '.', '5'},
            {'7', '.', '.', '.', '2', '.', '.', '.', '6'},
            {'.', '.', '.', '.', '.', '.', '2', '.', '.'},
            {'.', '.', '.', '4', '1', '9', '.', '.', '8'},
            {'.', '.', '.', '.', '8', '.', '.', '7', '9'}
        };
        System.out.println("Example 1: " + solver.isValidSudoku(board1) + " (Expected: true)");

        // Example 2: Không hợp lệ vì có 2 số '1' trong ô 3x3 góc trên bên trái
        char[][] board2 = {
            {'1', '2', '.', '.', '3', '.', '.', '.', '.'},
            {'4', '.', '.', '5', '.', '.', '.', '.', '.'},
            {'.', '9', '1', '.', '.', '.', '.', '.', '3'},
            {'5', '.', '.', '.', '6', '.', '.', '.', '4'},
            {'.', '.', '.', '8', '.', '3', '.', '.', '5'},
            {'7', '.', '.', '.', '2', '.', '.', '.', '6'},
            {'.', '.', '.', '.', '.', '.', '2', '.', '.'},
            {'.', '.', '.', '4', '1', '9', '.', '.', '8'},
            {'.', '.', '.', '.', '8', '.', '.', '7', '9'}
        };
        System.out.println("Example 2: " + solver.isValidSudoku(board2) + " (Expected: false)");
    }
}
