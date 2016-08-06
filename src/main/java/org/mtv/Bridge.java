package org.mtv;

import de.bripkens.svgexport.Format;
import de.bripkens.svgexport.SVGExport;
import javafx.stage.FileChooser;
import javafx.stage.Stage;
import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.JPEGTranscoder;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;

import java.io.*;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class Bridge {
    public static final String DATA   = "data";
    public static final String ERRORS = "errors";
    public static final String SELECTED = "selected";
    public static final String FILE = "file";
    public static final String TITLE = "title";
    public static final String PATH = "path";
    public static final String SVG = "svg";
    public static final String PNG = "png";
    public static final String PDF = "pdf";
    public static final String EPS = "eps";

    private Stage stage;

    public Stage getStage() {
        return stage;
    }

    public void setStage(Stage stage) {
        this.stage = stage;
    }

    public Bridge(Stage stage) {
        this.setStage(stage);
    }

    private void append(JSONObject json, ArrayList<ArrayList<String>> arrayLists, ArrayList<Exception> exceptions) {
        try {
            json.append(ERRORS, exceptions);
            if (exceptions.size() > 0) {
                arrayLists.clear();
            }//if
            json.append(DATA, arrayLists);
        } catch (JSONException e) { }//catch
    }

    public JSONObject openCSVFile(String formTitle) {
        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle(formTitle);
        File selectedFile = fileChooser.showOpenDialog(stage);

        JSONObject json = new JSONObject();

        try {
            json.append(SELECTED, (selectedFile != null));
        }//try
        catch(Exception e) {}//catch

        if (selectedFile != null) {
            Map<String, String> file = new HashMap<>();
            file.put("\"" + PATH + "\"", "\"" + selectedFile.getAbsolutePath() + "\"");
            file.put("\"" + TITLE + "\"", "\"" + selectedFile.getName() + "\"");

            ArrayList<ArrayList<String>> arrayLists = new ArrayList<>();
            ArrayList<Exception> exceptions = new ArrayList<>();
            try {
                json.append(FILE, file);

                Reader in = new FileReader(selectedFile.getPath());
                Iterable<CSVRecord> records = CSVFormat.EXCEL.parse(in);

                for (CSVRecord record : records) {
                    ArrayList<String> recordArr = new ArrayList<>();
                    for (Object field : record) {
                        recordArr.add("\"" + field.toString() + "\"");
                    }//for
                    arrayLists.add(recordArr);
                }//for
            }//try
            catch (Exception exc) {
                exceptions.add(exc);
            }//catch

            this.append(json, arrayLists, exceptions);
        }//else

        return json;
    }

    public JSONObject saveCSVFile(String formTitle, String paramStr) {
        JSONObject json = new JSONObject();

        try {
            JSONObject dataJson = new JSONObject(paramStr);
            String title = (!dataJson.isNull(TITLE)) ? dataJson.getString(TITLE) : "";
            String path  = (!dataJson.isNull(PATH )) ? dataJson.getString(PATH ) : "";

            FileChooser fileChooser = new FileChooser();

            boolean selected = false;

            if (title.equals("")) {
                fileChooser.setTitle(formTitle);
                File selectedFile = fileChooser.showSaveDialog(stage);
                selected = (selectedFile != null);
                if (selected) {
                    path  = selectedFile.getAbsolutePath();
                    title = selectedFile.getName();
                }//if
            }//if

            json.append(SELECTED, selected);
            Map<String, String> file = new HashMap<>();
            file.put(PATH, path);
            file.put(TITLE, title);
            json.append(FILE, file);

            ArrayList<Exception> exceptions = new ArrayList<>();
            if (!path.equals("")) {
                ArrayList<ArrayList<String>> lists = toArrayList(dataJson);
                try {
                    FileWriter out = new FileWriter(path);
                    CSVPrinter csvPrinter = new CSVPrinter(out, CSVFormat.EXCEL);
                    csvPrinter.printRecords(lists);
                    out.flush();
                    out.close();
                }//try
                catch (IOException exc) {
                    exceptions.add(exc);
                }//catch
            }//if
            json.append(ERRORS, exceptions);
        }//try
        catch(JSONException jsonExc) {

        }//catch

        return json;
    }

    public void saveAsPNG(String serializedSVGTag, String path) throws IOException, TranscoderException {
        // Create a JPEG transcoder
        JPEGTranscoder t = new JPEGTranscoder();

        // Set the transcoding hints.
        t.addTranscodingHint(JPEGTranscoder.KEY_QUALITY,
                new Float(.8));

        // Create the transcoder input.
        String svgURI = new File("/Users/eghaznav/Desktop/Test/test2.svg").toURL().toString();
        TranscoderInput input = new TranscoderInput(svgURI);

        // Create the transcoder output.
        OutputStream ostream = new FileOutputStream(path);
        TranscoderOutput output = new TranscoderOutput(ostream);

        // Save the image.
        t.transcode(input, output);

        // Flush and close the stream.
        ostream.flush();
        ostream.close();

    }

    public void saveAsSVG(String serializedSVGTag, String path) throws IOException {
        FileWriter writer = new FileWriter(path);
        writer.write(serializedSVGTag);
        writer.flush();
        writer.close();
    }

    public void saveAsPDF(String serializedSVGTag, String path) throws IOException {
        new SVGExport()
                .setInput (new ByteArrayInputStream(serializedSVGTag.getBytes()))
                .setOutput(new FileOutputStream(path))
                .setTranscoder(Format.PDF)
                .transcode();
    }

    public void saveAsEPS(String serializedSVGTag, String path) throws IOException {
        new SVGExport()
                .setInput (new ByteArrayInputStream(serializedSVGTag.getBytes()))
                .setOutput(new FileOutputStream(path))
                .setTranscoder(Format.PDF)
                .transcode();
    }

    private ArrayList<ArrayList<String>> toArrayList(JSONObject dataJson) throws JSONException {
        JSONArray sheet = dataJson.getJSONArray(DATA);

        ArrayList<ArrayList<String>> arrayLists = new ArrayList<>();

        for (int i = 0; i < sheet.length(); ++i) {
            JSONArray row = sheet.getJSONArray(i);

            ArrayList<String> list = new ArrayList<>();
            for (int j = 0; j < row.length(); ++j) {
                String column = (row.isNull(j)) ? "" : row.getString(j);
                list.add(column);
            }//for
            arrayLists.add(list);
        }//for

        return arrayLists;
    }

    public JSONObject saveAs(String serializedSVGTag, String type) {
        JSONObject json = new JSONObject();

        FileChooser fileChooser = new FileChooser();
        File selectedFile = fileChooser.showSaveDialog(stage);

        Map<String, String> file = new HashMap<>();
        ArrayList<Exception> exceptions = new ArrayList<>();
        if (selectedFile != null) {
            try {
                file.put(PATH, selectedFile.getAbsolutePath());
                file.put(TITLE, selectedFile.getName());
                switch (type) {
                    case SVG:
                        saveAsSVG(serializedSVGTag, selectedFile.getAbsolutePath());
                        break;

                    case PDF:
                        saveAsPDF(serializedSVGTag, selectedFile.getAbsolutePath());
                        break;

                    case EPS:
                        saveAsEPS(serializedSVGTag, selectedFile.getAbsolutePath());
                        break;

                    case PNG:
                        saveAsPNG(serializedSVGTag, selectedFile.getAbsolutePath());
                        break;
                }//switch
            }//try
            catch (Exception exc) {
                exceptions.add(exc);
            }//catch
        }//if

        try {
            json.append(FILE, file);
            json.append(ERRORS, exceptions);
        } catch (JSONException e) { }

        return json;
    }
}
