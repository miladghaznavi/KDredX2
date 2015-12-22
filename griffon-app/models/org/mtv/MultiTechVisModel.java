package org.mtv;

import griffon.core.artifact.GriffonModel;
import griffon.metadata.ArtifactProviderFor;
import javafx.beans.property.StringProperty;
import javafx.beans.property.SimpleStringProperty;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonModel;

import javax.annotation.Nonnull;

@ArtifactProviderFor(GriffonModel.class)
public class MultiTechVisModel extends AbstractGriffonModel {
    private static final String MVC_IDENTIFIER = "mvcIdentifier";
    private String mvcIdentifier;
}