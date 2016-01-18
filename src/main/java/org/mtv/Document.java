package org.mtv;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import org.codehaus.griffon.runtime.core.AbstractObservable;
import org.apache.commons.csv.*;
import org.controlsfx.control.spreadsheet.Grid;
import org.controlsfx.control.spreadsheet.GridBase;
import org.controlsfx.control.spreadsheet.SpreadsheetCell;
import org.controlsfx.control.spreadsheet.SpreadsheetCellType;

import java.io.*;
import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicReference;

/**
 * This class represents the data file it can be only csv
 */
public class Document extends AbstractObservable {
    public static final String DOCUMENT_ID = "document-id";
    private String path;
    private String title;
    private AtomicReference<Grid> grid;
    private ArrayList<ArrayList<String>> data = new ArrayList<>();

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        firePropertyChange("title", this.title, this.title = title);
    }

    public void setTitleFromPath() {
        title = new File(path).getName();
    }

    public Grid getGrid() {
        return grid.get();
    }

    public void setGrid(Grid grid) {
        if (this.grid == null) {
            this.grid = new AtomicReference<>(grid);
        }//if
        else {
            this.grid.set(grid);
        }//else
    }

    public void setData(ArrayList<ArrayList<String>> data) {
        this.data = data;
    }

    public ArrayList<ArrayList<String>> getData() {
        return data;
    }

    public ArrayList<String> getColumn(int column, boolean excludeFirstRow) {
        int start = (excludeFirstRow) ? 1 : 0;
        ArrayList<String> columnData = new ArrayList<>();

        for (int i = start; i < data.size(); ++i)
            columnData.add(data.get(i).get(column));

        return columnData;
    }

    public ArrayList<String> getColumn(int column) {
        return getColumn(column, false);
    }

    public void copyTo(Document doc) {
        doc.title = title;
        doc.path = path;
        doc.data = data;
    }

    public void load() throws IOException {
        Reader reader = new FileReader(new File(this.path));
        CSVParser parser = new CSVParser(reader, CSVFormat.EXCEL);
        int columnsCount = 0;
        int rowsCount = 0;
        ArrayList<ObservableList<SpreadsheetCell>> rows = new ArrayList<>();
        for (CSVRecord record : parser) {
            final ObservableList<SpreadsheetCell> dataRow = FXCollections.observableArrayList();
            columnsCount = Math.max(columnsCount, record.size());
            int column = 0;
            for (String field: record) {
                dataRow.add(
                        SpreadsheetCellType.STRING.createCell(rowsCount, column, 1, 1, field)
                );
                ++column;
            }//for
            rows.add(dataRow);
            ++rowsCount;
        }//for
        Grid newGrid = new GridBase(rowsCount, columnsCount);
        newGrid.setRows(rows);
        this.grid.set(newGrid);
    }

    public void save() throws IOException {
        Writer writer = new FileWriter(new File(this.path));
        CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT);

        if (grid != null) {
            for (ObservableList<SpreadsheetCell> record : grid.get().getRows()) {
                ArrayList<String> stringRecord = new ArrayList<>(record.size());
                for (SpreadsheetCell cell: record)
                    stringRecord.add((String)cell.getItem());
                csvPrinter.printRecord(stringRecord);
            }//for
        }//if

        csvPrinter.close();
        writer.close();
    }

    public static Document emptyDocument(String title, String path) throws IOException {
        Document document = new Document();
        document.setPath(path);
        document.setTitle(title);
        document.save();

        return document;
    }
}
