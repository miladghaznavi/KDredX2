package org.mtv;

import griffon.core.artifact.GriffonController;
import griffon.metadata.ArtifactProviderFor;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonController;

@ArtifactProviderFor(GriffonController.class)
public class ChartController extends AbstractGriffonController {
    private ChartModel model;

    public void setModel(ChartModel model) {
        this.model = model;
    }
}