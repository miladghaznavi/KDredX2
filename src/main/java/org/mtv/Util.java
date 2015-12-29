package org.mtv;

import java.util.ArrayList;

public class Util {
    private static final int COLUMN_BASE = 26;
    private static final int DIGIT_MAX = 7; // ceil(log26(Int32.Max))
    private static final String DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    public static String indexToColumn(int index) {
        if (index < 0)
            throw new IndexOutOfBoundsException("Index must be a none-negative number!");

        if (index < COLUMN_BASE)
            return Character.toString(DIGITS.charAt(index));

        String sb = "";
        int count = 0;
        int current = index;
        while (current >= 0 && count < DIGIT_MAX) {
            sb = DIGITS.charAt(current % COLUMN_BASE) + sb;
            current = current / COLUMN_BASE - 1;
            ++count;
        }//while
        return sb;
    }

    public static ArrayList<String> indicesToColumns(int start, int count) {
        ArrayList<String> list = new ArrayList<>();
        for (int i = start; i < start + count; ++i)
            list.add(indexToColumn(i));
        return list;
    }
}
