import griffon.util.AbstractMapResourceBundle;

import javax.annotation.Nonnull;
import java.util.Map;

import static java.util.Arrays.asList;
import static griffon.util.CollectionUtils.map;

public class Config extends AbstractMapResourceBundle {
    private final static String TITLE = "KDredX2";

    @Override
    protected void initialize(@Nonnull Map<String, Object> entries) {
        map(entries)
            .e("application", map()
                .e("title", TITLE)
                .e("startupGroups", asList("kdx"))
                .e("autoShutdown", true)
            )
            .e("mvcGroups", map()
                .e("kdx", map()
                    .e("model", "org.kdx.KDXModel")
                    .e("view", "org.kdx.KDXView")
                    .e("controller", "org.kdx.KDXController")
                )
            );
    }
}