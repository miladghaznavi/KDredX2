package org.mtv;

import org.apache.commons.io.input.BOMInputStream;
import org.codehaus.griffon.runtime.core.AbstractObservable;
import org.apache.commons.csv.*;

import java.io.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Map;

/**
 * This class represents the data file it can be only csv
 */
public class Document extends AbstractObservable {
    private String title;
//    private boolean dirty;
    private File file;
    private ArrayList<CSVRecord> data;
    private Map<String, Integer> headerMap;

//    public Document(File file, String title) throws IOException {
//        this.setFile(file);
//        this.setTitle(title);
//    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        firePropertyChange("title", this.title, this.title = title);
    }

//    public boolean isDirty() {
//        return dirty;
//    }
//
//    public void setDirty(boolean dirty) {
//        firePropertyChange("dirty", this.dirty, this.dirty = dirty);
//    }

    public File getFile() {
        return file;
    }

    public void setData(ArrayList<CSVRecord> data, Map<String, Integer> headerMap)
            throws IllegalArgumentException {
        if (headerMap.size() != 0 || headerMap.size() != data.size()) {
            throw new IllegalArgumentException(
                    "Number of header maps must be either zero or equal to number of data columns");
        }//if

        if (data.size() > 0) {
            int len = data.get(0).size();
            for (int i = 1; i < data.size(); ++i) {
                if( len != data.get(i).size()) {
                    throw new IllegalArgumentException(
                            "Number of rows for column '" +
                                    headerMap.get(0) +
                                    "' is not equal to column '" +
                                    headerMap.get(i) + "'!");
                }//if
            }//for
        }//if

        this.data = data;
        this.headerMap = headerMap;
    }

    public ArrayList<CSVRecord> getData() {
        return data;
    }

    public Map<String, Integer> getHeaderMap() {
        return headerMap;
    }

    public void setFile(File file) throws IOException {
        if (!file.canRead()) {
            throw new IOException("CSV file '" + file.getPath() + "' is not readable!");
        }//if
        if (file.canWrite()) {
            throw new IOException("CSV file '" + file.getPath() + "' is not writable!");
        }//if

        firePropertyChange("file", this.file, this.file = file);
    }

    public void copyTo(Document doc) {
        doc.title = title;
//        doc.dirty = dirty;
        doc.file = file;
        doc.data = data;
        doc.headerMap = headerMap;
    }

    private void load() throws IOException {
        Reader reader = new FileReader(this.file);
        CSVParser parser = new CSVParser(reader, CSVFormat.EXCEL.withHeader());
        headerMap = parser.getHeaderMap();

        try {
            for (CSVRecord record : parser)
                data.add(record);
        }//try
        finally {
            reader.close();
        }//finally
    }

    private void save() throws IOException {
        Writer writer = new FileWriter(this.file);
        CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT);
        if (headerMap.size() != 0) {
            csvPrinter.printRecord(headerMap);
        }//if

        for (CSVRecord record : data) {
            csvPrinter.printRecord(record);
        }//for
    }
}
