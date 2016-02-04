package org.mtv;

import griffon.core.GriffonApplication;
import javafx.scene.control.Alert;

import java.io.File;
import java.util.ArrayList;
import java.util.Optional;

import javafx.scene.control.ButtonBar;
import javafx.scene.control.ButtonType;
import javafx.stage.FileChooser;
import javafx.stage.Window;

import javax.annotation.Nullable;

public class Util {
    public enum SavingOption {
        Save,
        DoNotSave,
        Cancel,
    }

    private static final FileChooser fileChooser = new FileChooser();
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

    public static boolean isValidDouble(String s) {
        boolean result = true;
        try {
            Double.valueOf(s);
        }//try
        catch (NumberFormatException e) {
            result = false;
        }//catch
        return result;
    }

    @Nullable
    public static File saveDialog(GriffonApplication application) {
        Window window = (Window) application.getWindowManager().getStartingWindow();
        return fileChooser.showSaveDialog(window);
    }

    @Nullable
    public static File openDialog(GriffonApplication application) {
        Window window = (Window) application.getWindowManager().getStartingWindow();
        return fileChooser.showOpenDialog(window);
    }

    public static SavingOption askForSave(GriffonApplication application) {
        Alert alert = new Alert(Alert.AlertType.NONE);
        alert.setContentText(application.getMessageSource().getMessage("Dialog.AskSave"));
        ButtonType save = new ButtonType(application.getMessageSource().getMessage("Dialog.save"));
        ButtonType doNotSave = new ButtonType(application.getMessageSource().getMessage("Dialog.doNotSave"));
        ButtonType cancel = new ButtonType(
                application.getMessageSource().getMessage("Dialog.cancel"),
                ButtonBar.ButtonData.CANCEL_CLOSE);

        alert.getButtonTypes().setAll(save, doNotSave, cancel);
        Optional<ButtonType> result = alert.showAndWait();

        SavingOption savingOptions = SavingOption.Cancel;
        if (result.get() == save) {
            savingOptions = SavingOption.Save;
        }//if
        else if (result.get() == doNotSave) {
            savingOptions = SavingOption.DoNotSave;
        }//else if

        return savingOptions;
    }
}
