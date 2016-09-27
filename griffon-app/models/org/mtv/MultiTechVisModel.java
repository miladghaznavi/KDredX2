package org.mtv;

import griffon.core.GriffonApplication;
import griffon.core.artifact.GriffonModel;
import griffon.metadata.ArtifactProviderFor;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonModel;

import javax.annotation.Nonnull;
import javax.inject.Inject;

@ArtifactProviderFor(GriffonModel.class)
public class MultiTechVisModel extends AbstractGriffonModel {
    @Inject
    public MultiTechVisModel(@Nonnull GriffonApplication application) {
        super(application);
    }

}