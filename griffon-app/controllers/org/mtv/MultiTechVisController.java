package org.mtv;

import griffon.core.artifact.GriffonController;
import griffon.metadata.ArtifactProviderFor;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonController;

import griffon.transform.Threading;

@ArtifactProviderFor(GriffonController.class)
public class MultiTechVisController extends AbstractGriffonController {
    private MultiTechVisView view;
    private MultiTechVisModel model;

    public void setModel(MultiTechVisModel model) {
        this.model = model;
    }


}