package org.mtv;

import griffon.core.artifact.GriffonController;
import griffon.metadata.ArtifactProviderFor;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonController;
import javax.annotation.Nonnull;
import java.util.Map;

@ArtifactProviderFor(GriffonController.class)
public class MultiTechVisController extends AbstractGriffonController {
    private MultiTechVisModel model;

    public void setModel(MultiTechVisModel model) {
        this.model = model;
    }

    public MultiTechVisModel getModel() {
        return model;
    }

    @Override
    public void mvcGroupInit(@Nonnull Map<String, Object> args) {

    }
}