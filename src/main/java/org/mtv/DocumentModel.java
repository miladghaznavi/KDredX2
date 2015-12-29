package org.mtv;

import java.beans.PropertyChangeListener;

import static griffon.util.GriffonClassUtils.setPropertyValue;

public class DocumentModel extends Document {
    private Document document;

//    private final PropertyChangeListener proxyUpdater =
//            (e) -> setPropertyValue(this, e.getPropertyName(), e.getNewValue());
//
//    public DocumentModel() {
//        addPropertyChangeListener("document", (e) -> {
//            if (e.getOldValue() instanceof Document) {
//                ((Document) e.getOldValue()).removePropertyChangeListener(proxyUpdater);
//            }
//            if (e.getNewValue() instanceof Document) {
//                ((Document) e.getNewValue()).addPropertyChangeListener(proxyUpdater);
//                ((Document) e.getNewValue()).copyTo(DocumentModel.this);
//            }
//        });
//    }
//
//    public Document getDocument() {
//        return document;
//    }
//
//    public void setDocument(Document document) {
//        firePropertyChange("document", this.document, this.document = document);
//    }
}
