package org.mtv.controls;

import griffon.core.artifact.GriffonController;
import griffon.metadata.ArtifactProviderFor;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonController;

import griffon.transform.Threading;

@ArtifactProviderFor(GriffonController.class)
public class CommonToolBoxController extends AbstractGriffonController {
    private CommonToolBoxModel model;

    public void setModel(CommonToolBoxModel model) {
        this.model = model;
    }
}