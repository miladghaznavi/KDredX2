package org.mtv;

import javafx.scene.control.Alert;
import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicReference;

import javafx.stage.Stage;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class Util {
    private static final int COLUMN_BASE = 26;
    private static final int DIGIT_MAX = 7; // ceil(log26(Int32.Max))
    private static final String DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOGGER_NAME = "multi-tech-vis";

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

    public static void alert(Alert.AlertType type, String title, String message) {
        Alert alert = new Alert(type);
        alert.setTitle(title);
        alert.setContentText(message);
        alert.showAndWait();
    }

    public static void alertInfo(String title, String message) {
        alert(Alert.AlertType.INFORMATION, title, message);
    }

    public static void alertInfo(String message) {
        alertInfo("", message);
    }

    public static void alertWarning(String title, String message) {
        alert(Alert.AlertType.WARNING, title, message);
    }

    public static void alertWarning(String message) {
        alertWarning("", message);
    }

    public static void alertError(String title, String message) {
        alert(Alert.AlertType.ERROR, title, message);
    }

    public static void alertError(String message) {
        alertError("", message);
    }
}
